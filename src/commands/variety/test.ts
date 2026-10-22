import { SlashCommand } from '@structures/core';
import { InteractionHelper } from '@utils/helpers';
import { SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction) => {
  const container = InteractionHelper.createContainer(interaction, {
    message: 'holaa holahlo shshhldho',
  });

  await interaction.reply({
    components: [container],
    flags: ['Ephemeral', 'IsComponentsV2', 'SuppressNotifications'],
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder().setName('test').setDescription('Test command.');

export const dirname = __dirname;
