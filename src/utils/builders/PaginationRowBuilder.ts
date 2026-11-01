import { client } from '@base';
import {
  ActionRowBuilder,
  ActionRowData,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ButtonComponentData,
  CommandInteraction,
  ComponentType,
  Message,
  TopLevelComponentData,
} from 'discord.js';

/**
 * Time, in milliseconds, after which the pagination buttons are disabled.
 */
const timeout = 120000;

/**
 * Callback invoked every time the current page changes.
 */
export type PageChangeHandler = (interaction: ButtonInteraction, index: number) => Promise<unknown> | unknown;

/**
 * Builds a row containing buttons that handles pagination.
 */
export class PaginationRowBuilder extends ActionRowBuilder<ButtonBuilder> {
  private index = 0;
  private length = 1;
  private disabled = false;
  private message?: Message<boolean>;
  private readonly interaction: CommandInteraction;
  private readonly prefix: string;
  private readonly onPageChange?: PageChangeHandler;

  /**
   * @param interaction The interaction the pagination belongs to.
   * @param onPageChange Optional callback invoked when the page changes. When omitted, the row updates itself.
   */
  constructor(interaction: CommandInteraction, onPageChange?: PageChangeHandler) {
    super();
    this.interaction = interaction;
    this.prefix = `pagination:${interaction.id}:`;
    this.onPageChange = onPageChange;
    this.build();
    this.collect();
  }

  /**
   * The total amount of pages.
   */
  get pages(): number {
    return Math.max(1, Math.ceil(this.length));
  }

  /**
   * The current page index, starting at 0.
   */
  get page(): number {
    return this.index;
  }

  /**
   * Sets the amount of pages to paginate.
   * @param length The total amount of pages.
   */
  setLength(length: number): this {
    this.length = length;
    return this.setIndex(this.index);
  }

  /**
   * Sets the current page index.
   * @param index The page index to show.
   */
  setIndex(index: number): this {
    this.index = Math.min(Math.max(Math.trunc(index), 0), this.pages - 1);
    return this.build();
  }

  /**
   * Builds the buttons of this row.
   */
  private build(): this {
    const arrow = client.config.emojis.arrow;
    const at_start = this.index <= 0;
    const at_end = this.index >= this.pages - 1;

    const button = (id: string, emoji: string) =>
      new ButtonBuilder().setCustomId(`${this.prefix}${id}`).setStyle(ButtonStyle.Secondary).setEmoji(emoji);

    return this.setComponents(
      button('leftall', arrow.leftall).setDisabled(this.disabled || at_start),
      button('left', arrow.left).setDisabled(this.disabled || at_start),
      new ButtonBuilder()
        .setCustomId(`${this.prefix}index`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`${this.index + 1}/${this.pages}`)
        .setDisabled(true),
      button('right', arrow.right).setDisabled(this.disabled || at_end),
      button('rightall', arrow.rightall).setDisabled(this.disabled || at_end),
    );
  }

  /**
   * Collects button interactions belonging to this pagination.
   */
  private collect(): void {
    const channel = this.interaction.channel;
    if (!channel) return;

    const collector = channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      idle: timeout,
      filter: (i) => i.user.id === this.interaction.user.id && i.customId.startsWith(this.prefix),
    });

    collector.on('collect', async (interaction) => {
      collector.resetTimer();
      this.message = interaction.message;
      await this.onCollect(interaction);
    });

    collector.on('end', () => this.onEnd());
  }

  /**
   * Handles a collected button interaction.
   * @param interaction The collected button interaction.
   */
  private async onCollect(interaction: ButtonInteraction): Promise<void> {
    switch (interaction.customId.slice(this.prefix.length)) {
      case 'leftall':
        this.setIndex(0);
        break;
      case 'left':
        this.setIndex(this.index - 1);
        break;
      case 'right':
        this.setIndex(this.index + 1);
        break;
      case 'rightall':
        this.setIndex(this.pages - 1);
        break;
      default:
        return;
    }

    if (this.onPageChange) {
      await this.onPageChange(interaction, this.index);
      return;
    }

    await interaction.deferUpdate();
    await this.editMessage(interaction.message);
  }

  /**
   * Disables every button once the pagination is no longer used.
   */
  private async onEnd(): Promise<void> {
    this.disabled = true;
    this.build();

    const message = this.message ?? (await this.interaction.fetchReply().catch(() => undefined));
    if (!message) return;

    await this.editMessage(message);
  }

  /**
   * Replaces this pagination row in the given message.
   * @param message The message to edit.
   */
  private async editMessage(message: Message<boolean>): Promise<void> {
    const components: TopLevelComponentData[] = message.components.map((component) => component.toJSON());
    const row_index = components.findIndex((component) => {
      if (component.type !== ComponentType.ActionRow) return false;

      const row = component as ActionRowData<ButtonComponentData>;
      return row.components.some(
        (child) =>
          'custom_id' in child && typeof child.custom_id === 'string' && child.custom_id.startsWith(this.prefix),
      );
    });

    if (row_index === -1) components.push(this.toJSON());
    else components[row_index] = this.toJSON();

    await message.edit({ components, flags: 'IsComponentsV2' }).catch(() => undefined);
  }
}
