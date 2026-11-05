import { AmeError } from '@core';
import { SlashCommand } from '@structures/core';
import { SlashCommandBuilder, TextDisplayBuilder } from 'discord.js';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { PaginationRowBuilder, ScoreContainerBuilder } from '@utils/builders';
import { CacheManager } from '@utils/managers';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();
  const user = await DroidHelper.getUser(interaction);
  if (!user) return;
  let index = interaction.options.getInteger('index') || 1;
  const scores = user.scores.recent.slice(0, 50);
  if (!scores.length) throw new AmeError(strings.no_scores);
  if (index > scores.length) index = scores.length;

  const build_page = async (page: number) => {
    const score = scores[page];
    const text = new TextDisplayBuilder().setContent(strings.commands.recent.success(user, page + 1));
    const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);
    if (score.beatmap) CacheManager.storeChannelBeatmap(interaction.channel!, score.hash);
    return [text, container] as const;
  };

  const row = new PaginationRowBuilder(interaction, async (button, page) => {
    await button.update({
      components: [...(await build_page(page)), row],
      flags: 'IsComponentsV2',
    });
  })
    .setLength(scores.length)
    .setIndex(index - 1);

  await InteractionHelper.reply(interaction, {
    components: [...(await build_page(index - 1)), row],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('recent')
  .setDescription('get the most recent scores from an osu!droid player!')
  .setDescriptionLocalization('es-ES', ' obtiene los úlimos scores de un jugador de osu!droid!')
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
  .addIntegerOption((option) =>
    option
      .setName('index')
      .setDescription('the n-th score to show (1 - 50). defaults to the most recent score.')
      .setDescriptionLocalization('es-ES', 'el n-ésimo score a mostrar (1 - 50). por defecto, el último score.')
      .setMinValue(1)
      .setMaxValue(50),
  );

export const dirname = __dirname;
