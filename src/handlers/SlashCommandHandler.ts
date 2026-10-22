import { client } from '@base';
import { FileManager } from '@utils/managers';
import { SlashCommand } from '@structures/core';
import { REST, Routes, type RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import path from 'path';

const commandsPath = path.join(__dirname, '../commands/');

/**
 * Handles the registration of slash commands.
 */
export abstract class SlashCommandHandler {
  /**
   * Registers all slash commands found in the commands directory.
   */
  static async registerCommands() {
    const devGuild = client.config.test_guild;
    if (!devGuild) throw new Error('No test guild provided in config.json');

    client.log({
      prefix: 'START',
      message: 'registering slash commands...',
    });

    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [],
      devCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    client.commands.clear();

    const commandFiles = FileManager.getJSFiles(commandsPath);
    for (const file of commandFiles) {
      const command = (await import(file)) as SlashCommand;
      if ('run' in command && 'data' in command) {
        if (command.disabled) {
        }
        if (command.developer) {
          devCommands.push(command.data.toJSON());
          client.dev_commands.set(command.data.name, command);
        } else {
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
        }
      }
    }
    // await client.application!.commands.set(commands);
    // await client.guilds.cache.get(`${devGuild}`)!.commands.set(devCommands);
    const rest = new REST().setToken(process.env.TOKEN!);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });
    client.log({
      prefix: 'START',
      message: `${client.commands.size} slash commands registered! (and ${client.dev_commands.size} developer commands!)`,
    });
  }
}
