import { Button, Tooltip } from "#components";
import { Component, jsx } from "#DCGView";
import { format } from "#i18n";
import SamplePlugin from "..";
import "./sample.less";

export class ContextMenu extends Component<{ plugin: SamplePlugin }> {
  plugin!: SamplePlugin;

  init(): void {
    this.plugin = this.props.plugin();
  }

  template() {
    return (
      <div class="dcg-popover-interior dsm-sample-context-menu">
        <ul>
          <li>
            <Tooltip tooltip={format("simple-plugin-ctxmenu-tip-btn1")}>
              <Button
                color="light-gray"
                class="dsm-sample-context-menu-button"
                onTap={() => {
                  this.plugin.unmountContextMenu();
                }}
              >
                {format("simple-plugin-ctxmenu-btn1")}
              </Button>
            </Tooltip>
          </li>
          <li>
            <Tooltip tooltip={format("simple-plugin-ctxmenu-tip-btn2")}>
              <Button
                color="light-gray"
                class="dsm-sample-context-menu-button"
                onTap={() => {
                  this.plugin.cc.dispatch({
                    type: "dsm-simple-plugin-add-random-polynomial",
                  });
                  this.plugin.unmountContextMenu();
                }}
              >
                {format("simple-plugin-ctxmenu-btn2")}
              </Button>
            </Tooltip>
          </li>
        </ul>
      </div>
    );
  }
}
