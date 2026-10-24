import { DroidUser } from '@floemia/osu-droid-tools';
import { DroidHelper } from '@utils/helpers';

export class ResponseStrings {
  done = 'done!!';
  error = 'an error has ocurred... <@596481414426525696> check logs now!!!';
  user_dne = "that user doesn't exist";
  cooldown(time_left: number) {
    const str = time_left.toFixed(2) + 's';
    return `stop!!!!!!!!! you have a cooldown of  ${str}!!!`;
  }
  no_params = `you didn't give me any parameter!!!`;

  commands = {
    link: {
      success(user: DroidUser) {
        const str = DroidHelper.userToString(user);
        return `your Discord was successfully linked to  ${str}.`;
      },
    },
  };
}
