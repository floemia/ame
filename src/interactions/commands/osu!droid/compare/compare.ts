import { SlashCommand } from '@structures/core';
import { SlashCommandBuilder, TextDisplayBuilder } from 'discord.js';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { AmeError } from '@core';
import { ScoreContainerBuilder } from '@utils/builders';
import { CacheManager } from '@utils/managers';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const user = await DroidHelper.getUser(interaction);
  const map = (await DroidHelper.getBeatmap(interaction))!;

  let bestpp = interaction.options.getBoolean('bestpp') || false;
  if (map.approved != 1) bestpp = false;
  const scores = await user.getScores({ beatmapOrHash: map, order: bestpp ? 'pp' : 'score' });
  if (!scores || scores.length == 0) throw new AmeError(strings.commands.compare.no_score);
  const score = scores[0];

  const text = new TextDisplayBuilder().setContent(strings.commands.compare.success(user));
  const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);

  await InteractionHelper.reply(interaction, {
    components: [text, container],
    flags: 'IsComponentsV2',
  });

  if (map) CacheManager.storeChannelBeatmap(interaction.channel!, map.hash);
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
      .setDescription('the Discord user linked to the osu!droid account.')
      .setDescriptionLocalization('es-ES', 'el usuario de Discord vinculado al perfil de osu!droid.'),
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
      .setDescription('if true, gets the best score in terms of pp. defaults to false!')
      .setDescriptionLocalization(
        'es-ES',
        'si es verdadero, obtiene el mejor score en términos de pp. por defecto es falso!',
      ),
  );

export const dirname = __dirname;
