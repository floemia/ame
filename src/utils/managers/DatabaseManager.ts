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
   * The path to the database file.
   */
  private static readonly databasePath: string = path.join(root, './db/LinkedUsers.db');

  /**
   * The SQLite database instance, created on first use.
   */
  private static link_db: Database.Database | undefined;

  /**
   * Gets the SQLite database instance, creating the database file and table if they do not exist yet.
   * @returns The SQLite database instance.
   */
  private static getUserLinkDatabase(): Database.Database {
    if (this.link_db) return this.link_db;
    fs.mkdirSync(path.dirname(this.databasePath), { recursive: true });
    const database = new Database(this.databasePath);
    database.exec(
      'CREATE TABLE IF NOT EXISTS linked_users (' +
        'discord_id TEXT PRIMARY KEY NOT NULL,' +
        'uid INTEGER NOT NULL,' +
        'linked_date INTEGER NOT NULL)',
    );
    this.link_db = database;
    return database;
  }

  /**
   * Stores a link between a Discord user and an osu!droid profile.
   *
   * If the Discord user is already linked, the existing link is overwritten.
   * @param user The Discord user.
   * @param droidUser The osu!droid user to link the Discord user to.
   */
  static linkDroidUser(user: User, droidUser: DroidUser): DroidLinkData {
    const link: DroidLinkData = {
      discord_id: user.id,
      uid: droidUser.id,
      linked_date: Date.now(),
    };
    this.getUserLinkDatabase()
      .prepare(
        'INSERT INTO linked_users (discord_id, uid, linked_date) VALUES (?, ?, ?) ' +
          'ON CONFLICT(discord_id) DO UPDATE SET uid = excluded.uid, linked_date = excluded.linked_date',
      )
      .run(link.discord_id, link.uid, link.linked_date);
    return link;
  }

  /**
   * Retrieves the link data of a Discord user. `undefined` if unlinked
   * @param user The Discord user.
   */
  static getUserLink(user: User): DroidLinkData | undefined {
    const row = this.getUserLinkDatabase()
      .prepare('SELECT discord_id, uid, linked_date FROM linked_users WHERE discord_id = ?')
      .get(user.id) as DroidLinkData | undefined;
    return row;
  }
}
