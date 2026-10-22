/**
 * Helps with time related operations.
 */
export abstract class TimeHelper {
  /**
   * A basic timer method.
   * @returns The time in seconds since the timer started.
   */
  static startTimer(): () => number {
    const start = Date.now();
    return () => (Date.now() - start) / 1000;
  }

  /**
   * Returns The time in ISO format.
   */
  static nowFormatted(): string {
    return new Date().toISOString();
  }

  /**
   * Returns the time in MM:SS format.
   * @param seconds The time in seconds.
   */
  static secondsToMMSS(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.ceil(seconds % 60);
    const mm = `${minutes}`.padStart(2, '0');
    const ss = `${secondsLeft}`.padStart(2, '0');
    return `${mm}:${ss}`;
  }
}
