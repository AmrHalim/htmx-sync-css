import htmx from "htmx.org";
import { parseStyleTag, syncNewStyles } from "./utils";

(function () {
  const cachedStyles = new Map();
  htmx.defineExtension("sync-css", {
    onEvent: (name, event) => {
      if (name === "htmx:afterRequest") {
        syncNewStyles(
          parseStyleTag({
            response: event?.detail?.xhr?.responseText,
            styles: cachedStyles,
          })
        );
      }
    },
  });
})();
