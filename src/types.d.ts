type Verb = "get" | "post" | "put" | "delete" | "patch";
type Obj = Record<string, unknown>;

type HTMXEventName =
  | "htmx:afterOnLoad"
  | "htmx:afterProcessNode"
  | "htmx:afterRequest"
  | "htmx:afterSettle"
  | "htmx:afterSwap"
  | "htmx:beforeOnLoad"
  | "htmx:beforeProcessNode"
  | "htmx:beforeRequest"
  | "htmx:beforeSend"
  | "htmx:beforeSwap"
  | "htmx:beforeTransition"
  | "htmx:configRequest"
  | "htmx:confirm";

type HTMXEventDetailBase = {
  elt: HTMLElement;
  requestConfig: Obj;
  target: HTMLElement;
  xhr: XMLHttpRequest;
};

type HTMXAfterRequestEvent = HTMXEventDetailBase & {
  successful?: boolean;
  failed?: boolean;
};

type HTMXConfirmEvent = HTMXEventDetailBase & {
  etc?: Obj;
  issueRequest?: () => void;
  path?: string;
  triggeringEvent?: Event;
  verb?: Verb;
};

type HTMXEventMap = {
  "htmx:afterRequest": HTMXEventBase<HTMXAfterRequestEvent>;
  "htmx:confirm": HTMXEventBase<HTMXConfirmEvent>;
};
type HTMXEventBase<T> = Event & {
  detail: T;
};

type HTMXEvent<T extends HTMXEventName = HTMXEventName> =
  T extends keyof HTMXEventMap ? HTMXEventMap[T] : never;

type HTMXEventOverloads = {
  [K in HTMXEventName]: (name: K, event: HTMXEvent<K>) => void;
};

type HTMXExtension = {
  onEvent: <T extends HTMXEventName>(name: T, event: HTMXEvent<T>) => void;
};

declare module "htmx.org" {
  function defineExtension(name: string, ext: HTMXExtension): void;
  type HtmxExtensions = {
    "sync-css": HTMXExtension;
  };
}
