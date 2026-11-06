import { client } from '@base';
import { DroidScore, DroidUser } from '@floemia/osu-droid-tools';
import { ColorHelper, DroidHelper, InteractionHelper, TimeHelper } from '@utils/helpers';
import { ContainerBuilder, APIContainerComponent } from 'discord.js';
import { ModUtil, Modes } from '@rian8337/osu-base';
import { CacheManager } from '@utils/managers';

// to help with resets
let containerWithUser: APIContainerComponent;

/**
 * Builds containers that display osu!droid scores.
 */
export class ScoreContainerBuilder extends ContainerBuilder {
  constructor(data?: APIContainerComponent) {
    super(data);
  }

  /**
   * Sets the player of this score.
   * @param user Instance of `DroidUser`
   */
  setPlayer(user: DroidUser): ScoreContainerBuilder {
    let str = DroidHelper.userToFullString(user, true);
    str = str.replace(user.username, `[${user.username}](${user.url})`);
    this.addTextDisplayComponents((t) => t.setContent(`-# ${client.config.emojis.droid}  ${str}`));
    containerWithUser = this.toJSON();
    return this;
  }

  async setScore(score: DroidScore) {
    const cache_container = CacheManager.getScoreContainer(score);
    if (cache_container) return cache_container;

    const container = new ScoreContainerBuilder(containerWithUser);

    await DroidHelper.getBeatmap(score);
    const diff = {
      osu: await score.calculateDifficulty('osu'),
      droid: await score.calculateDifficulty('droid'),
    };
    const perf = {
      osu: await score.calculatePerformance('osu'),
      droid: await score.calculatePerformance('droid'),
    };

    const map = score.map_info;
    const status = DroidHelper.getRankStatusEmoji(map?.approved || 0);
    const rank_emoji = DroidHelper.getScoreRankEmoji(score.rank);
    const fulltitle =
      `${status}  ` +
      (map
        ? `[${map.artist} - ${map.title} [${map.version}]](${map.beatmapLink})${score.mods.size > 0 ? ` +${score.mods.toString()}` : ''}・${diff.osu?.starRating.toLocaleString('en-US', { maximumFractionDigits: 2 })} ⭐`
        : `${score.filename}${score.mods.size > 0 ? ` +${score.mods.toString()}` : ''}`);

    const dpp = score.pp
      ? `${score.pp.toLocaleString('en-US', { maximumFractionDigits: 2 })}dpp`
      : map
        ? `${perf.droid?.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}dpp`
        : '';

    const pp = map ? `${perf.osu?.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}pp` : '';
    const acc =
      (score.accuracy.value * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + '%';

    const pp_str = map ? `${dpp} - ${pp}` : '';
    const { n300, n100, n50, nmiss } = score.accuracy;
    let fc_pp_str = '';
    if (map && !score.isFC()) {
      const score_fc = score.toFC();
      const perf_fc = {
        osu: await score_fc.calculatePerformance('osu'),
        droid: await score_fc.calculatePerformance(),
      };
      const acc_fc =
        (score_fc.accuracy.value * 100).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + '%';

      fc_pp_str += `\n-# ${perf_fc.droid?.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}dpp・${perf_fc.osu?.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}pp ➜ FC ${acc_fc}`;
    }
    const score_str = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 3,
    }).format(score.total_score);

    const judgmnt_str = `[${n300}/${n100}/${n50}/${nmiss}]`;
    const combo_str =
      `${score.max_combo.toLocaleString('en-US')}x` + (map ? `/${map?.maxCombo?.toLocaleString('en-US')}x` : '');

    let attrs_str = '';
    const { AR, OD, CS, HP, BPM, length } = client.config.emojis.attributes;
    let color = 0xdedede;
    if (map) {
      try {
        color = await ColorHelper.getAccentColor(`https://assets.ppy.sh/beatmaps/${map?.beatmapSetId}/covers/list.jpg`);
      } catch {}
      ModUtil.applyModsToBeatmapDifficulty(score.beatmap!.difficulty, Modes.Osu, score.mods, true);
      const map_length = TimeHelper.secondsToMMSS(map.totalLength / score.getFinalSpeed());
      const bpm = (map.bpm * score.getFinalSpeed()).toLocaleString('en-US', { maximumFractionDigits: 2 });
      const { ar, od, cs, hp } = map.beatmap?.difficulty!;
      attrs_str += `\n-# **${length} ${map_length} ${BPM} ${bpm} ${AR} ${ar.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${OD} ${od.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${HP} ${hp.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${CS} ${cs.toLocaleString('en-US', { maximumFractionDigits: 2 })}**`;
    }

    container.setAccentColor(color).addSectionComponents((s) =>
      s
        .addTextDisplayComponents((t) => t.setContent(`### ${fulltitle}`))
        .setThumbnailAccessory((s) => s.setURL(`https://assets.ppy.sh/beatmaps/${map?.beatmapSetId}/covers/list.jpg`))
        .addTextDisplayComponents((s) =>
          s.setContent(
            `**${rank_emoji} ${pp_str}  ${acc}**  ${score_str}  ${judgmnt_str}  ${combo_str}${fc_pp_str}${attrs_str}`,
          ),
        ),
    );

    InteractionHelper.addSignatureToContainer(container, `<t:${score.played_at.getTime() / 1000}:R>`);
    CacheManager.storeScoreContainer(score, container);

    return container;
  }
}
