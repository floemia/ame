import { DroidUser } from '@floemia/osu-droid-tools';
import { SlashCommand } from '@structures/core';
import { ProfileContainerBuilder } from '@utils/builders';
import { SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction) => {
  const user = await DroidUser.get(177955);
  const container = await new ProfileContainerBuilder(user!).createSmallProfile();

  await interaction.editReply({
    components: [container],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('shows the information of a user.');

export const dirname = __dirname;
