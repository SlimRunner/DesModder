import { ConfigItem } from "#plugins/index.ts";

export const configList = [
  {
    type: "string",
    key: "customText",
    variant: "text",
    default: "DesModder ♥",
  },
] satisfies readonly ConfigItem[];

export interface Config {
  customText: string;
}
