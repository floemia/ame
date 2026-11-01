import { SlashCommand } from '@structures/core';
import { AmeError } from '@core';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { start, status, stop, update } from './subcommandgroups/tracking';
import { say } from './subcommandgroups/say';

export const developer: SlashCommand['developer'] = true;

export const run: SlashCommand['run'] = async (client, interaction, strings) => {
  if (interaction.user.id != client.config.developer) throw new AmeError(strings.no_perms);

  const group = interaction.options.getSubcommandGroup();
  const subcommand = interaction.options.getSubcommand();
  switch (group) {
    case 'tracking': {
      switch (subcommand) {
        case 'start':
          start(client, interaction, strings);
          break;
        case 'stop':
          stop(client, interaction, strings);
          break;
        case 'update':
          update(client, interaction, strings);
          break;
        case 'status':
          status(client, interaction, strings);
          break;
      }
      break;
    }
  }
  switch (subcommand) {
    case 'say':
      say(client, interaction, strings);
  }
};

export const data: SlashCommand['data'] = new SlashCommandBuilder()
  .setName('ame')
  .setDescription('general developer-only functions of the bot.')
  .setContexts(InteractionContextType.Guild)
  .addSubcommandGroup((group) =>
    group
      .setName('tracking')
      .setDescription('manages the osu!droid score tracking system!')
      .addSubcommand((sub) => sub.setName('start').setDescription('starts the score tracking system.'))
      .addSubcommand((sub) => sub.setName('stop').setDescription('stops the score tracking system.'))
      .addSubcommand((sub) => sub.setName('update').setDescription("updates all of the system's entries."))
      .addSubcommand((sub) => sub.setName('status').setDescription('shows the score tracking system status.')),
  )
  .addSubcommand((sub) =>
    sub
      .setName('say')
      .setDescription('i will say what you want!')
      .addStringOption((o) => o.setName('text').setDescription('the message you want me to send!').setRequired(true))
      .addChannelOption((o) => o.setName('channel').setDescription('the channel you want me to send a message to!')),
  );

export const dirname = __dirname;
