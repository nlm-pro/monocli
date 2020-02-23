import { SubProjectConfig } from "./config";

export abstract class SubProject {
  constructor(private config: SubProjectConfig) {}
}
