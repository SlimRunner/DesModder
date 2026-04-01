import { PluginController } from "#plugins/PluginController.js";
import { Config, configList } from "./config";
import { AllActions, DispatchedEvent } from "../../globals/extra-actions";
import { DCGView, MountedComponent } from "#DCGView";
import { MessageBox } from "./components/sample";

declare module "src/globals/extra-actions" {
  interface AllActions {
    "simple-plugin": {
      type: "dsm-simple-plugin-add-random-polynomial";
      index: number;
    };
  }
}

function parentClassCheck(elem: HTMLElement, className: string | string[]) {
  if (Array.isArray(className)) {
    for (let e: HTMLElement | null = elem; e != null; e = e.parentElement) {
      for (const cName of className) {
        if (e.classList.contains(cName)) return true;
      }
    }
  } else {
    for (let e: HTMLElement | null = elem; e != null; e = e.parentElement) {
      if (e.classList.contains(className)) return true;
    }
  }

  return false;
}

function getHeaderElement(): HTMLElement | null {
  return document.querySelector(".header-account-name");
}

function disableContextMenu(evt: HTMLElementEventMap["contextmenu"]) {
  if (
    evt.target instanceof HTMLElement &&
    parentClassCheck(evt.target, ["dcg-expressionitem", "sample-plugin"])
  ) {
    evt.preventDefault();
  }
}

export default class ChangeUsername extends PluginController<Config> {
  static id = "sample-plugin" as const;
  static enabledByDefault = true;
  static config = configList;
  oldName = "";
  clickSurface: HTMLElement | null = null;
  view: MountedComponent | null = null;
  mountPoint: HTMLDivElement | null = null;

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
    this.clickSurface = document.getElementById("graph-container");
    this.clickSurface?.addEventListener("mouseup", (evt) =>
      this.clickCallback(evt)
    );
    document.addEventListener("contextmenu", disableContextMenu);

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
    this.clickSurface?.removeEventListener("mouseup", (evt) =>
      this.clickCallback(evt)
    );
    document.removeEventListener("contextmenu", disableContextMenu);

    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    headerElement.innerText = this.oldName;
  }

  clickCallback(evt: HTMLElementEventMap["mouseup"]) {
    if (evt.button !== 2) {
      this.unmountContextMenu();
      return;
    }
    if (
      evt.target instanceof HTMLElement &&
      parentClassCheck(evt.target, "dcg-expressionitem")
    ) {
      this.mountPoint ??= document.createElement("div");
      this.mountPoint.classList.add("sample-plugin");
      this.mountPoint.style.position = "absolute";
      this.mountPoint.style.zIndex = "999999";
      this.mountPoint.style.left = `${evt.clientX}px`;
      this.mountPoint.style.top = `${evt.clientY}px`;
      document.body.appendChild(this.mountPoint);
      this.view ??= DCGView.mountToNode(MessageBox, this.mountPoint, {});
    } else {
      this.unmountContextMenu();
    }
  }

  unmountContextMenu() {
    if (!this.mountPoint) return;
    DCGView.unmountFromNode(this.mountPoint);
    document.body.removeChild(this.mountPoint);
    this.view = null;
    this.mountPoint = null;
  }

  getPolynomial() {
    const randInt = (start: number, end: number | null = null) => {
      if (end === null) {
        [start, end] = [0, start];
      }

      // from developer.mozilla.org "getting_a_random_integer_between_two_values"
      const minCeiled = Math.ceil(start);
      const maxFloored = Math.floor(end);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    };

    const range = function* (
      start: number,
      end: number | null = null,
      step: number = 1
    ) {
      if (end === null) {
        [start, end] = [0, start];
      }
      if ((end - start) * step < 0) {
        // nothing to do
      } else if (step >= 1) {
        for (let i = start; i < end; i += step) {
          yield i;
        }
      } else {
        for (let i = start; i > end; i += step) {
          yield i;
        }
      }
    };

    const poly: number[] = [];
    const terms = randInt(1, 6);
    for (const _ of range(terms)) {
      poly.push(randInt(-10, 10));
    }

    return poly.map((n, i) => `${n}${i === 0 ? "" : `x^${i}`}`).join("+");
  }

  handleDispatchedAction(action: DispatchedEvent) {
    switch (action.type) {
      case "dsm-simple-plugin-add-random-polynomial":
        this.cc._toplevelNewItemAtSelection(
          this.cc.createItemModel({
            latex: this.getPolynomial(),
            type: "expression",
            id: this.cc.generateId(),
            color: this.cc.getNextColor(),
          }),
          { shouldFocus: true }
        );
        this.cc._closeAddExpression();
        break;
      default:
        action satisfies Exclude<DispatchedEvent, AllActions["simple-plugin"]>;
    }
    return undefined;
  }
}
