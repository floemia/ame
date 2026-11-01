import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';
import { DatabaseManager } from './DatabaseManager';
import { ChannelType, Guild, PermissionFlagsBits, TextChannel, TextDisplayBuilder } from 'discord.js';
import { TrackingUser } from '@structures/database';
import { ScoreContainerBuilder } from '@utils/builders';
import { LocalizationHelper } from '@utils/helpers';

export abstract class TrackingManager {
  /**
   * Whether the tracking system is running or not.
   */
  static running = false;

  /**
   * The interval in milliseconds between each step.
   */
  static get interval(): number {
    return client.config.tracking.interval;
  }

  /**
   * The entries of the osu!droid score tracking system.
   */
  static entries: TrackingUser[] = [];

  /**
   * Gets all users tracked by the osu!droid score tracking system.
   * @returns An array of `DroidTrackingEntry` objects.
   */
  static async getUsers(): Promise<TrackingUser[]> {
    return DatabaseManager.getTrackingUsers();
  }
  /**
   * Adds a user to the tracking system.
   * @param user The `DroidUser` to add.
   * @param guild The `Guild` this user will be tracked in.
   */
  static addUser(user: DroidUser, guild: Guild): void {
    return DatabaseManager.storeTrackingUser(user, guild);
  }

  /**
   * Deletes a user from the tracking system of a guild.
   * @param user The `DroidUser` to delete.
   * @param guild The `Guild` this user is tracked in.
   */
  static deleteUser(user: DroidUser, guild: Guild): void {
    return DatabaseManager.removeTrackingUser(user, guild);
  }

  private static async getUser(user: TrackingUser): Promise<DroidUser | undefined> {
    try {
      return DroidUser.get(user.uid);
    } catch (error) {
      this.running = false;
      client.log({
        type: 'error',
        prefix: 'TRACKING',
        message: `osu!droid score tracking system stopped due to an error.`,
      });
    }
  }

  /**
   * Gets the score tracking channel for a given `Guild`.
   * @param guild The Discord `Guild`.
   * @returns The `TextChannel` set as the score tracking channel.
   */
  static async getTrackingChannel(guild: Guild): Promise<TextChannel | undefined> {
    const guild_config = DatabaseManager.getGuildConfig(guild);
    if (!guild_config) return;
    const channel = guild.channels.cache.get(guild_config.tracking.channel_id);
    return channel?.type == ChannelType.GuildText ? channel : undefined;
  }

  /**
   * Starts the score tracking system.
   */
  static async start(): Promise<void> {
    this.running = true;
    this.entries = DatabaseManager.getTrackingUsers();
    client.log({
      prefix: 'TRACKING',
      message: `the osu!droid score tracking system is starting with ${this.entries.length} entries.`,
      color: client.config.colors.tracking,
    });
    while (this.running) {
      for (const dbuser of this.entries) {
        if (!this.running || !this) break;
        await new Promise((resolve) => setTimeout(resolve, this.interval * 1000));
        const user = await this.getUser(dbuser);
        if (!user) continue;
        let scores = user.scores.recent
          .filter((score) => score.played_at.getTime() > dbuser.last_score_date)
          .slice(0, 3)
          .reverse();
        if (!scores.length) continue;

        client.log({ prefix: 'TRACKING', message: `processing ${scores.length} scores from ${user.username}...` });
        for (const score of scores) {
          if (!this.running) break;
          DatabaseManager.updateTrackingUser(user);
          const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);
          client.log({ prefix: 'TRACKING', message: `${score.filename} + ${score.mods.toString() || 'NM'}` });
          for (const dbguild of dbuser.servers) {
            const guild = client.guilds.cache.get(dbguild);
            if (!guild) continue;

            const track_channel = await this.getTrackingChannel(guild);
            if (!track_channel) continue;
            const strings = LocalizationHelper.getLocaleStrings(track_channel.guild.preferredLocale);
            const response = new TextDisplayBuilder().setContent(strings.commands.recent.success(user));

            const bot_member = guild.members.me!;
            if (!bot_member.permissionsIn(track_channel).has(PermissionFlagsBits.SendMessages)) continue;
            await track_channel.send({
              components: [response, container],
              flags: 'IsComponentsV2',
            });
          }

          // little delay to avoid flooding the channel with ten quintillion containers at once
          if (scores.length > 1) await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      this.entries = await this.getUsers();
    }
  }

  /**
   * Updates all of the osu!droid score tracking system's entries.
   */
  static async update(): Promise<void> {
    this.entries = DatabaseManager.getTrackingUsers();
    const prev_state = this.running;
    this.stop();
    client.log({ prefix: 'TRACKING', message: `updating ${this.entries.length} entries...` });
    for (const entry of this.entries) {
      const user = await this.getUser(entry);
      if (!user) continue;
      DatabaseManager.updateTrackingUser(user);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    client.log({ prefix: 'TRACKING', message: "the osu!droid score tracking system's entries has been updated." });
    if (prev_state) this.start();
  }

  /**
   * Stops the score tracking system.
   */
  static stop(): void {
    if (this.running)
      client.log({ prefix: 'TRACKING', message: 'the osu!droid score tracking system has been stopped.' });
    this.running = false;
  }
}
