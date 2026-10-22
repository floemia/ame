import { client } from '@base';
import { TimeHelper } from '@utils/helpers';
import { SlashCommand } from '@structures/core';
import chalk from 'chalk';
import { ClientEvents } from 'discord.js';

/**
 * Type of log.
 */
export type LogType = 'log' | 'warn' | 'error';

/**
 * Options for logging.
 */
export interface LogOptions {
  /**
   * Type of log.
   */
  type?: LogType;

  /**
   * Prefix to add before the message.
   */
  prefix?: string;

  /**
   * The command that triggered the log.
   */
  command?: SlashCommand;

  /**
   * The event that triggered the log.
   */
  event?: keyof ClientEvents;

  /**
   * The message to log.
   */
  message: string;

  /**
   * Custom accent hex color.
   */
  color?: string;
}

export abstract class LogHelper {
  /**
   * Main method to print something to the console.
   * @param type Type of log.
   */
  static main(params: LogOptions): void {
    const { type = 'log', command, event, message } = params;
    const isError = type == 'error';
    const date = TimeHelper.nowFormatted();
    let prefix = params.prefix;

    if (isError) prefix = 'ERROR';
    if (command) {
      params.color = params.color ?? client.config.colors.connection;
      prefix += `${command.data.name}`;
    }
    if (event) {
      params.color = params.color ?? client.config.colors.default;
      prefix += `${event}`;
    }

    const c = chalk.hex(isError ? client.config.colors.error : (params.color ?? client.config.colors.default));
    message.split('\n').forEach((line) => {
      if (line.trim()) {
        console[type](`${c('●')} ${date} ${c.bold(`[${prefix}]`)} ${line}\x1b[0m`);
      }
    });
  }
}
