/**
 * Contains data of a user whose scores are being tracked.
 */
export interface TrackingUser {
  /**
   * The osu!droid user ID.
   */
  uid: number;

  /**
   * The IDs of the Discord servers the tracking updates should be sent to.
   */
  servers: string[];

  /**
   * The date of the latest score that has been processed, in milliseconds.
   */
  last_score_date: number;
}

/**
 * A tracked user as stored in the database.
 */
export interface TrackingUserDBEntry {
  uid: number;
  servers: string;
  last_score_date: number;
}
