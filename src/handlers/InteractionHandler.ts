import { client } from '@base';
import { FileManager } from '@utils/managers';
import { SlashCommand, ContextMenuCommand } from '@structures/core';
import { ContextMenuCommandBuilder, REST, Routes, type RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import path from 'path';

const interactions_path = path.join(__dirname, '../interactions');

/**
 * Handles the registration of interactions.
 */
export abstract class InteractionHandler {
  /**
   * Registers all slash commands found in the commands directory.
   */
  static async registerInteractions() {
    const devGuild = client.config.test_guild;
    if (!devGuild) throw new Error('No test guild provided in config.json');

    client.log({
      prefix: 'START',
      message: 'registering slash commands...',
    });

    const commands = [] as RESTPostAPIApplicationCommandsJSONBody[],
      devCommands = [] as RESTPostAPIApplicationCommandsJSONBody[];

    const commandFiles = FileManager.getJSFiles(interactions_path);
    for (const file of commandFiles) {
      const command = (await import(file)) as SlashCommand | ContextMenuCommand;
      if ('run' in command && 'data' in command) {
        // command is context menu
        if (command.data instanceof ContextMenuCommandBuilder) {
          commands.push(command.data.toJSON());
          client.context_commands.set(command.data.name, command as ContextMenuCommand);
          // command is slash command
        } else {
          if (command.developer) {
            devCommands.push(command.data.toJSON());
            client.dev_commands.set(command.data.name, command as SlashCommand);
          } else {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command as SlashCommand);
          }
        }
      }
    }

    const rest = new REST().setToken(process.env.TOKEN!);
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, devGuild), { body: devCommands });
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });
    client.log({
      prefix: 'START',
      message: `${client.commands.size} slash commands were registered! (and ${client.dev_commands.size} developer ones!)`,
    });
    client.log({
      prefix: 'START',
      message: `${client.context_commands.size} context menu commands were registered!`,
    });
  }
}
