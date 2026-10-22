import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';
import { DatabaseManager } from '@utils/managers';
import { ChatInputCommandInteraction, User } from 'discord.js';

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
      // from mention
      const mentionUser = input.options.getUser('user');
      if (mentionUser) return DroidHelper.getUser(mentionUser);

      // from option uid || username
      const uid = input.options.getInteger('uid') || undefined;
      const username = input.options.getString('username') || undefined;
      if (uid || username) return DroidHelper.getUser((uid ?? username)!);

      // from interaction author
      return DroidHelper.getUser(input.user);
    }

    // input is string or number (username or uid)
    return DroidUser.get(input as string | number);
  }

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
