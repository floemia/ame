import { Event } from '@structures/core';
import { ClientEvents } from 'discord.js';

export const name: keyof ClientEvents = 'clientReady';

export const run: Event<'clientReady'>['run'] = async (client) => {
  client.log({
    prefix: 'START',
    message: `${client.user?.username} is online! (${client.startTime()}s)`,
  });
};
