import { ConfigItem } from "#plugins/index.ts";

export const configList = [
  {
    type: "string",
    key: "customText",
    variant: "text",
    default: "DesModder ♥",
  },
  {
    type: "segmented-options",
    key: "option",
    options: ["A", "Option1", "Option2"],
    default: "A",
  },
] satisfies readonly ConfigItem[];

export interface Config {
  customText: string;
  option: string;
}
