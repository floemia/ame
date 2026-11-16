import { SlashCommand } from '@structures/core';
import { SlashCommandBuilder, TextDisplayBuilder } from 'discord.js';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { AmeError } from '@core';
import { ScoreContainerBuilder } from '@utils/builders';
import { CacheManager } from '@utils/managers';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();

  const user = await DroidHelper.getUser(interaction);
  const map = (await DroidHelper.getBeatmap(interaction))!;
  let bestpp = interaction.options.getBoolean('bestpp') || false;
  if (map.approved != 1) bestpp = false;
  const score = await DroidHelper.compare(user, map, bestpp ? 'pp' : 'score');
  if (!score) throw new AmeError(strings.commands.compare.no_score);

  const text = new TextDisplayBuilder().setContent(strings.commands.compare.success(user));
  const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);

  await InteractionHelper.reply(interaction, {
    components: [text, container],
    flags: 'IsComponentsV2',
  });

  CacheManager.storeChannelBeatmap(interaction.channel!, map.hash);
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('compare')
  .setDescription("gets your (or a player's) best score in a beatmap!")
  .setDescriptionLocalization('es-ES', ' obtiene tu mejor score (o el de otro jugador) en un beatmap!')
  .addStringOption((option) =>
    option
      .setName('beatmap')
      .setRequired(false)
      .setDescription(
        'the beatmap URL or ID to retrieve scores from. defaults to the most recent beatmap in the channel!',
      )
      .setDescriptionLocalization(
        'es-ES',
        'el ID o URL del beatmap del score a obtener. por defecto usa el último mapa mencionado en el canal!',
      ),
  )
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('the discord user linked to the osu!droid account.')
      .setDescriptionLocalization('es-ES', 'el usuario de discord vinculado al perfil de osu!droid.'),
  )
  .addIntegerOption((option) =>
    option
      .setName('uid')
      .setDescription('the user ID of the player.')
      .setDescriptionLocalization('es-ES', 'el ID de usuario del jugador.'),
  )
  .addStringOption((option) =>
    option
      .setName('username')
      .setDescription('the username of the player.')
      .setDescriptionLocalization('es-ES', 'el nombre de usuario del jugador.'),
  )
  .addBooleanOption((option) =>
    option
      .setName('bestpp')
      .setDescription('show the best score in terms of pp. defaults to true.')
      .setDescriptionLocalization('es-ES', 'mostrar el mejor score en términos de pp. por defecto, verdadero.'),
  );

export const dirname = __dirname;
