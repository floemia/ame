import { client } from '@base';
import { FileManager } from '@utils/managers';
import { MessageCommand } from '@structures/core';
import path from 'path';

const commands_path = path.join(__dirname, '../messageCommands');

/**
 * Handles the registration of message commands.
 */
export abstract class MessageCommandHandler {
  /**
   * Registers all message commands found in the message commands directory.
   */
  static async registerMessageCommands() {
    client.log({
      prefix: 'START',
      message: 'registering message commands...',
    });

    let count = 0;
    const commandFiles = FileManager.getJSFiles(commands_path);
    for (const file of commandFiles) {
      const command = (await import(file)) as MessageCommand;
      if ('run' in command && 'data' in command) {
        client.message_commands.set(command.data.name, command);
        for (const alias of command.data.aliases) client.message_commands.set(alias, command);
        count++;
      }
    }

    client.log({
      prefix: 'START',
      message: `${count} message commands registered!`,
    });
  }
}
