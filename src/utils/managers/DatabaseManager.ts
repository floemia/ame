import { DroidUser } from '@floemia/osu-droid-tools';
import { DroidLinkData } from '@structures/osu!droid';
import Database from 'better-sqlite3';
import { User } from 'discord.js';
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '../../..');

/**
 * Manages the database that contains links between Discord accounts and osu!droid profiles.
 */
export abstract class DatabaseManager {
  /**
   * The path to the database files.
   */
  private static readonly db_path: string = path.join(root, './db/');

  /**
   * The `DroidUser` link database.
   */
  private static link_db: Database.Database | undefined;

  /**
   * The `Beatmap`s link database.
   */
  private static beatmaps_db: Database.Database | undefined;

  /**
   * Creates the database directory if it doesn't exist
   */
  private static restoreDatabaseDir(): void {
    fs.mkdirSync(this.db_path, { recursive: true });
  }

  private static getUserLinkDatabase(): Database.Database {
    if (this.link_db) return this.link_db;
    this.restoreDatabaseDir();
    const database = new Database(path.join(this.db_path, 'LinkedUsers.db'));
    database.exec(
      'CREATE TABLE IF NOT EXISTS linked_users (' +
        'discord_id TEXT PRIMARY KEY NOT NULL,' +
        'uid INTEGER NOT NULL,' +
        'linked_date INTEGER NOT NULL)',
    );
    this.link_db = database;
    return database;
  }

  private static getBeatmapDatabase(): Database.Database {
    if (this.beatmaps_db) return this.beatmaps_db;
    this.restoreDatabaseDir();
    const database = new Database(path.join(this.db_path, 'Beatmaps.db'));
    database.exec('CREATE TABLE IF NOT EXISTS beatmaps (id INTEGER UNIQUE, hash TEXT PRIMARY KEY,data TEXT NOT NULL)');
    this.beatmaps_db = database;
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
    this.getUserLinkDatabase()
      .prepare(
        'INSERT INTO linked_users (discord_id, uid, linked_date) VALUES (?, ?, ?) ' +
          'ON CONFLICT(discord_id) DO UPDATE SET uid = excluded.uid, linked_date = excluded.linked_date',
      )
      .run(user.id, droidUser.id, Date.now());
  }

  /**
   * Retrieves the link data of a Discord user. `undefined` if unlinked
   * @param user The Discord user.
   */
  static getUserLink(user: User): DroidLinkData | undefined {
    return this.getUserLinkDatabase()
      .prepare('SELECT discord_id, uid, linked_date FROM linked_users WHERE discord_id = ?')
      .get(user.id) as DroidLinkData | undefined;
  }

  /**
   * Retrieves the content of a stored .osu beatmap file.
   * @param hashOrID The ID or the MD5 hash of the beatmap.
   */
  static getBeatmap(hashOrID: string | number): string | undefined {
    return this.getBeatmapDatabase()
      .prepare(
        typeof hashOrID == 'string'
          ? 'SELECT data FROM beatmaps WHERE hash = ?'
          : 'SELECT data FROM beatmaps WHERE id = ?',
      )
      .get(hashOrID) as string | undefined;
  }

  /**
   * Stores a beatmap into the database.
   * @param hash MD5 hash of the beatmap.
   * @param id ID of the beatmap.
   * @param osu_file The contents of the .osu file.
   */
  static storeBeatmap(hash: string, id: number, osu_file: string): void {
    this.getBeatmapDatabase()
      .prepare(
        `
  INSERT INTO beatmaps (id, hash, data)
  VALUES (@id, @hash, @data)
  ON CONFLICT(hash) DO UPDATE SET
    id = COALESCE(excluded.id, beatmaps.id),
    data = excluded.data`,
      )
      .run({ id, hash, data: osu_file });
  }
}
