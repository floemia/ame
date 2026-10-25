import { DroidUser } from '@floemia/osu-droid-tools';
import { ResponseStrings } from '@localization';
import { DroidHelper } from '@utils/helpers';

export class SpanishStrings extends ResponseStrings {
  done = 'listo!!';
  error = 'ocurrió un error... <@596481414426525696> mirá los logs ahora!!!';
  user_dne = 'ese usuario no existe!!';
  no_link = 'no tienes un perfil de osu!droid vinculado!!! usa `/link` primero💢💢';
  mention_no_link = 'ese usuario no tiene un perfil de osu!droid vinculado... 🥺';
  cooldown(time_left: number) {
    const str = time_left.toFixed(2) + 's';
    return `basta!!! tienes un cooldown de ${str}!!!`;
  }
  no_params = `no me diste ningún parámetro!!!`;

  commands = {
    link: {
      success(user: DroidUser) {
        const str = DroidHelper.userToString(user);
        return `tu Discord se vinculó correctamente a  ${str}!!`;
      },
    },
    compare: {
      no_cache: 'no hay ningún beatmap siendo conversado en este canal!!!💢💢',
      no_map: 'no pude encontrar ese beatmap... 🥺',
      no_score: 'no tienes ningún score en ese beatmap!! smh💢',
    },
    error: 'ocurrió un error al ejecutar este comando... <@:596481414426525696:> revisa la consola!!!!',
  };
}
