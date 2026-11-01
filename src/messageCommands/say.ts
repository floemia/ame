import { MessageCommand } from '@structures/core';
import { TextChannel } from 'discord.js';

export const data: MessageCommand['data'] = {
  name: 'say',
  aliases: ['say'],
};

export const run: MessageCommand['run'] = async (client, message, strings, args) => {
  if (message.author.id != client.config.developer) return;
  const channel = (await client.channels.fetch(args[0])) ?? message.channel;
  args.shift();
  const text = args.join(' ');
  if (!channel || !(channel instanceof TextChannel) || !text) return;

  try {
    await channel.sendTyping();
    setTimeout(async () => {
      await channel.send(text);
      await message.delete();
    }, Math.random() * 5000);
  } catch (e) {
    console.log(e);
  }
};
