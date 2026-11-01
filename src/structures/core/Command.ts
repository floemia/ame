import { AmeClient } from '@core';
import { ResponseStrings } from '@localization';
import { CommandInteraction } from 'discord.js';

/**
 * A generic command.
 */
export interface Command<TTrigger = CommandInteraction, TArgs extends unknown[] = []> {
  /**
   * The main function of the command.
   * @param client The instance of this client.
   * @param trigger The interaction or message that triggered the command.
   * @param response The localized response strings.
   * @param args Any additional arguments passed to the command.
   */
  run(client: AmeClient, trigger: TTrigger, response: ResponseStrings, ...args: TArgs): Promise<any>;

  /**
   * The cooldown of the command. Will use the default in `client.config.cooldown.commands` if not set.
   */
  cooldown?: number;

  /**
   * Flag to disable the command.
   */
  disabled?: boolean;

  /**
   * Flag to restrict the command to external users.
   */
  developer?: boolean;

  /**
   * Data of the command.
   */
  data: any;
}
