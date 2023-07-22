import { STYLE_TAG_REGEX } from "./constants";

export function parseStyleTag({
  response,
  styles,
}: {
  response: string;
  styles: Map<string, string>;
}) {
  if (response) {
    const styleContentArray: string[] = [];
    let match;
    while ((match = STYLE_TAG_REGEX.exec(response)) !== null) {
      const { style, id } = <{ style: string; id: string }>match.groups;
      if (!id || !styles.has(id)) {
        if (id) {
          styles.set(id, style);
        }
        styleContentArray.push(style);
      }
    }
    return styleContentArray;
  }
  return [];
}

export function syncNewStyles(styles: string[]) {
  if (Array.isArray(styles) && styles.length) {
    styles.forEach((styleTag) => {
      const newStyle = document.createElement("style");
      newStyle.innerHTML = styleTag;
      document.head.appendChild(newStyle);
    });
  }
}
