# ScrollProgressObserver

Track the visibility and scroll progress of elements in the viewport.
When do they enter and leave the viewport while scrolling? How far have they advanced through the viewport?

## Install

`npm install '@superstructure.net/scrollprogressobserver'`

## Usage

```js
import {ScrollProgressObserver} from @superstructure.net/scrollprogressobserver';

const targetElement = document.querySelector( '.target' );
const options = {}

const observer = new ScrollProgressObserver( observer, options)

```

## Options

### `scrollDirection`

`y` or `x`

Default: `y`

### `observeResize`

Update the instance when the target element or the viewport ios resized. Uses `ResizeObserver` internally.

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

#### `onEnterView` and `onLeaveView`

Called when the target element enters/leaves the viewport. Ignores `startTargetEdge`, `endTargetEdge`, `startViewportEdge` and `endViewportEdge`.

#### `onLeaveViewBetweenEdges` and `onLeaveViewBetweenEdges`

Called when tracking of the target element starts/ends. Can be controlled via `startTargetEdge`, `endTargetEdge`, `startViewportEdge` and `endViewportEdge`.

#### `onViewProgress`

Called every frame whil tracking of the target element is active. Receives a `progress` argument in the range `0...1`.

## Demo

_TO-DO_
