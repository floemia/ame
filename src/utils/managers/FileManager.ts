import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '../');

/**
 * Manages the file structure of the client.
 */
export abstract class FileManager {
  /**
   * Recursively scans a directory and its subdirectories for `.js` files.
   * @param dir The main directory.
   * @param jsFiles An array to store the found JavaScript files.
   * @returns The found JavaScript files.
   */
  static getJSFiles(dir: string, jsFiles: string[] = []): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.getJSFiles(fullPath, jsFiles);
      } else if (entry.isFile() && entry.name.endsWith('.js')) jsFiles.push(fullPath);
    }
    return jsFiles;
  }

  /**
   * Reads the `./assets/avatars/` directory and returns all files in it.
   */
  static getClientAvatars(): string[] {
    const fileList = [];
    const dir = path.join(root, './assets/avatars');
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      fileList.push(fullPath);
    }
    return fileList;
  }
}
