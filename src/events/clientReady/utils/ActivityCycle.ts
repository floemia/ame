import { client } from '@base';
import { ActivityType } from 'discord.js';

/**
 * Handles the activity cycle system of the bot.
 */
export abstract class ActivityCycle {
  /**
   * The path of the avatar directory.
   */
  private static activities: string[] = [
    'playing with p-chan',
    'playing osu!droid',
    'streaming',
    'alsdkjafkfhjkc',
    'i dont do shit',
    'ffsvjlg,./g/g/gh,jgf/f',
    'p-chaaannnnnn',
    'in my room',
    'im doing my best',
    'AAAAAAAAAAAAAAAAAAA',
    'alsdkjafkfhjkc',
    'shittalking in /st/',
    'asfasfvwv/,,wefvw/qwvwvw.',
    '****ing myself',
    'reading bl',
    'sTOP IGNORING ME!!!!!',
    'everyone PLEASE die',
    'ejhghogshofgnlsjhgo;h;skfjg;',
    'need to grind... need to grind..',
    'ii watn ot fukcuifng die',
    'ggghgjhHGKJSHDGIUAHEUHAOEO',
    'AAAAAAAAAGGGGGGGGGGHHHHHH',
    'i crave death',
    'FUUUUUUCKKKKKKKKKKK',
    'you will love me you will love m',
    'say that im cute',
    'thsi shIT SLAPs>Afghhhghfhhhhh',
    'I FEEL GREAT',
    'gimme 9999999 money!!!!!!!!!!!',
    'my brains leakign out my easrss',
    'gjkgjdskgggggggggg',
    'ba ba bagu sa bagubagu',
  ];

  /**
   * List of already selected activities.
   */
  private static previous_activities: string[] = [];

  /**
   * The cooldown of the activity cycle system.
   */
  private static cooldown = client.config.cooldown.activity;

  /**
   * Starts the activity cycle system.
   */
  static start() {
    this.setRandomActivity();
    setInterval(async () => {
      this.setRandomActivity();
    }, this.cooldown * 1000);
  }

  /**
   * Changes the activity of the bot.
   */
  static setRandomActivity(length: number = 7) {
    const candidates = this.activities.filter((a) => !this.previous_activities.includes(a));
    if (candidates.length == 0) return;
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    if (this.previous_activities.length == length) this.previous_activities.shift();
    this.previous_activities.push(selected);
    client.user!.setActivity({ type: ActivityType.Playing, name: selected });
  }
}
