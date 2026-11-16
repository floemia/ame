import { Event } from '@structures/core';
import { ClientEvents } from 'discord.js';
import { ActivityCycle, AvatarCycle } from './utils';
import { TrackingManager } from '@utils/managers';
import consola from 'consola';

export const name: keyof ClientEvents = 'clientReady';

export const run: Event<'clientReady'>['run'] = async (client) => {
  consola.success(`${client.user?.username} is online! (${client.startTime()}s)`);
  ActivityCycle.start();
  AvatarCycle.start();
  if (client.config.tracking.enabled) {
    TrackingManager.start().catch((error: unknown) => {
      consola.withTag('TRACKING').error(error instanceof Error ? (error.stack ?? error.message) : String(error));
    });
  }
};
