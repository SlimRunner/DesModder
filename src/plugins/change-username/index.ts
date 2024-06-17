import { PluginController } from "#plugins/PluginController.js";

function getHeaderElement() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return document.querySelector(".header-account-name") as HTMLElement | null;
}

export default class ChangeUsername extends PluginController {
  static id = "change-username" as const;
  static enabledByDefault = true;
  oldName = "";

  enabledByDefault = false;

  afterEnable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    const text = headerElement.innerText;
    if (text !== undefined) {
      this.oldName = text;
    }
    headerElement.innerText = "DesModder ♥";
  }

  afterDisable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    headerElement.innerText = this.oldName;
  }
}
