import { DroidUser } from '@floemia/osu-droid-tools';
import { DroidHelper } from '@utils/helpers';

export class ResponseStrings {
  done = 'done!!';
  error = 'an error has ocurred... <@596481414426525696> check logs now!!!';
  user_dne = 'that user doesnt exist!!';
  no_link = 'you dont have a linked osu!droid profile!!! use `/link` first💢';
  mention_no_link = 'that user doesnt have a linked osu!droid profile... 🥺';
  cooldown(time_left: number) {
    const str = time_left.toFixed(2) + 's';
    return `stop!!!!!!!!! you have a cooldown of  ${str}!!!`;
  }
  no_params = `you didnt give me any parameter!!!`;

  commands = {
    link: {
      success(user: DroidUser) {
        const str = DroidHelper.userToString(user);
        return `your Discord was successfully linked to  ${str}.`;
      },
    },
    compare: {
      no_cache: 'there isnt any beatmap being talked about here!!!💢',
      no_map: 'i couldnt find that beatmap... 🥺',
      no_score: 'you dont have any scores in that beatmap!! smh💢',
    },
  };
}
