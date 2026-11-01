import { AmeError } from '@core';
import { SlashCommand } from '@structures/core';
import { PaginationRowBuilder, ScoreListContainerBuilder } from '@utils/builders';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { SlashCommandBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();
  const user = await DroidHelper.getUser(interaction);
  const scores = user.scores.best;
  if (scores.length == 0) throw new AmeError(strings.no_scores);

  const builder = (await new ScoreListContainerBuilder().setPlayer(user)).setScores(scores);
  const page = Math.min(Math.max((interaction.options.getInteger('page') || 1) - 1, 0), builder.pages - 1);

  const row = new PaginationRowBuilder(interaction, async (button, new_page) => {
    await button.update({
      components: [builder.setPage(new_page), row],
      flags: 'IsComponentsV2',
    });
  })
    .setLength(builder.pages)
    .setIndex(page);

  await InteractionHelper.reply(interaction, {
    components: [builder.setPage(page), row],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('top')
  .setDescription('shows the top 50 scores of a user!')
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
      .setName('page')
      .setDescription('the page to show. defaults to 1.')
      .setDescriptionLocalization('es-ES', 'la página a mostrar. por defecto, 1')
      .setMinValue(1)
      .setMaxValue(10),
  );

export const dirname = __dirname;
