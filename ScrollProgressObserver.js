import { clamp } from "@superstructure.net/utils";

class ScrollProgressObserver {
  constructor(targetElement, options = {}) {
    if (!targetElement) throw new Error("no targetElement defined");

    this.defaults = {
      scrollDirection: "y",
      // re-calculate when viewport or element dimension change
      // manually use resize() when setting observeResize: false
      observeResize: true,

      animationLoop: true,

      // edges of targetElement that start / end the tracking
      // Meant in natural scroll direction:
      // startTargetEdge is triggered when targetElement is scrolled into view with a positive scroll direction
      // endTargetEdge is triggered when targetElement is scrolled into view with a negative scroll direction

      // possible values:
      // - 'start'
      // - 'center
      // - 'end'
      // float 0...1 from start to end
      startTargetEdge: "start",
      endTargetEdge: "end",

      // positions in viewport that start / end the tracking
      // startViewportEdge is triggered when targetElement is scrolled into view with a positive scroll direction
      // endViewportEdge is triggered when targetElement is scrolled into view with a negative scroll direction
      startViewportEdge: 1.0,
      endViewportEdge: 0.0,

      onEnterView: () => {},
      onEnterViewBetweenEdges: () => {},
      onLeaveView: () => {},
      onLeaveViewBetweenEdges: () => {},
      onViewProgress: (progress) => {},

      getScrollPosition: null,
    };
    this.options = { ...this.defaults, ...options };

    this.targetElement = targetElement;
    this.targetDimensions = null;

    this.intersectionObserver = null;
    this.resizeObserver = null;

    this.frame = null;

    this.state = {
      isInView: undefined,
      isInViewBetweenEdges: undefined,
      inViewProgress: undefined,
    };

    this.startTargetEdgeOffset = 0;
    this.endTargetEdgeOffset = 0;
    this.startViewportEdge = 0;
    this.endViewportEdge = 0;

    this.init();
  }

  init() {
    this.resize();
    this.observeIntersection();
    if (this.options.observeResize) this.observeResize();
  }

  resize() {
    this.targetDimensions = this.targetElement.getBoundingClientRect();
    const bounds = this.targetElement.getBoundingClientRect();

    this.targetDimensions = {
      start:
        bounds[this.options.scrollDirection === "y" ? "top" : "left"] +
        this.getScrollPosition(), // aka top/left
      sizeMain:
        bounds[this.options.scrollDirection === "y" ? "height" : "width"], // height on vertical scroll, width on horizontal scroll
      sizeCross:
        bounds[this.options.scrollDirection === "y" ? "width" : "height"], // width on vertical scroll, height on horizontal scroll
    };

    this.startTargetEdgeOffset =
      this.targetDimensions.sizeMain *
      (typeof this.options.startTargetEdge === "number"
        ? this.options.startTargetEdge
        : this.options.startTargetEdge === "end"
        ? 1
        : this.options.startTargetEdge === "center"
        ? 0.5
        : 0);
    this.endTargetEdgeOffset =
      this.targetDimensions.sizeMain *
      (typeof this.options.endTargetEdge === "number"
        ? this.options.endTargetEdge
        : this.options.endTargetEdge === "start"
        ? 1
        : this.options.endTargetEdge === "center"
        ? 0.5
        : 0);

    this.startViewportEdge =
      this.options.startViewportEdge *
      window[
        this.options.scrollDirection === "y" ? "innerHeight" : "innerWidth"
      ];
    this.endViewportEdge =
      this.options.endViewportEdge *
      window[
        this.options.scrollDirection === "y" ? "innerHeight" : "innerWidth"
      ];
  }

  observeIntersection() {
    this.onIntersectionChange = this.onIntersectionChange.bind(this);

    this.intersectionObserver = new IntersectionObserver(
      this.onIntersectionChange,
      {
        rootMargin: `0px 0px 0px 0px`,
      }
    );

    this.intersectionObserver.observe(this.targetElement);
  }

  unobserveIntersection() {
    this.intersectionObserver.disconnect();
    this.intersectionObserver = null;
  }

  observeResize() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    this.resizeObserver.observe(this.targetElement);
  }

  unobserveResize() {
    this.resizeObserver.disconnect();
    this.resizeObserver = null;
  }

  observeScroll() {
    if (!this.options.animationLoop) return;

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      this.onFrame();
    });
  }

  unobserveScroll() {
    cancelAnimationFrame(this.frame);
  }

  destroy() {
    this.unobserveIntersection();
    this.unobserveScroll();
    this.unobserveResize();
    this.unbindEvents();
  }

  // getters
  isInView() {
    return this.state.isInView;
  }

  isInViewBetweenEdges() {
    return this.state.isInViewBetweenEdges;
  }

  getInViewProgress() {
    return this.state.inViewProgress;
  }

  getScrollPosition() {
    if (typeof this.options.getScrollPosition === "function")
      return this.options.getScrollPosition();

    return document.scrollingElement[
      this.options.scrollDirection === "y" ? "scrollTop" : "scrollLeft"
    ];
  }

  bindEvents() {
    this.onViewportResize = this.onViewportResize.bind(this);

    if (this.options.observeResize) {
      window.addEventListener("resize", this.onViewportResize);
    }
  }

  unbindEvents() {
    if (this.options.observeResize) {
      window.removeEventListener("resize", this.onViewportResize);
    }
  }

  onIntersectionChange(entries) {
    if (entries[0].isIntersecting) {
      this.onEnter();
    } else {
      this.onLeave();
    }
  }

  onEnter() {
    console.log("ScrollProgressObserver.onEnter()", this.targetElement);

    this.state.isInView = true;
    this.state.inViewProgress = 0;

    this.observeScroll();

    this.options.onEnterView();
  }

  onLeave() {
    console.log("ScrollProgressObserver.onLeave()", this.targetElement);

    this.state.isInView = false;
    this.state.inViewProgress = 0;

    this.unobserveScroll();

    this.options.onLeaveView();
  }

  onFrame() {
    const inViewProgress = clamp(
      (this.getScrollPosition() +
        this.startViewportEdge -
        this.targetDimensions.start -
        this.startTargetEdgeOffset) /
        (this.targetDimensions.sizeMain +
          this.startViewportEdge -
          this.endViewportEdge -
          this.startTargetEdgeOffset -
          this.endTargetEdgeOffset),
      0,
      1
    );

    if (inViewProgress !== this.state.inViewProgress) {
      this.options.onViewProgress(inViewProgress);
    }

    if (
      !this.state.isInViewBetweenEdges &&
      inViewProgress > 0.0 &&
      inViewProgress < 1.0
    ) {
      console.log("ScrollProgressObserver.onEnterViewBetweenEdges()");

      this.state.isInViewBetweenEdges = true;
      this.options.onEnterViewBetweenEdges();
    }

    if (
      this.state.isInViewBetweenEdges &&
      (inViewProgress <= 0.0 || inViewProgress >= 1.0)
    ) {
      console.log("ScrollProgressObserver.onLeaveViewBetweenEdges()");

      this.state.isInViewBetweenEdges = false;
      this.options.onLeaveViewBetweenEdges();
    }

    this.state.inViewProgress = inViewProgress;

    console.log(this.state.inViewProgress);

    if (!this.options.animationLoop) return;

    this.frame = requestAnimationFrame(() => {
      this.onFrame();
    });
  }

  onViewportResize() {
    this.resize();
  }
}

export { ScrollProgressObserver };
