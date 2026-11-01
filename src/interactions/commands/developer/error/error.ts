import { AmeError } from '@core';
import { SlashCommand } from '@structures/core';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

export const developer: SlashCommand['developer'] = true;

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  const ameError = interaction.options.getBoolean('ame_error') || false;
  const error = ameError ? AmeError : Error;
  throw new error('iaicmocjojcqjcdioqjiqvlk test error');
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('error')
  .setDescription('throws an error...')
  .setContexts(InteractionContextType.Guild)
  .addBooleanOption((o) => o.setName('ame_error').setDescription('is ame error?'));

export const dirname = __dirname;
