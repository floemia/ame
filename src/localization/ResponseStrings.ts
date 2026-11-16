import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';
import { DroidHelper, EmojiHelper } from '@utils/helpers';
import { TextChannel } from 'discord.js';

export class ResponseStrings {
  done = 'done!!';
  error = `an error has ocurred... <@${client.config.developer}> check logs now!!!`;
  user_dne = 'that user doesnt exist!!';
  no_link = 'you dont have a linked osu!droid profile!!! use `/link` first💢';
  mention_no_link = 'that user doesnt have a linked osu!droid profile... 🥺';
  cooldown(time_left: number) {
    const str = time_left.toFixed(2) + 's';
    return `stop!!!!!!!!! you have a cooldown of  ${str}!!!`;
  }
  no_params = `you didnt give me any parameter!!!`;
  no_perms = `you dont have perms to do that bro smh💢💢💢💢`;
  no_scores = 'that user doesnt have any scores... 🥺';
  command_disabled = `this command is temporarily disabled...🥺`;

  commands = {
    ame: {
      tracking: {
        started: 'done!! the score tracking system has been started!',
        already_running: 'the score tracking system is already running!!💢💢',
        stopped: 'the score tracking system has been stopped...🥺',
        updating: 'updating all of the score tracking system entries... check logs',
        status: (running: boolean, users: number) =>
          `the score tracking system is currently ${running ? 'running' : 'stopped'} with ${users} tracked user(s)!`,
      },
    },
    link: {
      success: (user: DroidUser) => `your discord was successfully linked to  ${DroidHelper.userToString(user)}`,
    },
    recent: {
      success: (user: DroidUser, index?: number) =>
        `${EmojiHelper.getRandomAmeEmoji()} | recent score${index ? ` #${index}` : ''} of **${user.username}**:`,
    },
    compare: {
      no_cache: 'there isnt any beatmap being talked about here!!!💢',
      no_map: 'i couldnt find that beatmap... 🥺',
      no_score: 'you dont have any scores in that beatmap!! smh💢',
      success: (user: DroidUser) => `${EmojiHelper.getRandomAmeEmoji()} | comparison score from **${user.username}**:`,
    },
    config: {
      prefix_set: (prefix: string) => `done!! the message command prefix is now \`${prefix}\`!!`,
    },
    tracking: {
      channel_set: (channel: TextChannel, has_perms: boolean) =>
        `done!! score tracking channel was set to ${channel}.${!has_perms ? ' **but... i dont have permission to send messages there!!1!1💢💢💢**' : ''}`,
      status_set: (status: boolean) => `done!! ive ${status ? 'enabled' : 'disabled'} the score tracking system!`,
      user_add: (user: DroidUser) => `ive added  ${DroidHelper.userToString(user)}  to the score tracking system!`,
      user_delete: (user: DroidUser) =>
        `ive removed  ${DroidHelper.userToString(user)}  from the score tracking system...🥺`,
    },
    profile: {
      success: (user: DroidUser) => `${EmojiHelper.getRandomAmeEmoji()} | osu!droid profile of **${user.username}**:`,
    },
    leaderboard: {
      global: (type: string) => `${EmojiHelper.getRandomAmeEmoji()} | osu!droid global ${type} leaderboard:`,
      beatmap: (title: string, type: string) =>
        `${EmojiHelper.getRandomAmeEmoji()} | osu!droid ${type} leaderboard for ${title}:`,
      empty: 'there are no entries in that leaderboard... 🥺',
    },
  };
}
