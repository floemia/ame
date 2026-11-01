import { AmeError } from '@core';
import { CooldownHandler } from '@handlers';
import { Event } from '@structures/core';
import { DroidHelper, EmojiHelper, InteractionHelper, LocalizationHelper } from '@utils/helpers';
import { CacheManager, DatabaseManager } from '@utils/managers';

export const name = 'messageCreate';

export const run: Event<'messageCreate'>['run'] = async (client, message) => {
  const beatmap_id = DroidHelper.getBeatmapIDFromMessage(message);

  if (beatmap_id) {
    CacheManager.storeChannelBeatmap(message.channel, beatmap_id);
  }
  if (message.author.bot) return;

  if (message.content.toLowerCase() == 'ame') {
    try {
      message.react(EmojiHelper.getRandomAmeEmoji());
    } catch {}
  }

  if (!message.guild) return;
  const prefix = DatabaseManager.getGuildConfig(message.guild).prefix;
  if (!message.content.startsWith(prefix)) return;

  const [name, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
  if (!name) return;

  const command = client.message_commands.get(name.toLowerCase());
  if (!command) return;
  // currently no way to get user locale from message.author soooo
  const strings = LocalizationHelper.getLocaleStrings('en-US');

  if (command.disabled) throw new AmeError(strings.command_disabled);

  CooldownHandler.addCommand(command);
  const time_left = CooldownHandler.timeLeft(command, message.author);
  if (time_left > 0) {
    const container = InteractionHelper.createContainer({
      type: 'warn',
      message: `${client.config.emojis.warn}  ${strings.cooldown(time_left)}`,
    });
    return message.reply({
      components: [container],
      allowedMentions: { repliedUser: false },
      flags: 'IsComponentsV2',
    });
  }

  try {
    await message.channel.sendTyping();
    await command.run(client, message, strings, args);
  } catch (error: any) {
    if (!(error instanceof AmeError)) client.log({ type: 'error', message: error.stack });

    const container = InteractionHelper.createContainer({
      type: 'error',
      title: `${client.config.emojis.error}  error!!!`,
      message: error instanceof AmeError ? error.message : strings.error,
    });
    return message.reply({
      components: [container],
      allowedMentions: { repliedUser: false },
      flags: 'IsComponentsV2',
    });
  }
};
