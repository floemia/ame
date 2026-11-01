export interface ServerDBEntry {
  guild_id: string;
  prefix: string;
  tracking: string;
}

/**
 * Contains the configuration of a Discord server.
 */
export interface ServerConfig {
  /**
   * The ID of the Discord server.
   */
  guild_id: string;

  /**
   * The prefix used to call message commands in this server.
   */
  prefix: string;

  /**
   * Configration of the score tracking system for this server.
   */
  tracking: TrackingConfig;
}

/**
 * Configration of the score tracking system for this server.
 */
export interface TrackingConfig {
  /**
   * The ID of the channel where tracking updates are sent.
   */
  channel_id: string;

  /**
   * The status of the score tracking system in this server.
   */
  enabled: boolean;
}
