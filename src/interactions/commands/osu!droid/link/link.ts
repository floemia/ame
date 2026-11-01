import { SlashCommand } from '@structures/core';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { DatabaseManager } from '@utils/managers';
import { SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();

  const uid = interaction.options.getInteger('uid');
  const username = interaction.options.getString('username');
  if (!uid && !username) return await InteractionHelper.replyError(interaction, strings.no_params);

  const user = await DroidHelper.getUser((uid || username)!);
  if (!user) return InteractionHelper.replyError(interaction, strings.user_dne);

  DatabaseManager.linkDroidUser(interaction.user, user);
  const container = DroidHelper.createLinkContainer(user, strings);

  await InteractionHelper.reply(interaction, {
    components: [container],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('link')
  .setDescription('links your Discord to an osu!droid profile.')
  .setDescriptionLocalization('es-ES', 'vincula tu Discord a un perfil de osu!droid.')
  .addIntegerOption((o) =>
    o
      .setName('uid')
      .setDescription('the user ID of the osu!droid profile.')
      .setDescriptionLocalization('es-ES', 'el ID de usuario del perfil de osu!droid.'),
  )
  .addStringOption((o) =>
    o
      .setName('username')
      .setDescription('the username of the osu!droid profile.')
      .setDescriptionLocalization('es-ES', 'el nombre de usuario del perfil de osu!droid.'),
  );

export const dirname = __dirname;
