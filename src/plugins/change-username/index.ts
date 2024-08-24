import { PluginController } from "#plugins/PluginController.js";
import { Config, configList } from "./config";

function getHeaderElement(): HTMLElement | null {
  return document.querySelector(".header-account-name");
}

export default class ChangeUsername extends PluginController<Config> {
  static id = "change-username" as const;
  static enabledByDefault = true;
  static config = configList;
  oldName = "";

  enabledByDefault = false;

  afterConfigChange() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    const text = headerElement.innerText;
    if (text !== undefined) {
      this.oldName = text;
    }
    headerElement.innerText = this.settings.customText;
  }

  afterEnable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    const text = headerElement.innerText;
    if (text !== undefined) {
      this.oldName = text;
    }
    headerElement.innerText = this.settings.customText;
  }

  afterDisable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    headerElement.innerText = this.oldName;
  }
}
