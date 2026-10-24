import { client } from '@base';
import { ChatInputCommandInteraction, ContainerBuilder } from 'discord.js';
import { ColorHelper } from './ColorHelper';
import { ResponseStrings } from '@localization/index';

/**
 *  Options to create a response container.
 */
export interface ResponseOptions {
  /**
   * Type of container to create.
   */
  type?: 'error' | 'ok' | 'warn' | 'process';

  /**
   * title of the container.
   */
  title?: string;

  /**
   * The message to show.
   */
  message: string;
}
export abstract class InteractionHelper {
  static createContainer(options: ResponseOptions): ContainerBuilder {
    const { type, message, title = '' } = options;
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
        break;
      case 'warn':
        color = client.config.colors.warn;
    }
    container
      .setAccentColor(ColorHelper.hexToNumber(color))
      .addTextDisplayComponents((t) => t.setContent(`${title ? `### ${title}\n` : ''}${message}`))
      .addSeparatorComponents((s) => s)
      .addTextDisplayComponents((s) => s.setContent(`-# ${client.config.emojis.ame}  **💙Ame💙・**@raincandy_U`));

    return container;
  }

  /**
   * Replies to an interaction with an error message.
   * @param interaction The `ChatInputCommandInteraction`.
   * @param key The dot-separated key of the string.
   * @param params Values to interpolate into the `{placeholder}` slots of the string.
   * @returns
   */
  static async replyError(interaction: ChatInputCommandInteraction, message: string) {
    const container = this.createContainer({
      type: 'error',
      title: `${client.config.emojis.error}  error!!!`,
      message: message,
    });
    return await interaction.editReply({
      components: [container],
      allowedMentions: { repliedUser: false },
      flags: ['IsComponentsV2'],
    });
  }

  /**
   * Replies to an interaction with a cooldown message.
   * @param interaction The `ChatInputCommandInteraction`.
   * @param strings The localized `ResponseStrings`.
   */
  static async replyCooldown(interaction: ChatInputCommandInteraction, time_left: number, strings: ResponseStrings) {
    const container = this.createContainer({
      type: 'warn',
      message: `${client.config.emojis.warn}  ${strings.cooldown(time_left)}`,
    });
    return interaction.reply({
      components: [container],
      allowedMentions: { repliedUser: false },
      flags: ['IsComponentsV2', 'Ephemeral'],
    });
  }
}
