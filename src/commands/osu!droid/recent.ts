import { SlashCommand } from '@structures/core';
import { SlashCommandBuilder } from 'discord.js';
import { DroidHelper } from '@utils/helpers';
import { ScoreContainerBuilder } from '@utils/builders';
import { CacheManager } from '@utils/managers';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const user = await DroidHelper.getUser(interaction);
  if (!user) return;
  console.log('A');

  const index = interaction.options.getInteger('index') || 1;

  const container = await new ScoreContainerBuilder().setPlayer(user).setScore(user.scores.recent[index - 1]);
  await interaction.editReply({
    content: '',
    components: [container],
    flags: 'IsComponentsV2',
  });
  if (user.scores.recent[index].beatmap)
    CacheManager.storeChannelBeatmap(interaction.channel!, user.scores.recent[index].hash);
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('recent')
  .setDescription('get the most recent scores from an osu!droid player!')
  .setDescriptionLocalization('es-ES', ' obtiene los úlimos scores de un jugador de osu!droid!')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('the Discord user linked to the osu!droid account.')
      .setDescriptionLocalization('es-ES', 'el usuario de Discord vinculado a la cuenta de osu!droid.'),
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
