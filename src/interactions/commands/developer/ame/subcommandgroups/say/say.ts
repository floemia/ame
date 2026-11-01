import { SlashCommand } from '@structures/core';
import { TextChannel } from 'discord.js';

export const start: SlashCommand['run'] = async (client, interaction, strings) => {
  const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
  const text = interaction.options.getString('text', true);
  try {
    await channel.sendTyping();
    setTimeout(
      () => async () => {
        await channel.send(text);
      },
      Math.random() * 7,
    );
  } catch {}
};
