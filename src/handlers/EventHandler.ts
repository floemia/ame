import { client } from '@base';
import { FileManager } from '@utils/managers';
import { Event } from '@structures/core';
import path from 'path';

const eventsPath = path.join(__dirname, '../events');

/**
 * Handles the registration of client events.
 */
export abstract class EventHandler {
  /**
   * Registers all client events found in the `events` directory.
   */
  public static async registerEvents() {
    client.log({
      prefix: 'START',
      message: 'registering events...',
    });
    const eventsFiles = FileManager.getJSFiles(eventsPath);
    for (const file of eventsFiles) {
      const event = (await import(file)) as Event<any>;
      if ('run' in event) {
        const run = (...args: any[]) => event.run(client, ...args);
        client.events.set(event.name, run);
        if (event.rest) {
          if (event.once) client.rest.once(event.name, run);
          else client.rest.on(event.name, run);
        } else {
          if (event.once) client.once(event.name, run);
          else client.on(event.name, run);
        }
      }
    }
    client.log({
      prefix: 'START',
      message: `${client.events.size} events registered!`,
    });
  }
}
