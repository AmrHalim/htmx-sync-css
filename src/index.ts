// htmx extension to intercept response text and sync
// <style> tags content to the document head
// It's advisable to give the style tag an data-style-id from the server to allow ..
// .. the extension to not add the same style twice in case it's a recurring request

import htmx from "htmx.org";

(function () {
  const swappedStyles = new Map();
  const STYLE_TAG_REGEX =
    /<style(?: data-style-id="(?<id>.+)")?>(?<style>[\s\S]*?)<\/style>/g;
  function parseStyleTag(responseText: string) {
    if (responseText) {
      const styleContentArray: string[] = [];
      let match;
      while ((match = STYLE_TAG_REGEX.exec(responseText)) !== null) {
        const { style, id } = <{ style: string; id: string }>match.groups;
        if (!id || !swappedStyles.has(id)) {
          if (id) {
            swappedStyles.set(id, style);
          }
          styleContentArray.push(style);
        }
      }
      return styleContentArray;
    }
    return [];
  }

  function syncNewStyles(styles: string[]) {
    if (Array.isArray(styles) && styles.length) {
      styles.forEach((styleTag) => {
        const newStyle = document.createElement("style");
        newStyle.innerHTML = styleTag;
        document.head.appendChild(newStyle);
      });
    }
  }

  htmx.defineExtension("sync-css", {
    onEvent: (name, event) => {
      if (name === "htmx:afterRequest") {
        syncNewStyles(parseStyleTag(event?.detail?.xhr?.responseText));
      }
    },
  });
})();
