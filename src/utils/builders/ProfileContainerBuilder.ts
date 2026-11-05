import { AttachmentBuilder, ContainerBuilder } from 'discord.js';
import { DroidUser } from '@floemia/osu-droid-tools';
import { ColorHelper, InteractionHelper } from '@utils/helpers';
import { CacheManager } from '@utils/managers';
import { DroidCard } from '@floemia/osu-droid-card';

/**
 * Builds osu!droid profile containers.
 */
export class ProfileContainerBuilder extends ContainerBuilder {
  private user: DroidUser;
  file: AttachmentBuilder | undefined;
  constructor(user: DroidUser) {
    super();
    this.user = user;
  }

  async createCard() {
    let buffer = CacheManager.getProfileCard(this.user);
    if (!buffer) {
      buffer = await DroidCard.create(this.user);
      CacheManager.storeProfileCard(this.user, buffer);
    }
    const color = await ColorHelper.getAccentColor(buffer);
    this.file = new AttachmentBuilder(buffer, { name: `${this.user.id}.png` });
    this.setAccentColor(color).addMediaGalleryComponents((m) =>
      m.addItems((i) => i.setURL(`attachment://${this.user.id}.png`)),
    );
    InteractionHelper.addSignatureToContainer(this);
    return this;
  }
}
