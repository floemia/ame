import { createCanvas, Image, loadImage } from '@napi-rs/canvas';

/**
 * Helps with color related operations.
 */
export abstract class ColorHelper {
  /**
   * Converts a string color to its number equivalent.
   * @param hex_color The hex color `(#xxxxxx)`
   */
  static hexToNumber(hex_color: string): number {
    return Number(`0x${hex_color.slice(1)}`);
  }

  /**
   * Retrieves the dominant color from an image.
   * @param source URL or buffer of the image.
   */
  static async getDominantColor(source: string | Image | ArrayBufferLike | Buffer<ArrayBufferLike>): Promise<number> {
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    try {
      const image = await loadImage(source);
      ctx.drawImage(image, 0, 0, 1, 1);

      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      return (r << 16) | (g << 8) | b;
    } catch {
      return 0xffffff;
    }
  }

  /**
   * Retrieves the accent color from an image.
   *
   * This is the dominant color of the image, brightened until it is no longer dark.
   * @param source URL or buffer of the image.
   */
  static async getAccentColor(source: string | Image | ArrayBufferLike | Buffer<ArrayBufferLike>): Promise<number> {
    let color = await this.getDominantColor(source);

    while (this.isDark(color)) {
      const brighter = this.addBrightness(color, 20);
      if (brighter === color) break;
      color = brighter;
    }

    return color;
  }

  /**
   * Returns whether a color is too dark to be used as an accent color.
   * @param color The color as a number (`0xrrggbb`).
   */
  static isDark(color: number): boolean {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    // Perceived brightness, from 0 (black) to 1 (white).
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return brightness < 0.4;
  }

  /**
   * Adds brightness to a color by mixing it with white.
   * @param color The color as a number (`0xrrggbb`).
   * @param percent The percentage of brightness to add (0 - 100).
   */
  static addBrightness(color: number, percent: number): number {
    const factor = Math.min(Math.max(percent, 0), 100) / 100;
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const brighten = (channel: number) => Math.round(channel + (255 - channel) * factor);

    return (brighten(r) << 16) | (brighten(g) << 8) | brighten(b);
  }
}
