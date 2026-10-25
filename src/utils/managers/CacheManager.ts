import { DroidScore } from '@floemia/osu-droid-tools';
import { ScoreContainerBuilder } from '@utils/builders';
import { TextBasedChannel } from 'discord.js';

export abstract class CacheManager {
  /**
   * Contains fully processed score containers.
   */
  private static score_containers = new Map<number, ScoreContainerBuilder>();

  /**
   * Contains the latest mentioned beatmap in a channel.
   */
  private static channel_beatmap = new Map<string, string | number>();

  /**
   * Stores a fully processed score container.
   * @param score The `DroidScore` this container belongs to.
   * @param container The `ScoreContainerBuilder` of the score.
   */
  static storeScoreContainer(score: DroidScore, container: ScoreContainerBuilder): void {
    this.score_containers.set(score.id, container);
  }

  /**
   * Retrieves a stored score container.
   * @param score The `DroidScore` this container belongs to.
   */
  static getScoreContainer(score: DroidScore): ScoreContainerBuilder | undefined {
    return this.score_containers.get(score.id);
  }

  /**
   * Stores the most recent mentioned beatmap in a channel.
   * @param channel The channel the beatmap was mentioned in.
   * @param beatmapOrLink Either a link or the MD5 hash of the beatmap.
   */
  static storeChannelBeatmap(channel: TextBasedChannel, idOrHash: string | number): void {
    this.channel_beatmap.set(channel.id, idOrHash);
  }

  /**
   * Retrieves the ID or MD5 hash of the latest mentioned beatmap in a channel.
   * @param channel The requested channel.
   */
  static getChannelBeatmap(channel: TextBasedChannel): string | number | undefined {
    return this.channel_beatmap.get(channel.id);
  }
}
