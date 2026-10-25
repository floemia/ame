export interface BeatmapDBEntry {
  /**
   * The beatmap's ID.
   */
  id: number;

  /**
   * The beatmap's MD5 hash.
   */
  hash: string;

  /**
   * The contents of the .osu file.
   */
  data: string;
}
