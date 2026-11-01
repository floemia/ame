import { Event } from '@structures/core';
import { ClientEvents } from 'discord.js';
import { ActivityCycle, AvatarCycle } from './utils';
import { TrackingManager } from '@utils/managers';

export const name: keyof ClientEvents = 'clientReady';

export const run: Event<'clientReady'>['run'] = async (client) => {
  client.log({
    prefix: 'START',
    message: `${client.user?.username} is online! (${client.startTime()}s)`,
  });
  ActivityCycle.start();
  AvatarCycle.start();
  if (client.config.tracking.enabled) TrackingManager.start();
};
