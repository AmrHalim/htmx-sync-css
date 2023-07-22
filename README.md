# htmx-sync extension

## Why?

- To manage your CSS in `htmx`, you'd usually bundle all of your styles in one file and load it in the browser with the initial request to ensure every piece of HTML/X that's returned from your server will find all the styles it needs.
- There isn't a direct way to only ship the CSS that's generally needed in the initial request, and then attach other chunks of styles that are related to the chunk of CSS that you're sending back.

### Example

Let's assume you have the following `htmx` snippet:

```html
<div>
  <button hx-get="/get-em" hx-target="#target">Get 'em!</button>
  <span id="target"></span>
</div>
```

`/get-em` endpoint returns the following `htmx`:

```html
<span class="take_em">We're here!</span>
```

Now if you need to style this span to look special or different, you'd usually need to add styles for `take_em` class in your initial CSS file that's returned with the very first request to your server.

### Not anymore with `sync-css` extension!

You can update the head's styles if you follow 3 steps:

1.  Add `sync-css` extension to your original HTML head.

    ```html
    <!-- htmx  -->
    <script src="https://unpkg.com/htmx.org"></script>
    <!-- sync-css extension -->
    <script src="https://unpkg.com/htmx-sync-css" defer></script>
    ```

2.  Wrap either your `body` or the nearest element you want the extension to take effect on with `hx-ext="sync-css"`.

    ```html
    <div hx-ext="sync-css">
      <button hx-get="/get-em" hx-target="#target">Get 'em!</button>
      <span id="target"></span>
    </div>
    ```

3.  Add a `<style>` tag in the returned `htmx` from your `/get-em` endpoint that should contain the new styles updates. To ensure these styles will not be update every time this endpoint is called, it's best to set `data-style-id`.

    ```html
    <style data-style-id="take-em-styles">
      .take_em {
        background-color: "yellow";
      }
    </style>
    <span class="take_em">We're here!</span>
    ```
