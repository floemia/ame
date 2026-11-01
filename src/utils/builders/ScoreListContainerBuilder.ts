import { DroidScore, DroidUser } from '@floemia/osu-droid-tools';
import { ColorHelper, DroidHelper, InteractionHelper } from '@utils/helpers';
import { APIContainerComponent, ContainerBuilder } from 'discord.js';

export class ScoreListContainerBuilder extends ContainerBuilder {
  private scores_per_page = 5;
  private scores: DroidScore[] = [];

  constructor(data?: APIContainerComponent) {
    super(data);
  }

  /**
   *
   * @param
   */
  async setPlayer(user: DroidUser): Promise<ScoreListContainerBuilder> {
    const color = await ColorHelper.getAccentColor(user.avatar_url);
    this.setAccentColor(color);
    this.addSectionComponents((s) =>
      s
        .addTextDisplayComponents((t) =>
          t.setContent(`## [${DroidHelper.userToString(user)}](${user.url})・Top 50 scores`),
        )
        .setThumbnailAccessory((t) => t.setURL(user.avatar_url)),
    );
    this.addSeparatorComponents((s) => s);
    return this;
  }

  setScores(scores: DroidScore[]): ScoreListContainerBuilder {
    this.scores = scores;
    return this;
  }

  /**
   * The total amount of pages.
   */
  get pages(): number {
    return Math.max(1, Math.ceil(this.scores.length / this.scores_per_page));
  }

  private getScorePage(page: number) {
    const start = page * this.scores_per_page;
    const end = start + this.scores_per_page;
    return this.scores.slice(start, end);
  }

  /**
   * Builds a container showing the scores of the given page.
   * @param page The page index, starting at 0.
   */
  setPage(page: number = 0): ScoreListContainerBuilder {
    page = Math.min(Math.max(Math.trunc(page), 0), this.pages - 1);
    const scores = this.getScorePage(page);
    const container = new ScoreListContainerBuilder(this.toJSON());

    for (const [i, score] of scores.entries()) {
      const rank = DroidHelper.getScoreRankEmoji(score.rank);
      const total_score = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(score.total_score);

      const pp = score.pp?.toLocaleString('en-US', { maximumFractionDigits: 2 });
      const acc = (score.accuracy.value * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      const combo = score.max_combo.toLocaleString('en-US');
      const { n300, n100, n50, nmiss } = score.accuracy;
      const hits = `[${n300}/${n100}/${n50}/${nmiss}]`;
      const set_at = `<t:${Math.floor(score.played_at.getTime() / 1000)}:R>`;
      const number = page * this.scores_per_page + i + 1;
      const stats = [rank, `${pp}dpp`, `${acc}%`, total_score, hits, `${combo}x`, set_at].join('  ');
      container.addTextDisplayComponents((t) =>
        t.setContent(
          `**#${number}・${score.filename}${score.mods.size > 0 ? ` +${score.mods.toString()}` : ''}**\n${stats}`,
        ),
      );
    }
    InteractionHelper.addSignatureToContainer(container);
    return container;
  }
}
