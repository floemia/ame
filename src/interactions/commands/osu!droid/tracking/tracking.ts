import { SlashCommand } from '@structures/core';
import { ChannelType, InteractionContextType, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { add, channel, remove, status } from './subcommands';
export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case 'add':
      add(client, interaction, strings);
      break;
    case 'remove':
      remove(client, interaction, strings);
      break;
    case 'status':
      status(client, interaction, strings);
      break;
    case 'channel':
      channel(client, interaction, strings);
      break;
  }
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('tracking')
  .setContexts(InteractionContextType.Guild)
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
  .setDescription('ure not supposed to read thsi')

  .addSubcommand((sub) =>
    sub
      .setName('channel')
      .setDescription('set the osu!droid scores tracking channel!')
      .setDescriptionLocalization('es-ES', 'cambia el canal de tracking de scores de osu!droid!')
      .addChannelOption((option) =>
        option
          .setName('channel')
          .addChannelTypes(ChannelType.GuildText)
          .setDescription('the desired channel.')
          .setDescriptionLocalization('es-ES', 'el canal deseado.')
          .setRequired(true),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('add')
      .setDescription('adds a user to the score tracking system!')
      .setDescriptionLocalization('es-ES', 'agrega a un usuario al sistema de tracking de scores!')
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
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('remove')
      .setDescription('removes a user from the score tracking system!')
      .setDescriptionLocalization('es-ES', 'elimina a un usuario del sistema de tracking de scores!')
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
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('status')
      .setDescription('set the osu!droid scores tracking status!')
      .setDescriptionLocalization('es-ES', 'cambia el estado del sistema de tracking de scores de osu!droid!')
      .addStringOption((option) =>
        option
          .setName('status')
          .setDescription('the status to set.')
          .setDescriptionLocalization('es-ES', 'el estado deseado.')
          .setRequired(true)
          .addChoices(
            { name: 'enabled', value: 'enabled', name_localizations: { 'es-ES': 'activado' } },
            { name: 'disabled', value: 'disabled', name_localizations: { 'es-ES': 'desactivado' } },
          ),
      ),
  );

export const dirname = __dirname;
