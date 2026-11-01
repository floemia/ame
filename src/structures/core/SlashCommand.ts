import { AmeClient } from '@core';
import { ResponseStrings } from '@localization/ResponseStrings';
import { ChatInputCommandInteraction, SharedSlashCommand } from 'discord.js';
import { Command } from '@structures/core';

/**
 * A generic slash command.
 */
export interface SlashCommand extends Command<ChatInputCommandInteraction> {
  /**
   * The main function of the slash command.
   * @param client The instance of this client.
   * @param interaction The interaction that triggered the command.
   */
  run(client: AmeClient, interaction: ChatInputCommandInteraction, response: ResponseStrings): Promise<any>;

  /**
   * The data of the slash command.
   */
  data: SharedSlashCommand;
}
