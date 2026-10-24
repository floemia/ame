import { DroidUser } from '@floemia/osu-droid-tools';
import { ResponseStrings } from '@localization';
import { DroidHelper } from '@utils/helpers';

export class SpanishStrings extends ResponseStrings {
  done = 'listo!!';
  error = 'ocurrió un error... <@596481414426525696> mirá los logs ahora!!!';
  user_dne = 'ese usuario no existe!!';
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
    error: 'ocurrió un error al ejecutar este comando... <@:596481414426525696:> revisa la consola!!!!',
  };
}
