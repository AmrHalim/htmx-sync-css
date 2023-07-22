import { parseStyleTag, syncNewStyles } from "../utils";

const generateResponse = (styles: string[], id: string = "") => {
  const styleId = id ? ` data-style-id="${id}"` : "";
  return styles
    .map((style) => `<style${styleId}>${style}</style>`)
    .join()
    .concat("<div></div>");
};

describe("parseStyleTag", () => {
  it("should return an empty array for empty response", () => {
    expect(parseStyleTag({ response: "", styles: new Map() })).toEqual([]);
  });

  it("should return an empty array for responses without style tags", () => {
    expect(
      parseStyleTag({ response: "<div></div>", styles: new Map() })
    ).toEqual([]);
  });

  it("should detect style tags without data-style-id", () => {
    const styles = [".class { property: value}"];
    const response = generateResponse(styles);
    const results = parseStyleTag({ response, styles: new Map() });

    expect(results).toEqual(styles);
  });

  it("should detect multiple style tags", () => {
    const styles = [
      ".class { property: value }",
      ".class2 { property: value }",
    ];
    const response = generateResponse(styles);
    const results = parseStyleTag({ response, styles: new Map() });

    expect(results).toEqual(styles);
  });

  it("should detect style tags with data-style-id", () => {
    const styles = [".class { property: value }"];
    const styleId = new Date().getTime().toString();
    const response = generateResponse(styles, styleId);
    const cache = new Map();

    const results = parseStyleTag({ response, styles: cache });

    expect(results).toEqual(styles);
    expect(cache.has(styleId)).toBeTruthy();
  });

  it("should not add a style with the same style id more than once", () => {
    const styles = [".class { property: value }"];
    const styleId = new Date().getTime().toString();
    const response = generateResponse(styles, styleId);
    const cache = new Map();

    const results = parseStyleTag({ response, styles: cache });
    const results1 = parseStyleTag({ response, styles: cache });

    expect(results).toEqual(styles);
    expect(results1).toEqual([]);
    expect(cache.size).toEqual(1);
  });
});

const appendHeadChild = jest.fn();

describe("syncNewStyles", () => {
  beforeAll(() => {
    Object.defineProperty(document, "head", {
      value: {
        ...document.head,
        appendChild: appendHeadChild,
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should not try to append a style tag if nothing is provided", () => {
    syncNewStyles([]);
    expect(appendHeadChild).not.toHaveBeenCalled();
  });

  it("should append a style tag as a child to the head", () => {
    const style = ".class { color: red }";
    syncNewStyles([style]);

    expect(appendHeadChild).toHaveBeenCalledTimes(1);
    expect(appendHeadChild.mock.calls[0][0].outerHTML).toBe(
      `<style>${style}</style>`
    );
  });
});
