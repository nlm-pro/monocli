import { SubProjectConfig } from "./Config";

export abstract class SubProject {
  constructor(private config: SubProjectConfig) {}
}
