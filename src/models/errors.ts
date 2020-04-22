// TODO: check if all this type are globally handled

export class GitError extends Error {
  constructor(message?: string, public code?: number) {
    super(message);
  }
}

export class RunConditionError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class CommandOptionError extends Error {
  constructor(public optionName: string | string[], message?: string) {
    super(message);
  }
}

export class ExitError extends Error {
  constructor(
    message?: string,
    public data: Iterable<unknown> = [],
    public code: number = 1
  ) {
    super(message);
  }
}

export class MonorepoError extends Error {}

export class ConfigError extends Error {}
