/**
 * Contains data to link a Discord account to an osu!droid profile.
 */
export interface DroidLinkData {
  /**
   * The ID of the Discord account.
   */
  discord_id: string;

  /**
   * The osu!droid user ID.
   */
  uid: number;

  /**
   * The date the link between the accounts was set.
   */
  linked_date: number;
}
