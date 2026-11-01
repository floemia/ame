import { client } from '@base';
import { DroidUser } from '@floemia/osu-droid-tools';
import { ResponseStrings } from '@localization';
import { DroidHelper, EmojiHelper } from '@utils/helpers';
import { TextChannel } from 'discord.js';

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
  no_perms = `herman@ no tienes permiso para hacer eso smh💢💢💢💢`;
  no_scores = 'ese usuario no tiene ningún score... 🥺';
  command_disabled = `este comando está temporalmente deshabilitado...🥺`;

  commands = {
    ame: {
      tracking: {
        started: 'listo!! el sistema de tracking de scores se inició!',
        already_running: 'el sistema de tracking de scores está en ejecución!!💢💢',
        stopped: 'el sistema de tracking de scores se detuvo...🥺',
        updating: 'actualizando todas las entradas del sistema de tracking de scores... mira los logs',
        status: (running: boolean, users: number) =>
          `el sistema de tracking de scores está ${running ? 'en ejecución' : 'detenido'} con ${users} usuario(s).`,
      },
    },
    link: {
      success(user: DroidUser) {
        const str = DroidHelper.userToString(user);
        return `tu Discord se vinculó correctamente a  ${str}!!`;
      },
    },
    recent: {
      success: (user: DroidUser, index?: number) =>
        `${EmojiHelper.getRandomAmeEmoji()} | score reciente${index ? ` #${index}` : ''} de  ${DroidHelper.userToString(user)}:`,
    },
    compare: {
      no_cache: 'no hay ningún beatmap siendo conversado en este canal!!!💢💢',
      no_map: 'no pude encontrar ese beatmap... 🥺',
      no_score: 'no tienes ningún score en ese beatmap!! smh💢',
      success: (user: DroidUser) =>
        `${EmojiHelper.getRandomAmeEmoji()} | score de comparación de ${DroidHelper.userToString(user)}:\n-# ${client.config.emojis.warn} la API pública de osu!droid no retorna mods! habrán errores!`,
    },
    error: 'ocurrió un error al ejecutar este comando... <@:596481414426525696:> revisa la consola!!!!',
    config: {
      prefix_set: (prefix: string) => `listo!! el prefijo de los comandos de mensaje ahora es \`${prefix}\`!!`,
    },
    tracking: {
      channel_set: (channel: TextChannel, has_perms: boolean) =>
        `listo!! el canal de tracking de scores ahora es ${channel}.${!has_perms ? ' **pero... no tengo permisos para enviar nada ahí!!1!1💢💢💢**' : ''}`,
      status_set: (status: boolean) => `listo!! ${status ? 'activé' : 'desactivé'} el sistema de tracking de scores!!`,
      user_add: (user: DroidUser) => `añadí a  ${DroidHelper.userToString(user)}  al sistema de tracking de scores!`,
      user_delete: (user: DroidUser) =>
        `quité a  ${DroidHelper.userToString(user)}  del sistema de tracking de scores...🥺`,
    },
  };
}
