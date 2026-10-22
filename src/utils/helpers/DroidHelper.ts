import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';

/**
 * Helps with osu!droid related operations.
 */
export abstract class DroidHelper {
  /**
   * Returns a full string representation of an osu!droid user.
   * @param user An instance of `DroidUser`.
   * @returns 🇵🇾  floemiauwu・18,525.1pp (#1・PY #1)
   */
  static userToFullString(user: DroidUser): string {
    const hasCountry = user.country ? true : false;
    const flag = hasCountry ? `:flag_${user.country}:` : client.config.emojis.unknown_flag;
    const username = user.username;
    const pp_string = user.statistics.pp.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const rank = user.statistics.rank.global.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const rank_country = hasCountry
      ? user.statistics.rank.country!.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : '';

    return `${flag}  ${username}・${pp_string}pp (#${rank}${hasCountry ? `・${user.country?.toUpperCase()} #${rank_country}` : ''})`;
  }

  /**
   * Returns a string representation of an osu!droid user.
   * @param user An instance of `DroidUser`.
   * @returns 🇵🇾  floemiauwu
   */
  static userToString(user: DroidUser): string {
    const hasCountry = user.country ? true : false;
    const flag = hasCountry ? `:flag_${user.country}:` : client.config.emojis.unknown_flag;
    const username = user.username;
    return `${flag}  ${username}`;
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
}
