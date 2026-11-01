import { client } from '@base';
import {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContainerBuilder,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  TextDisplayBuilder,
} from 'discord.js';
import { ColorHelper } from './ColorHelper';
import { ResponseStrings } from '@localization/index';
import { DroidScore, DroidUser } from '@floemia/osu-droid-tools';
import { ScoreContainerBuilder } from '@utils/builders';

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
      .addTextDisplayComponents((s) => s.setContent(`-# ${client.config.emojis.ame[0]}  **💙Ame💙・**@raincandy_U`));

    return container;
  }

  /**
   * Replies to an interaction, editing the reply instead if the interaction was already
   * replied to or deferred. Mentions are never pinged.
   * @param interaction The `CommandInteraction` to reply to.
   * @param options The options to reply with.
   */
  static async reply(
    interaction: CommandInteraction,
    options: InteractionReplyOptions,
  ): Promise<Message<boolean> | InteractionResponse<boolean>> {
    if (interaction.deferred || interaction.replied) {
      const flags = options.flags ? (Array.isArray(options.flags) ? options.flags : [options.flags]) : [];
      const edit_flags = flags.filter((flag) => flag !== 'Ephemeral') as InteractionEditReplyOptions['flags'];
      return interaction.editReply({ ...options, flags: edit_flags });
    }

    return interaction.reply({
      ...options,
      allowedMentions: { repliedUser: false },
    });
  }

  /**
   * Replies to an interaction with an error message.
   * @param interaction The `ChatInputCommandInteraction`.
   * @param message The message to show.
   */
  static async replyError(interaction: ChatInputCommandInteraction, message: string) {
    const container = this.createContainer({
      type: 'error',
      title: `${client.config.emojis.error}  error!!!`,
      message: message,
    });
    return this.reply(interaction, {
      components: [container],
      flags: ['Ephemeral', 'IsComponentsV2'],
    });
  }

  /**
   * Replies to an interaction with a cooldown message.
   * @param interaction The `ChatInputCommandInteraction`.
   * @param strings The localized `ResponseStrings`.
   */
  static async replyCooldown(interaction: CommandInteraction, time_left: number, strings: ResponseStrings) {
    const container = this.createContainer({
      type: 'warn',
      message: `${client.config.emojis.warn}  ${strings.cooldown(time_left)}`,
    });
    return this.reply(interaction, {
      components: [container],
      flags: ['Ephemeral', 'IsComponentsV2'],
    });
  }

  static async replyOK(
    interaction: CommandInteraction,
    message: string,
  ): Promise<Message<boolean> | InteractionResponse<boolean>> {
    const container = this.createContainer({
      type: 'ok',
      message: `${client.config.emojis.ok}  ${message}`,
    });
    return this.reply(interaction, {
      components: [container],
      flags: ['IsComponentsV2'],
    });
  }

  /**
   * Replies to an interaction with a score container.
   * @param interaction The interaction to reply to.
   * @param user The `DroidUser` that set the score.
   * @param score The set `DroidScore`.
   * @param strings The `ResponseStrings` of the interaction locale.
   */
  static async replyScore(
    interaction: CommandInteraction,
    user: DroidUser,
    score: DroidScore,
    strings: ResponseStrings,
  ): Promise<Message<boolean> | InteractionResponse<boolean>> {
    const response = new TextDisplayBuilder().setContent(strings.commands.compare.success(user));
    const container = await new ScoreContainerBuilder().setPlayer(user).setScore(score);

    return this.reply(interaction, {
      components: [response, container],
      flags: ['IsComponentsV2'],
    });
  }

  static addSignatureToContainer(container: ContainerBuilder): ContainerBuilder {
    return container
      .addSeparatorComponents((s) => s)
      .addTextDisplayComponents((s) => s.setContent(`-# ${client.config.emojis.ame[0]}  **💙Ame💙・**@raincandy_U`));
  }
}
