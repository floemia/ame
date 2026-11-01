import { Client, ClientEvents, Collection } from 'discord.js';
import { ContextMenuCommand, MessageCommand, SlashCommand } from '@structures/core';
import { EventHandler, InteractionHandler, MessageCommandHandler } from '@handlers';
import config_file from '@config';
import { LogHelper, TimeHelper } from '@utils/helpers';
import { OsuAPIRequestBuilder } from '@rian8337/osu-base';

/**
 * Main instance of the bot.
 */
export class AmeClient extends Client {
  /**
   * Configuration of the client.
   */
  config = config_file;

  /**
   * `Collection` of slash commands.
   */
  commands = new Collection<string, SlashCommand>();

  /**
   * `Collection` of developer slash commands.
   */
  dev_commands = new Collection<string, SlashCommand>();

  /**
   * `Collection` of context menu commands.
   */
  context_commands = new Collection<string, ContextMenuCommand>();

  /**
   * `Collection` of message commands, keyed by their name and aliases.
   */
  message_commands = new Collection<string, MessageCommand>();

  /**
   * `Collection` of client events.
   */
  events = new Collection<keyof ClientEvents, (client: AmeClient, ...args: any) => Promise<any>>();

  /**
   * The client's logger.
   */
  log = LogHelper.main;

  /**
   * Time since the bot was started.
   */
  startTime = TimeHelper.startTimer();

  constructor() {
    super({ intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'] });
  }

  /**
   * Main startup routine of the bot.
   */
  async start(): Promise<void> {
    OsuAPIRequestBuilder.setAPIKey(process.env.OSU_API_KEY!);
    this.log({
      prefix: 'START',
      message: 'executing startup routine...',
    });
    this.login(process.env.TOKEN);
    EventHandler.registerEvents();
    InteractionHandler.registerInteractions();
    MessageCommandHandler.registerMessageCommands();
  }
}
