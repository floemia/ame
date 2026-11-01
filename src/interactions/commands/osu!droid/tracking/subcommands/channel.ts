import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { DatabaseManager } from '@utils/managers';
import { PermissionFlagsBits, TextChannel } from 'discord.js';

export const channel: SlashCommand['run'] = async (client, interaction, strings) => {
  const channel = interaction.options.getChannel('channel') as TextChannel;
  const botMember = interaction.guild?.members.me!;

  DatabaseManager.setGuildTrackingChannel(interaction.guild!, channel);
  const can_send = channel.permissionsFor(botMember).has(PermissionFlagsBits.SendMessages);
  await InteractionHelper.replyOK(interaction, strings.commands.tracking.channel_set(channel, can_send));
};
