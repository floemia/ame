import { client } from '@base';
import { GuildEmoji } from 'discord.js';

/**
 * Helps with emoji related operations.
 */
export abstract class EmojiHelper {
  /**
   * Converts a string representation of an emoji to a `GuildEmoji`.
   * @param str_emoji A string with an emoji => `<:emoji:123456789123>`
   * @returns
   */
  static toEmoji(str_emoji: string): GuildEmoji | undefined {
    const match = str_emoji.match(/^<a?:[^:]+:(\d+)>$/);
    if (!match) return;
    const id = match[1];
    return client.emojis.cache.get(id);
  }

  /**
   * Returns a random Ame-chan emoji.
   */
  static getRandomAmeEmoji(): GuildEmoji {
    const ame = client.config.emojis.ame;
    const length = ame.length;
    const random = Math.floor(Math.random() * (length - 1));
    return this.toEmoji(ame[random])!;
  }
}
