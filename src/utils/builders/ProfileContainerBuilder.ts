import { ContainerBuilder } from 'discord.js';
import { DroidUser } from '@floemia/osu-droid-tools';
import { ColorHelper, DroidHelper } from '@utils/helpers';
import { client } from '@base';

/**
 * Builds osu!droid profile containers.
 */
export class ProfileContainerBuilder extends ContainerBuilder {
  /**
   *
   */
  private user: DroidUser;

  constructor(user: DroidUser) {
    super();
    this.user = user;
  }

  async createSmallProfile(): Promise<ProfileContainerBuilder> {
    const color = await ColorHelper.getDominantColor(this.user.avatar_url);
    const level = DroidHelper.calculateProfileLevel(this.user);
    // const progress = level - Math.floor(level);
    this.setAccentColor(color)
      .addSectionComponents((s) =>
        s
          .addTextDisplayComponents((t) =>
            t.setContent(`## <:droid_simple:1021473577951821824>・${DroidHelper.userToString(this.user)}\
          \n- -# __**Playing since:**__ <t:${this.user.registered_at.getTime() / 1000}:f>\
          \n- -# __**Last login:**__ <t:${this.user.last_login.getTime() / 1000}:R>\
          \n**Level ${Math.floor(level)}・**  ⬛⬛⬛⬛⬛⬛`),
          )
          .setThumbnailAccessory((t) => t.setURL(this.user.avatar_url)),
      )
      .addSeparatorComponents((s) => s)
      .addTextDisplayComponents((s) => s.setContent(`-# ${client.config.emojis.ame}  **💙Ame💙・**@raincandy_U`));

    return this;
  }
}
