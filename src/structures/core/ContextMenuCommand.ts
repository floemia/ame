import { AmeClient } from '@core';
import { ResponseStrings } from '@localization';
import { ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import { Command } from '@structures/core';

/**
 * A generic context menu command.
 */
export interface ContextMenuCommand extends Command {
  /**
   * The main function of the context menu command.
   * @param client The instance of this client.
   * @param interaction The interaction that triggered the command.
   */
  run(client: AmeClient, interaction: MessageContextMenuCommandInteraction, response: ResponseStrings): Promise<any>;

  /**
   * The data of the context menu command.
   */
  data: ContextMenuCommandBuilder;
}
