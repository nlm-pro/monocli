import * as readline from "readline";
import { Readable, Writable } from "stream";

let prompter: Prompter;

class Prompter {
  private rl: readline.Interface;

  constructor(input: Readable, output: Writable) {
    this.rl = readline.createInterface({
      input,
      output
    });
  }

  question(query: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(query, resolve);
    });
  }

  yn(query: string, defaultTo = true): Promise<boolean> {
    const valPrompt = defaultTo === true ? `[Y/n]` : `[y/N]`;
    const regex = defaultTo === true ? /^n(o)?/i : /^y(es)?/i;

    return new Promise(resolve => {
      this.rl.question(`${query} ${valPrompt}`, answer => {
        resolve(regex.test(answer));
      });
    });
  }

  close(): void {
    this.rl.close();
  }
}

export function setPrompter(
  input: Readable = process.stdin,
  output: Writable = process.stdout
): void {
  prompter = new Prompter(input, output);
}

export function getPrompter(): Prompter {
  if (!prompter) {
    throw new Error(`interactive mode unavailable`);
  }

  return prompter;
}
