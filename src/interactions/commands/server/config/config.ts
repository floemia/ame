import { SlashCommand } from '@structures/core';
import { InteractionContextType, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { prefix } from './subcommands';

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case 'prefix':
      await prefix(client, interaction, strings);
      break;
  }
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('config')
  .setContexts(InteractionContextType.Guild)
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
  .setDescription('manages the server configuration of the bot!')
  .setDescriptionLocalization('es-ES', 'gestiona la configuración del bot en el servidor!')
  .addSubcommand((sub) =>
    sub
      .setName('prefix')
      .setDescription('changes the prefix used to call message commands!')
      .setDescriptionLocalization('es-ES', 'cambia el prefijo usado para llamar los comandos de mensaje!')
      .addStringOption((option) =>
        option
          .setName('prefix')
          .setDescription('the new prefix.')
          .setDescriptionLocalization('es-ES', 'el nuevo prefijo.')
          .setRequired(true)
          .setMinLength(1),
      ),
  );

export const dirname = __dirname;
