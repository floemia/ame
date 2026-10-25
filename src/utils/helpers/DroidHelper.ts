import { client } from '@base';
import { DroidScore, DroidUser } from '@floemia/osu-droid-tools';
import { ResponseStrings } from '@localization/index';
import { CacheManager, DatabaseManager } from '@utils/managers';
import { ChatInputCommandInteraction, ContainerBuilder, User } from 'discord.js';
import { ColorHelper } from './ColorHelper';
import { RankedStatus, MapInfo, BeatmapDecoder, OsuAPIRequestBuilder, OsuAPIResponse, Modes } from '@rian8337/osu-base';
import { LocalizationHelper } from './LocalizationHelper';
import { AmeError } from '@structures/core/AmeError';
/**
 * Helps with osu!droid related operations.
 */
export abstract class DroidHelper {
  /**
   * Returns a `DroidUser` based on the provided input.
   * @param input The Discord `User`, a `ChatInputCommandInteraction`, a `string` or a `number` representing the UID or the username.
   */
  static async getUser(input: User | ChatInputCommandInteraction | string | number): Promise<DroidUser | undefined> {
    if (input instanceof User) {
      const data = DatabaseManager.getUserLink(input);
      if (!data) return;

      return DroidUser.get(data.uid);
    }

    // from command
    if (input instanceof ChatInputCommandInteraction) {
      const strings = LocalizationHelper.getLocaleStrings(input.locale);
      // from mention
      const mentionUser = input.options.getUser('user');
      if (mentionUser) {
        const user = DroidHelper.getUser(mentionUser);
        if (!user) throw new AmeError(strings.mention_no_link);
        return user;
      }

      // from option uid || username
      const uid = input.options.getInteger('uid') || undefined;
      const username = input.options.getString('username') || undefined;
      if (uid || username) {
        const user = DroidHelper.getUser((uid ?? username)!);
        if (!user) throw new AmeError(strings.user_dne);
        return user;
      }

      // from interaction author
      const user = DroidHelper.getUser(input.user);
      if (!user) throw new AmeError(strings.no_link);
      return user;
    }

    // input is string or number (username or uid)
    return DroidUser.get(input as string | number);
  }

  /**
   * Returns a full string representation of an osu!droid user.
   * @param user An instance of `DroidUser`.
   * @param flagInMiddle Replaces the countrycode in the rank section with an emoji if true.
   * @returns 🇵🇾  floemiauwu・18,525.1pp (#1・PY #1)
   */
  static userToFullString(user: DroidUser, flagInMiddle: boolean = false): string {
    const hasCountry = user.country ? true : false;
    const flag = hasCountry ? `:flag_${user.country}:` : client.config.emojis.unknown_flag;
    const username = user.username;
    const pp_string = user.statistics.pp.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const rank = user.statistics.rank.global.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const rank_country = hasCountry
      ? user.statistics.rank.country!.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : '';

    return flagInMiddle
      ? `${username}・${pp_string}pp (#${rank}${hasCountry ? `・${flag}  #${rank_country}` : ''})`
      : `${flag}  ${username}・${pp_string}pp (#${rank}${hasCountry ? `・${user.country?.toUpperCase()} #${rank_country}` : ''})`;
  }

  /**
   * Returns a string representation of an osu!droid user.
   * @param user An instance of `DroidUser`.
   * @returns 🇵🇾  **floemiauwu**
   */
  static userToString(user: DroidUser): string {
    const hasCountry = user.country ? true : false;
    const flag = hasCountry ? `:flag_${user.country}:` : client.config.emojis.unknown_flag;
    const username = user.username;
    return `${flag}  **${username}**`;
  }

  /**
   * Returns the current level of the user.
   * @param score
   * @author Original by Rian8337
   * @see {@link https://github.com/Rian8337/Mahiru/blob/e116c36785cc180e4f576c30cb47de43137d0d61/src/utils/helpers/ScoreHelper.ts#L124}
   */
  static calculateProfileLevel(user: DroidUser) {
    const score = user.statistics.total_score;
    const calculateScoreRequirement = (level: number): number => {
      return Math.round(
        level <= 100
          ? ((5000 / 3) * (4 * Math.pow(level, 3) - 3 * Math.pow(level, 2) - level) +
              1.25 * Math.pow(1.8, level - 60)) /
              1.128
          : 23875169174 + 15000000000 * (level - 100),
      );
    };

    let level = 1;

    while (calculateScoreRequirement(level + 1) <= score) {
      ++level;
    }

    const nextLevelReq = calculateScoreRequirement(level + 1) - calculateScoreRequirement(level);
    const curLevelReq = score - calculateScoreRequirement(level);
    level += curLevelReq / nextLevelReq;

    return level;
  }

  /**
   * Creates a container, response from the command `/link` if it succeeds.
   * @param user The `DroidUser` this Discord account was linked to.
   * @param strings The localized `ResponseStrings`.
   */
  static createLinkContainer(user: DroidUser, strings: ResponseStrings): ContainerBuilder {
    const container = new ContainerBuilder()
      .setAccentColor(ColorHelper.hexToNumber(client.config.colors.ok))
      .addSectionComponents((s) =>
        s
          .addTextDisplayComponents((t) =>
            t.setContent(`### ${client.config.emojis.ok}  ${strings.done}\n${strings.commands.link.success(user)}`),
          )
          .setThumbnailAccessory((t) => t.setURL(user.avatar_url)),
      )
      .addSeparatorComponents((s) => s)
      .addTextDisplayComponents((s) => s.setContent(`-# ${client.config.emojis.ame}  **💙Ame💙・**@raincandy_U`));
    return container;
  }

  /**
   * Returns the ranking status emoji of the beatmap.
   * @param status See {@link RankedStatus}
   */
  static getRankStatusEmoji(status: RankedStatus): string {
    switch (status) {
      case -2:
      case -1:
      case 0:
        return client.config.emojis.status.graveyard;
      case 1:
        return client.config.emojis.status.ranked;
      case 2:
      case 3:
        return client.config.emojis.status.qualified;
      default:
        return client.config.emojis.status.loved;
    }
  }

  static getScoreRankEmoji(rank: 'XH' | 'X' | 'SH' | 'S' | 'A' | 'B' | 'C' | 'D') {
    return client.config.emojis.rank[rank];
  }

  /**
   * Extracts the beatmap ID from various osu! URL formats.
   * @param input The osu! beatmap URL or ID.
   */
  static getBeatmapId(input: string): number | null {
    const trimmed = input.trim();

    // input is ID itself
    if (/^\d+$/.test(trimmed)) {
      return parseInt(trimmed);
    }

    try {
      const url = new URL(input);
      const path = url.pathname;
      const hash = url.hash;

      // #osu/2668755
      if (hash) {
        const match = hash.match(/\/(\d+)$/);
        if (match) {
          return parseInt(match[1]);
        }
      }

      // /b/2668755
      if (path.startsWith('/b/')) {
        const segments = path.split('/');
        const id = segments[2];
        if (id && /^\d+$/.test(id)) {
          return parseInt(id);
        }
      }

      // /beatmapsets/osu/2668755
      const match = path.match(/\/(\d+)$/);
      if (match) {
        return parseInt(match[1]);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Requests the .osu file from a beatmap and returns a `Beatmap` instance.
   * @param input A `DroidScore`, the ID or the MD5 hash of a beatmap.
   */
  static async getBeatmap(input: DroidScore | ChatInputCommandInteraction | string): Promise<MapInfo<true> | null> {
    let hash;
    let hashOrID: string | number = '';
    if (input instanceof ChatInputCommandInteraction) {
      const strings = LocalizationHelper.getLocaleStrings(input.locale);
      let beatmapIDURL = input.options.getString('beatmap');
      if (!beatmapIDURL) {
        const cached_idOrHash = CacheManager.getChannelBeatmap(input.channel!);
        if (!cached_idOrHash) throw new AmeError(strings.commands.compare.no_cache);
        hashOrID = cached_idOrHash;
      } else {
        const id = DroidHelper.getBeatmapId(beatmapIDURL);
        if (!id) throw new AmeError(strings.commands.compare.no_map);
      }
    }

    const isDroidScore = input instanceof DroidScore;
    if (isDroidScore) {
      hash = (input as DroidScore).hash;
      hashOrID = hash;
    }
    if (!hashOrID) {
      if (typeof input == 'string') {
        const id = DroidHelper.getBeatmapId(input);
        if (!id) return null;
        hashOrID = id;
      }
      hashOrID = input as string | number;
    }

    const request = new OsuAPIRequestBuilder()
      .setEndpoint('get_beatmaps')
      .addParameter(typeof hashOrID === 'string' ? 'h' : 'b', hashOrID);
    const result = await request.sendRequest();
    if (result.statusCode !== 200) {
      throw new Error(`osu! API error: ${result.describeFailure()}`);
    }
    const mapinfo = JSON.parse(result.data.toString('utf-8')).at(0) as OsuAPIResponse;
    if (!mapinfo) {
      return null;
    }
    if (parseInt(mapinfo.mode) !== 0) {
      return null;
    }
    hash = mapinfo.file_md5;

    const db_beatmap = DatabaseManager.getBeatmap(isDroidScore ? input.hash : mapinfo.beatmap_id);
    if (db_beatmap) {
      console.log('hola');
      const decoded_beatmap = new BeatmapDecoder().decode(db_beatmap, Modes.Osu).result;
      const map_info = MapInfo.from(mapinfo, decoded_beatmap);
      // console.log(map_info);
      if (isDroidScore) {
        input.map_info = map_info;
        input.beatmap = decoded_beatmap;
      }
      return map_info;
    }

    let beatmap_file;
    const url = `https://osu.ppy.sh/osu/${mapinfo.beatmap_id.toString()}`;
    try {
      const data = await fetch(url);
      const text = await data.text();
      if (data.status >= 500) throw new Error(text);
      beatmap_file = text;
    } catch (e) {
      client.log({
        type: 'error',
        message: `Requesting beatmap ${hash} failed, aborting`,
      });
      return null;
    }
    if (!beatmap_file) return null;

    const decoded_beatmap = new BeatmapDecoder().decode(beatmap_file).result;
    const fullmap = MapInfo.from(mapinfo, decoded_beatmap);
    if (isDroidScore) {
      input.map_info = fullmap;
      input.beatmap = decoded_beatmap;
    }

    DatabaseManager.storeBeatmap(hash, decoded_beatmap.metadata.beatmapId!, beatmap_file);
    return fullmap;
  }
}
