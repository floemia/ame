import { DroidUser } from '@floemia/osu-droid-tools';
import { SlashCommand } from '@structures/core';
import { ProfileContainerBuilder } from '@utils/builders';
import { SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction) => {};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('link')
  .setDescription('Links your Discord to an osu!droid profile.')
  .setDescriptionLocalization('es-ES', 'Vincula tu Discord a un perfil de osu!droid.')
  .addIntegerOption((o) =>
    o
      .setName('uid')
      .setDescription('The user ID of the osu!droid profile.')
      .setDescriptionLocalization('es-ES', 'El ID de usuario del perfil de osu!droid.'),
  )
  .addStringOption((o) =>
    o
      .setName('username')
      .setDescription('The username of the osu!droid profile.')
      .setDescriptionLocalization('es-ES', 'El nombre de usuario del perfil de osu!droid.'),
  );

export const dirname = __dirname;
