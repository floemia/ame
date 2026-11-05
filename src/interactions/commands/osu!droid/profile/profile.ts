import { SlashCommand } from '@structures/core';
import { ProfileContainerBuilder } from '@utils/builders';
import { DroidHelper, InteractionHelper } from '@utils/helpers';
import { SlashCommandBuilder, TextDisplayBuilder } from 'discord.js';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  await interaction.deferReply();
  const user = await DroidHelper.getUser(interaction);
  const text = new TextDisplayBuilder().setContent(`### ${strings.commands.profile.success(user)}`);

  const container = await new ProfileContainerBuilder(user).createCard();
  await InteractionHelper.reply(interaction, {
    components: [text, container],
    files: [container.file!],
    flags: 'IsComponentsV2',
  });
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('get a profile card of a osu!droid player!')
  .setDescriptionLocalization('es-ES', 'obtiene una tarjeta de perfil de un jugador de osu!droid!')
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
  );

export const dirname = __dirname;
