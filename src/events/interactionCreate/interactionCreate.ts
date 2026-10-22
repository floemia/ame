import { Event } from '@structures/core';
import { CooldownHandler } from '@handlers';
import { MessageFlags } from 'discord.js';

export const name = 'interactionCreate';

export const run: Event<'interactionCreate'>['run'] = async (client, interaction) => {
  // is a slash command!
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName) || client.dev_commands.get(interaction.commandName);
    if (!command) return;
    CooldownHandler.addCommand(command);
    const time_left = CooldownHandler.timeLeft(command, interaction.user);
    if (time_left > 0) return await interaction.followUp('cooldown');

    try {
      interaction.deferReply();
      await command.run(client, interaction);
    } catch (error: any) {
      client.log({ type: 'error', message: error });
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
};
