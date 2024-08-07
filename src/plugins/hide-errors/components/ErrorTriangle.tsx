import HideErrors from "..";
import "./ErrorTriangle.less";
import { jsx } from "#DCGView";

export function ErrorTriangle(hideErrors: HideErrors, id: string, inner: any) {
  return (
    <div
      // Use onClick instead of onTap to allow propagating the event
      onClick={(event: MouseEvent) =>
        event.shiftKey && hideErrors?.toggleErrorHidden(id)
      }
      class={() => ({
        "dsm-he-error-hidden": hideErrors.isErrorHidden(id),
      })}
    >
      {inner}
    </div>
  );
}
