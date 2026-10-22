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
    const image = await loadImage(source);
    ctx.drawImage(image, 0, 0, 1, 1);

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    return (r << 16) | (g << 8) | b;
  }
}
