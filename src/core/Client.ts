import { Client } from 'discord.js';

const token = process.env.TOKEN;

/**
 * Main instance of the bot.
 */
export class AmeClient extends Client {
  constructor() {
    super({ intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'] });
  }

  async start(): Promise<void> {
    this.login(token);
  }
}
