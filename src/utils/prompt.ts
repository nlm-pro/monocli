import { prompt } from "inquirer";

export async function yn(message: string, defaultTo = false): Promise<string> {
  const { answer } = await prompt([
    {
      type: `confirm`,
      name: `answer`,
      message,
      default: defaultTo
    }
  ]);

  return answer;
}
