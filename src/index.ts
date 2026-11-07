import 'dotenv/config';
import { AmeClient } from '@core';

if (!process.env.TOKEN || !process.env.CLIENT_ID) throw new Error('Missing client credentials in .env file.');
if (!process.env.OSU_API_KEY) throw new Error('Missing osu! api v1 key.');

export const client = new AmeClient();
client.start().catch((e) => {
  client.log({
    type: 'error',
    message: e.stack,
  });
  process.exit(1);
});
