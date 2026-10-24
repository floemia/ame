import { AmeClient } from '@core';
import { ResponseStrings } from '@localization/ResponseStrings';
import { ChatInputCommandInteraction, SharedSlashCommand } from 'discord.js';

/**
 * A generic slash command.
 */
export interface SlashCommand {
  /**
   * The main function of the slash command.
   * @param client The instance of this client.
   * @param interaction The interaction that triggered the command.
   */
  run(client: AmeClient, interaction: ChatInputCommandInteraction, response: ResponseStrings): Promise<any>;

  /**
   * The cooldown of the slash command. Will use the default in `client.config.cooldown.commands` if not set.
   */
  cooldown?: number;

  /**
   * Flag to disable the slash command.
   */
  disabled?: boolean;

  /**
   * Flag to restrict the slash command to external users.
   */
  developer?: boolean;

  /**
   * The data of the slash command.
   */
  data: SharedSlashCommand;
}
