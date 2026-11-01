import { AmeClient } from '@core';
import { ResponseStrings } from '@localization';
import { Message } from 'discord.js';
import { Command } from '@structures/core';

/**
 * A generic message command, called with a prefix set per server.
 */
export interface MessageCommand extends Command<Message, [string[]]> {
  /**
   * The main function of the message command.
   * @param client The instance of this client.
   * @param message The message that triggered the command.
   * @param response The localized response strings.
   * @param args The arguments passed after the command.
   */
  run(client: AmeClient, message: Message, response: ResponseStrings, args: string[]): Promise<any>;

  /**
   * The data of the message command.
   */
  data: {
    /**
     * Other names the command can be called with.
     */
    aliases: string[];

    /**
     * The name of the command.
     */
    name: string;
  };
}
