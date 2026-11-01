import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { TextChannel } from 'discord.js';

export const say: SlashCommand['run'] = async (client, interaction, strings) => {
  const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
  const text = interaction.options.getString('text', true);
  try {
    await channel.sendTyping();
    setTimeout(async () => {
      await channel.send(text);
      await InteractionHelper.replyOK(interaction, strings.done);
    }, Math.random() * 7);
  } catch (e) {
    console.log(e);
  }
};
