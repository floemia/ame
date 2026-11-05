import { client } from '@base';
import { DroidScore, DroidUser } from '@floemia/osu-droid-tools';
import { ScoreContainerBuilder } from '@utils/builders';
import { TextBasedChannel } from 'discord.js';

export abstract class CacheManager {
  /**
   * Contains fully processed score containers.
   */
  private static score_containers = new Map<string, ScoreContainerBuilder>();

  /**
   * Contains the latest mentioned beatmap in a channel.
   */
  private static channel_beatmap = new Map<string, string | number>();

  /**
   * Contains generated profile cards alongside a snapshot of the user they were generated from.
   */
  private static profile_cards = new Map<number, { snapshot: string; buffer: Buffer<ArrayBufferLike> }>();

  /**
   * Returns a representation of a `DroidUser` used to determine whether their profile card is still up to date.
   * @param user The `DroidUser`.
   */
  private static getProfileSnapshot(user: DroidUser): string {
    return JSON.stringify(user, (_key, value) => (value instanceof Map ? [...value.entries()] : value));
  }

  /**
   * Stores a fully processed score container.
   * @param score The `DroidScore` this container belongs to.
   * @param container The `ScoreContainerBuilder` of the score.
   */
  static storeScoreContainer(score: DroidScore, container: ScoreContainerBuilder): void {
    this.score_containers.set(`${score.id}-${score.played_at}`, container);
  }

  /**
   * Retrieves a stored score container.
   * @param score The `DroidScore` this container belongs to.
   */
  static getScoreContainer(score: DroidScore): ScoreContainerBuilder | undefined {
    return this.score_containers.get(`${score.id}-${score.played_at}`);
  }

  /**
   * Stores the generated profile card of a user.
   * @param user The `DroidUser` the card belongs to.
   * @param buffer The buffer of the generated profile card.
   */
  static storeProfileCard(user: DroidUser, buffer: Buffer<ArrayBufferLike>): void {
    this.profile_cards.set(user.id, { snapshot: this.getProfileSnapshot(user), buffer });
  }

  /**
   * Retrieves the generated profile card of a user if their data hasn't changed.
   * @param user The `DroidUser` the card belongs to.
   */
  static getProfileCard(user: DroidUser): Buffer<ArrayBufferLike> | undefined {
    const entry = this.profile_cards.get(user.id);
    if (!entry) return;
    if (entry.snapshot !== this.getProfileSnapshot(user)) {
      this.profile_cards.delete(user.id);
      return;
    }
    return entry.buffer;
  }

  /**
   * Stores the most recent mentioned beatmap in a channel.
   * @param channel The channel the beatmap was mentioned in.
   * @param beatmapOrLink Either a link or the MD5 hash of the beatmap.
   */
  static storeChannelBeatmap(channel: TextBasedChannel, idOrHash: string | number): void {
    this.channel_beatmap.set(channel.id, idOrHash);
    if (client.config.debug)
      client.log({
        prefix: 'DEBUG',
        message: `beatmap for channel ${channel.id} is now ${idOrHash}`,
      });
  }

  /**
   * Retrieves the ID or MD5 hash of the latest mentioned beatmap in a channel.
   * @param channel The requested channel.
   */
  static getChannelBeatmap(channel: TextBasedChannel): string | number | undefined {
    return this.channel_beatmap.get(channel.id);
  }
}
