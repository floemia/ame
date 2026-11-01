import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';
import {
  BeatmapDBEntry,
  DroidLinkData,
  ServerConfig,
  ServerDBEntry,
  TrackingConfig,
  TrackingUser,
  TrackingUserDBEntry,
} from '@structures/database';
import Database from 'better-sqlite3';
import { Guild, TextChannel, User } from 'discord.js';
import path from 'path';

const root = path.join(__dirname, '../../..');

/**
 * Manages the database that contains links between Discord accounts and osu!droid profiles.
 */
export abstract class DatabaseManager {
  /**
   * The path to the database file.
   */
  private static readonly db_path: string = path.join(root, './ame.db');

  /**
   * The database containing every table used by the bot.
   */
  private static db: Database.Database | undefined;

  /**
   * Returns the database, creating it and its tables if they don't exist.
   */
  private static getDatabase(): Database.Database {
    if (this.db) return this.db;
    const database = new Database(this.db_path);
    database.exec(
      'CREATE TABLE IF NOT EXISTS linked_users (' +
        'discord_id TEXT PRIMARY KEY NOT NULL,' +
        'uid INTEGER NOT NULL,' +
        'linked_date INTEGER NOT NULL);' +
        'CREATE TABLE IF NOT EXISTS beatmaps (' +
        'id INTEGER UNIQUE,' +
        'hash TEXT PRIMARY KEY,' +
        'data TEXT NOT NULL);' +
        'CREATE TABLE IF NOT EXISTS tracking_users (' +
        'uid INTEGER PRIMARY KEY NOT NULL,' +
        'servers TEXT NOT NULL,' +
        'last_score_date INTEGER NOT NULL);' +
        'CREATE TABLE IF NOT EXISTS server_configs (' +
        'guild_id TEXT PRIMARY KEY NOT NULL,' +
        'tracking TEXT NOT NULL)',
    );
    this.db = database;
    return database;
  }

  /**
   * Stores a link between a Discord user and an osu!droid profile.
   *
   * If the Discord user is already linked, the existing link is overwritten.
   * @param user The Discord user.
   * @param droidUser The osu!droid user to link the Discord user to.
   */
  static linkDroidUser(user: User, droidUser: DroidUser): void {
    this.getDatabase()
      .prepare(
        'INSERT INTO linked_users (discord_id, uid, linked_date) VALUES (?, ?, ?) ' +
          'ON CONFLICT(discord_id) DO UPDATE SET uid = excluded.uid, linked_date = excluded.linked_date',
      )
      .run(user.id, droidUser.id, Date.now());
    if (client.config.debug)
      client.log({
        prefix: 'DEBUG',
        message: `linked user ${droidUser.id} - ${droidUser.id} to ${user.id} - ${user.username}, saved in link database`,
      });
  }

  /**
   * Retrieves the link data of a Discord user. `undefined` if unlinked
   * @param user The Discord user.
   */
  static getUserLink(user: User): DroidLinkData | undefined {
    const droidUser = this.getDatabase()
      .prepare('SELECT discord_id, uid, linked_date FROM linked_users WHERE discord_id = ?')
      .get(user.id) as DroidLinkData | undefined;

    if (droidUser) {
      if (client.config.debug)
        client.log({
          prefix: 'DEBUG',
          message: `got linked user ${droidUser.uid} to ${user.id} - ${user.username} from link database`,
        });
    } else {
      if (client.config.debug)
        client.log({
          prefix: 'DEBUG',
          message: `${user.id} - ${user.username}, saved in link database`,
        });
    }

    return droidUser;
  }

  /**
   * Retrieves the content of a stored .osu beatmap file.
   * @param hashOrID The ID or the MD5 hash of the beatmap.
   */
  static getBeatmap(hash: string): string | undefined {
    const entry = this.getDatabase().prepare('SELECT data FROM beatmaps WHERE hash = ?').get(hash) as BeatmapDBEntry;
    if (!entry) return;
    if (client.config.debug) client.log({ prefix: 'DEBUG', message: `got beatmap ${hash} from the database` });
    return entry.data;
  }

  /**
   * Stores a beatmap into the database.
   * @param hash MD5 hash of the beatmap.
   * @param id ID of the beatmap.
   * @param osu_file The contents of the .osu file.
   */
  static storeBeatmap(hash: string, id: number, osu_file: string): void {
    this.getDatabase()
      .prepare(
        `
  INSERT INTO beatmaps (id, hash, data)
  VALUES (@id, @hash, @data)
  ON CONFLICT(hash) DO UPDATE SET
    id = COALESCE(excluded.id, beatmaps.id),
    data = excluded.data`,
      )
      .run({ id, hash, data: osu_file });
    if (client.config.debug) client.log({ prefix: 'DEBUG', message: `stored beatmap ${id} - ${hash} in the database` });
  }

  /**
   * Adds a user to the score tracking system in a specific server.
   * @param user The `DroidUser` to track
   * @param guild The guild to track this user in.
   */
  static storeTrackingUser(user: DroidUser, guild: Guild): void {
    const last_score_date = user.scores.recent[0]?.played_at.getTime() ?? Date.now();
    const inDB = this.getTrackingUser(user);

    if (!inDB) {
      this.getDatabase()
        .prepare('INSERT INTO tracking_users (uid, servers, last_score_date) VALUES (?, ?, ?)')
        .run(user.id, JSON.stringify([guild.id]), last_score_date);

      if (client.config.debug)
        client.log({
          prefix: 'DEBUG',
          message: `stored user ${user.username} - ${user.id} - guild ${guild.id} in the score tracking database`,
        });
    } else if (!inDB.servers.includes(guild.id)) {
      inDB.servers.push(guild.id);
      this.getDatabase()
        .prepare('UPDATE tracking_users SET servers = ? WHERE uid = ?')
        .run(JSON.stringify(inDB.servers), user.id);

      if (client.config.debug)
        client.log({
          prefix: 'DEBUG',
          message: `added ${user.username} - ${user.id} to new guild ${guild.id} in the score tracking database`,
        });
    }
  }

  /**
   * Retrieves a tracked user by their osu!droid user ID. `undefined` if not tracked.
   * @param uid The osu!droid user ID.
   */
  static getTrackingUser(user: DroidUser): TrackingUser | undefined {
    const entry = this.getDatabase()
      .prepare('SELECT uid, servers, last_score_date FROM tracking_users WHERE uid = ?')
      .get(user.id) as TrackingUserDBEntry | undefined;
    if (!entry) return;
    return this.mapTrackingEntry(entry);
  }

  /**
   * Returns an entry of the tracking database as a usable format.
   * @param entry An entry of the user tracking database.
   */
  static mapTrackingEntry(entry: TrackingUserDBEntry): TrackingUser {
    let servers: string[] = [];
    servers = JSON.parse(entry.servers);
    return {
      uid: entry.uid,
      servers,
      last_score_date: entry.last_score_date,
    };
  }

  /**
   * Retrieves every user in the score tracking system.
   */
  static getTrackingUsers(): TrackingUser[] {
    const entries = this.getDatabase()
      .prepare('SELECT uid, servers, last_score_date FROM tracking_users')
      .all() as TrackingUserDBEntry[];
    return entries.map((entry) => this.mapTrackingEntry(entry));
  }

  /**
   * Updates the date of the latest processed score of a tracked user.
   * @param uid The osu!droid user ID.
   */
  static updateTrackingUser(user: DroidUser): void {
    const time = user.scores.recent[0].played_at.getTime();
    this.getDatabase().prepare('UPDATE tracking_users SET last_score_date = ? WHERE uid = ?').run(time, user.id);
    if (client.config.debug)
      client.log({
        prefix: 'DEBUG',
        message: `entry ${user.id} - ${user.username} was updated with timestamp ${time} in the score tracking database`,
      });
  }

  /**
   * Removes a user from the score tracking system in a specific guild.
   * @param uid The tracked `DroidUser`.
   * @param guild The server where this user is tracked in.
   */
  static removeTrackingUser(user: DroidUser, guild: Guild): void {
    const inDB = this.getTrackingUser(user);
    const db = this.getDatabase();
    if (!inDB) return;

    if (inDB.servers.length == 1) {
      db.prepare('DELETE FROM tracking_users WHERE uid = ?').run(user.id);
      if (client.config.debug)
        client.log({
          prefix: 'DEBUG',
          message: `removed ${user.username} - ${user.id} from the score tracking database`,
        });
      return;
    }

    const new_servers = inDB.servers.filter((s) => s != guild.id);
    db.prepare('UPDATE tracking_users SET servers = ? WHERE uid = ?').run(JSON.stringify(new_servers), user.id);
    if (client.config.debug)
      client.log({
        prefix: 'DEBUG',
        message: `removed ${user.username} - ${user.id} from guild ${guild.id} in the score tracking database`,
      });
  }

  /**
   * Stores the tracking channel ID of a server.
   * @param guild The Discord server.
   * @param channel The `TextChannel` where scores will be sent in.
   */
  static setGuildTrackingChannel(guild: Guild, channel: TextChannel): void {
    const settings = this.initGuildConfig(guild);
    settings.tracking.channel_id = channel.id;
    this.getDatabase()
      .prepare(
        'INSERT INTO server_configs (guild_id, tracking) VALUES (?, ?) ' +
          'ON CONFLICT(guild_id) DO UPDATE SET tracking = excluded.tracking',
      )
      .run(guild.id, JSON.stringify(settings.tracking));
  }

  /**
   * Stores the score tracking system status of a server.
   * @param guild The Discord server.
   * @param enabled The status of the system.
   */
  static setGuildTrackingStatus(guild: Guild, enabled: boolean): void {
    const settings = this.initGuildConfig(guild);
    settings.tracking.enabled = enabled;
    this.getDatabase()
      .prepare(
        'INSERT INTO server_configs (guild_id, tracking) VALUES (?, ?) ' +
          'ON CONFLICT(guild_id) DO UPDATE SET tracking = excluded.tracking',
      )
      .run(guild.id, JSON.stringify(settings.tracking));
  }

  /**
   * Retrieves a Discord server's configuration. `undefined` if not configured.
   * @param guild The Discord server or its ID.
   */
  static getGuildConfig(guild: Guild): ServerConfig {
    const settings = this.getDatabase()
      .prepare('SELECT guild_id, tracking FROM server_configs WHERE guild_id = ?')
      .get(guild.id) as ServerDBEntry | undefined;
    if (!settings) return this.createConfig(guild);
    const tracking_config = JSON.parse(settings.tracking) as TrackingConfig;
    return {
      guild_id: settings?.guild_id,
      tracking: tracking_config,
    };
  }

  /**
   * Creates and returns an entry in the server configuration database.
   * @param guild The server to create the config of.
   */
  static initGuildConfig(guild: Guild): ServerConfig {
    const inDB = this.getGuildConfig(guild);
    if (inDB) return inDB;
    this.createConfig(guild);
    return this.getGuildConfig(guild)!;
  }

  /**
   * Creates a new entry in the database for the config of a guild.
   * @param guild The `Guild` to create the config for.
   * @returns
   */
  private static createConfig(guild: Guild): ServerConfig {
    const default_tracking: TrackingConfig = {
      channel_id: '',
      enabled: true,
    };
    this.getDatabase()
      .prepare('INSERT INTO server_configs (guild_id, tracking) VALUES (?, ?)')
      .run(guild.id, JSON.stringify(default_tracking));
    if (client.config.debug)
      client.log({
        prefix: 'DEBUG',
        message: `added config for ${guild.id} in the server config database`,
      });
    return this.getGuildConfig(guild);
  }
  /**
   * Retrieves every Discord server configuration.
   */
  static getGuildConfigs(): ServerConfig[] {
    return this.getDatabase().prepare('SELECT guild_id, tracking FROM server_configs').all() as ServerConfig[];
  }
}
