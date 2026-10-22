/**
 * Configuration of the bot.
 */
export interface AmeConfig {
  /**
   * Default cooldown settings (in seconds).
   */
  cooldown: {
    /** Cooldown duration for standard commands. */
    commands: number;

    /** Cooldown duration between the tracking system's entries. */
    tracking: number;
  };

  /**
   * Color palette used by the bot.
   */
  colors: {
    /**
     * Connection color.
     */
    connection: string;

    /**
     * Debug color.
     */
    debug: string;

    /**
     * Default color.
     */
    default: string;

    /**
     * Tracking color.
     */
    tracking: string;

    /**
     * Error color.
     */
    error: string;

    /**
     * Success color.
     */
    ok: string;

    /**
     * Warning color.
     */
    warn: string;
  };

  /**
   * Emojis that the bot uses
   */
  emojis: {
    /**
     * Unknown flag emoji.
     */
    unknown_flag: string;
  };
  /**
   * Discord user ID of the developer
   */
  developer: number;

  /**
   * Flag to toggle debug mode on or off.
   */
  debug: boolean;

  /**
   * The server for debug/test related stuff.
   */
  test_guild: number;
}
