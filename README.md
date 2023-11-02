# ScrollProgressObserver

Track the visibility and scroll progress of elements in the viewport.
When do they enter and leave the viewport while scrolling? How far have they advanced through the viewport?

## Demo

https://codesandbox.io/s/scrollprogressobserver-js-demo-xnm2k7?file=/src/Demo.js

## Install

`npm install '@superstructure.net/scrollprogressobserver'`

## Usage

```js
import { ScrollProgressObserver } from "@superstructure.net/scrollprogressobserver";

const targetElement = document.querySelector(".target");
const options = {
  // This configuration starts tracking the target element when its
  // top edge passes a point 10vh from the viewport's bottom edge and
  // stops tracking when the target element's bottom edge passes a
  // point 20vh from the viewport's top edge.
  //
  // No worries, the default settings or fine, too.
  startTargetEdge: "start",
  endTargetEdge: "end",
  startViewportEdge: 0.9,
  endViewportEdge: 0.2,

  // Callbacks
  onEnter: () => {
    console.log("target element tracking started.");
  },
  onLeave: () => {
    console.log("target element tracking stopped.");
  },
  onProgress: (progress) => {
    console.log(
      `target element has progressed ${progress * 100}% through the viewport.`
    );
  },
};

const observer = new ScrollProgressObserver(targetElement, options);
```

## Options

### `scrollDirection`

`y` or `x`

Default: `y`

### `observeResize`

Update the instance when the target element or the viewport is resized. Uses `ResizeObserver` internally.

Default: `true`

Manually call the `resize()` method when setting `observeResize: false`.

### `animationLoop`

Default: `true`

Run an internal animation loop based on `requestAnimationFrame`.
Manually call the `onFrame` method when using an external animation loop.

### Tracking edges

#### `startTargetEdge`

Defines the target element's edge that starts tracking when scrolling in positive direction.

`start`, `center`, `end` or float from 0...1 (start...end).

Default: `start`

**Example:** When setting `startTargetEdge: "start"` with `scrollDirection: "y"`, tracking starts when the target element's top edge passes the `startViewportEdge` (defaults to the bottom edge of the screen).

#### `endTargetEdge`

Defines the target element's edge that ends tracking when scrolling in positive direction.

`start`, `center`, `end` or float from 0...1 (start...end).

Default: `end`

**Example:** When setting `endTargetEdge: "end"` with `scrollDirection: "y"`, tracking ends when the target element's bottom edge passes the `endViewportEdge` (defaults to the top edge of the screen).

#### `startViewportEdge`

Defines the viewport's edge that starts tracking when scrolling in positive direction.

`start`, `center`, `end` or float from 0...1 (start...end).

Default: `end`

**Example:** When setting `startViewportEdge: "end"` with `scrollDirection: "y"`, tracking starts when the target element's `startTargetEdge` (defaults to the top edge of the target element) passes the bottom edge of the viewport .

#### `endViewportEdge`

Defines the viewport's edge that ends tracking when scrolling in positive direction.

`start`, `center`, `end` or float from 0...1 (start...end).

Default: `start`

**Example:** When setting `endViewportEdge: "start"` with `scrollDirection: "y"`, tracking ends when the target element's `endTargetEdge` (defaults to the bottom edge of the target element) passes the top edge of the viewport .

### Callbacks

#### `onEnter` and `onLeave`

Called when tracking of the target element starts/ends. Can be controlled via `startTargetEdge`, `endTargetEdge`, `startViewportEdge` and `endViewportEdge`. Receives the target element as first argument.

#### `onEnterViewport` and `onLeaveViewport`

Called when the target element enters/leaves the viewport. Ignores `startTargetEdge`, `endTargetEdge`, `startViewportEdge` and `endViewportEdge`. Receives the target element as first argument.

#### `onProgress`

Called every frame whil tracking of the target element is active. Receives `progress` in the range `0...1` as first argument and the target element as the second argument.
