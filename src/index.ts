import 'dotenv/config';
import { AmeClient } from '@core';
import { OsuAPIRequestBuilder } from '@rian8337/osu-base';

if (!process.env.TOKEN || !process.env.CLIENT_ID) throw new Error('Missing client credentials in .env file.');
if (!process.env.OSU_API_KEY) throw new Error('Missing osu! api v1 key.');
OsuAPIRequestBuilder.setAPIKey(process.env.OSU_API_KEY);

export const client = new AmeClient();

client.start().catch((e) => {
  console.error(e);
  process.exit(1);
});
