import { SlashCommand } from '@structures/core';
import { APIContainerComponent, ContainerBuilder, SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const data: APIContainerComponent = JSON.parse(interaction.options.getString('data', true));

  await interaction.editReply({
    components: [new ContainerBuilder(data)],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('container')
  .setDescription('Builds a container from json data')
  .addStringOption((o) => o.setName('data').setDescription('API container data').setRequired(true));

export const dirname = __dirname;
