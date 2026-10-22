import { client } from '@base';
import { ChatInputCommandInteraction, ContainerBuilder, Interaction, MessageMentions } from 'discord.js';
import { ColorHelper } from './ColorHelper';

/**
 *  Options to create a response container.
 */
export interface ResponseOptions {
  /**
   * Type of container to create.
   */
  type?: 'error' | 'ok' | 'warn' | 'process';

  /**
   * The message to show.
   */
  message: string;
}
export abstract class InteractionHelper {
  static createContainer(interaction: Interaction, options: ResponseOptions): ContainerBuilder {
    const { type, message } = options;
    const container = new ContainerBuilder();
    let color = client.config.colors.default;
    switch (type) {
      case 'error':
        color = client.config.colors.error;
        break;
      case 'ok':
        color = client.config.colors.ok;
        break;
      case 'process':
        color = client.config.colors.warn;
    }
    container
      .addTextDisplayComponents((t) => t.setContent(`-# ${interaction.user}`))
      .addSeparatorComponents((s) => s)
      .setAccentColor(ColorHelper.hexToNumber(color))
      .addTextDisplayComponents((t) => t.setContent(message));

    return container;
  }

  static async replyError(interaction: ChatInputCommandInteraction, message: string) {
    const container = this.createContainer(interaction, {
      type: 'error',
      message: `${client.config.emojis.error}  ${message}`,
    });

    const replyMethod = interaction.replied || interaction.deferred ? interaction.followUp : interaction.reply;
    await replyMethod({
      content: 'There was an error while executing this command!',
      flags: ['IsComponentsV2', 'Ephemeral'],
    });

    await interaction.editReply({
      components: [container],
      flags: ['IsComponentsV2'],
    });
  }
}
