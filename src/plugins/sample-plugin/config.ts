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
    options: [
      { name: "A", i18nKey: "simple-plugin-opt-option-01" },
      { name: "Option1", i18nKey: "simple-plugin-opt-option-02" },
      { name: "Option2", i18nKey: "simple-plugin-opt-option-03" },
    ],
    default: "A",
  },
] satisfies readonly ConfigItem[];

export interface Config {
  customText: string;
  option: string;
}
