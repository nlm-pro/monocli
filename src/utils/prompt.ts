import { Writable } from "stream";
import * as NPrompt from "prompts";

let stdout: Writable;

export function setOutput(stream: Writable) {
  stdout = stream;
}

export function prompts<T extends string = string>(
  questions: NPrompt.PromptObject<T> | Array<NPrompt.PromptObject<T>>,
  options?: NPrompt.Options
): Promise<NPrompt.Answers<T>> {
  const mappedQuestions = (Array.isArray(questions)
    ? questions
    : [questions]
  ).map(question => ({
    stdout,
    ...question
  }));

  return NPrompt(mappedQuestions, options);
}

export async function confirm(
  message: string,
  params: Partial<NPrompt.PromptObject> = {},
  options?: NPrompt.Options
): Promise<boolean> {
  const answer = await prompts(
    {
      ...params,
      type: `confirm`,
      name: `confirm`,
      message
    },
    options
  );

  return answer.confirm;
}
