import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder } from 'discord.js';
import { DroidUser } from '@floemia/osu-droid-tools';
import { ColorHelper, DroidHelper, InteractionHelper } from '@utils/helpers';

/**
 * Builds osu!droid profile containers.
 */
export class ProfileContainerBuilder extends ContainerBuilder {
  /**
   * The user this profile belongs to.
   */
  private user: DroidUser;

  constructor(user: DroidUser) {
    super();
    this.user = user;
  }

  /**
   * Creates a compact profile container with the most important user statistics.
   */
  async createSmallProfile(): Promise<ProfileContainerBuilder> {
    const { statistics } = this.user;
    const color = await ColorHelper.getAccentColor(this.user.avatar_url);
    const level = DroidHelper.calculateProfileLevel(this.user);
    const level_floor = Math.floor(level);
    const level_progress = Math.round((level - level_floor) * 10);
    const level_bar = '▰'.repeat(level_progress) + '▱'.repeat(10 - level_progress);

    const accuracy = (statistics.accuracy * 100).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    const playcount = statistics.playcount.toLocaleString('en-US');
    const total_score = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(statistics.total_score);
    const best_play = this.user.scores.best[0]?.pp;

    const badges = [
      this.user.supporter ? '**Supporter**' : '',
      this.user.core_developer ? '**Core Developer**' : '',
      this.user.developer ? '**Developer**' : '',
      this.user.contributor ? '**Contributor**' : '',
    ].filter(Boolean);

    this.setAccentColor(color).addSectionComponents((s) =>
      s
        .addTextDisplayComponents((t) =>
          t.setContent(
            `# ${DroidHelper.userToFullString(this.user)}\n` +
              `${badges.length ? `-# ${badges.join('・')}\n` : ''}` +
              `## Level ${level_floor}\n${level_bar}`,
          ),
        )
        .setThumbnailAccessory((t) => t.setURL(this.user.avatar_url)),
    );

    this.addSeparatorComponents((s) => s)
      .addTextDisplayComponents((t) =>
        t.setContent(
          `### Statistics\n` +
            `-# __**Accuracy:**__ ${accuracy}%\n` +
            `-# __**Playcount:**__ ${playcount}\n` +
            `-# __**Total score:**__ ${total_score}\n` +
            `${best_play ? `-# __**Best play:**__ ${best_play.toLocaleString('en-US', { maximumFractionDigits: 2 })}dpp\n` : ''}`,
        ),
      )
      .addTextDisplayComponents((t) =>
        t.setContent(
          `### Dates\n` +
            `-# __**Playing since:**__ <t:${Math.floor(this.user.registered_at.getTime() / 1000)}:f>\n` +
            `-# __**Last login:**__ <t:${Math.floor(this.user.last_login.getTime() / 1000)}:R>`,
        ),
      );

    InteractionHelper.addSignatureToContainer(this);
    return this;
  }

  /**
   * Creates a row with a button linking to this user's osu!droid profile.
   */
  createProfileRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('osu!droid profile').setURL(this.user.url),
    );
  }
}
