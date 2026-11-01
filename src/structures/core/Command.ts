import { AmeClient } from '@core';
import { ResponseStrings } from '@localization';
import { CommandInteraction } from 'discord.js';

/**
 * A generic context menu command.
 */

export interface Command {
  /**
   * The main function of the command.
   * @param client The instance of this client.
   * @param interaction The interaction that triggered the command.
   */
  run(client: AmeClient, interaction: CommandInteraction, response: ResponseStrings): Promise<any>;

  /**
   * The cooldown of the context menu command. Will use the default in `client.config.cooldown.commands` if not set.
   */
  cooldown?: number;

  /**
   * Flag to disable the context menu command.
   */
  disabled?: boolean;

  /**
   * Flag to restrict the context menu command to external users.
   */
  developer?: boolean;

  /**
   * Data of the command.
   */
  data: any;
}
