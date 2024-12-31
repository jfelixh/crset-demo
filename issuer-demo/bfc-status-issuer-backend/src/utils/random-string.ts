import crytpo from "crypto";

interface RandomStringOptions {
  length: number;
  type: BufferEncoding;
}

/**
 * Generates a random string based on the specified options.
 *
 * @param {RandomStringOptions} [options={ length: 64, type: "hex" }] - The options for generating the random string.
 * @param {number} options.length - The length of the random string. Defaults to 64 (256 bits).
 * @param {string} options.type - The encoding type of the random string. Defaults to "hex".
 * @returns {string} A random string of the specified length and type.
 */
export function randomString(
  { length, type }: RandomStringOptions = { length: 64, type: "hex" }
): string {
  return crytpo.randomBytes(length).toString(type);
}
