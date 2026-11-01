import { client } from '@base';
import { FileManager } from '@utils/managers';
import fs from 'fs';
import path from 'path';

/**
 * Handles the avatar cycle system of the bot.
 */
export abstract class AvatarCycle {
  /**
   * The path of the avatar directory.
   */
  private static avatar_path = FileManager.getAvatarDirPath();

  /**
   * Interval between every avatar switch in seconds.
   */
  private static cooldown = client.config.cooldown.avatar;

  private static previous_avatars: string[] = [];

  /**
   * Starts the avatar cycle system.
   */
  static start() {
    setInterval(async () => {
      const avatars = fs.readdirSync(this.avatar_path).map((file) => path.join(this.avatar_path, file));
      const candidates = avatars.filter((pfp) => !this.previous_avatars.includes(pfp));
      if (candidates.length == 0) return;
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      if (this.previous_avatars.length == 2) this.previous_avatars.shift();
      this.previous_avatars.push(selected);
      await client.user!.setAvatar(selected);
    }, this.cooldown * 1000);
  }
}
