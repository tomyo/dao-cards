customElements.define(
  "snap-carousel",
  class extends HTMLElement {
    constructor() {
      super().attachShadow({ mode: "open" });
      this.handlers = []; /* [element, eventName, handler] */
    }

    connectedCallback() {
      this.renderShadow();
      this.attachEventListeners();
    }

    disconnectedCallback() {
      this.removeEventListeners();
    }

    renderShadow() {
      this.shadowRoot.innerHTML = /*html*/ `
        <slot part="track"></slot>
        
        <slot name="previous" part="previous" class="prev-next-slot">
          <button aria-label="previous element" class="previous">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="currentColor">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
            </svg>
          </button>
        </slot>
        <slot name="next" part="next" class="prev-next-slot">
          <button aria-label="next element" class="next">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="currentColor">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
            </svg>
          </button>
        </slot>
      

        <style>
          :host {
            --object-fit: contain;
            --scroll-snap-type: x mandatory;
            --scroll-behaviour: smooth;
            --scroll-snap-align: center;
            --gap: 0;

            display: block;
            position: relative;
            user-select: none;
          }

          slot[part="track"] {
            scroll-snap-type: var(--scroll-snap-type);
            overflow-x: auto;
            overflow-y: hidden;
            user-select: none;
            scroll-behavior: var( --scroll-behaviour);
            display: flex;
            flex-wrap: nowrap;
            gap: var(--gap);
            -webkit-overflow-scrolling: touch;
          }

          slot[part="track"]::slotted(*) {
            scroll-snap-align: var(--scroll-snap-align);
            max-height: 100% !important;
          }

          .prev-next-slot {
            display: grid;
            position: absolute;
            top: 0;
            height: 100%;
            width: 10vmax;
            display: none;
          }

          .prev-next-slot > *:hover {
            cursor: pointer;
          }

          .prev-next-slot button {
            border: none;
            padding: 0;
            margin: 0;
            color: hsla(0, 0%, 100%, 0.7);
            background-color: transparent;
            font-size: 2em;
          }

          slot[name="previous"] {
            left: 0;
          }

          slot[name="next"] {
            right: 0;
          }


          @media (hover: hover) {
            /* We can hover (probably not a touch device) */
            /*slot:not([name]) {
              cursor: grab;
            }
            .close-button {
              opacity: 0.65;
            }

            .close-button:hover {
              opacity: 1;
            }*/
          }
        </style>
      `;
    }
    attachEventListeners() {
      const nextButton = this.shadowRoot.querySelector("slot[name='next']");
      const previousButton = this.shadowRoot.querySelector(
        "slot[name='previous']"
      );
      const track = this.shadowRoot.querySelector("slot:not([name])");

      this.handlers = [
        [
          nextButton,
          "click",
          (e) => track.scrollBy({ left: 10, behaviour: "smooth" }),
        ],
        [
          previousButton,
          "click",
          (e) => track.scrollBy({ left: -10, behaviour: "smooth" }),
        ],
      ];

      // if (window.matchMedia("(hover: hover)").matches) {
      //   this.handlers.push([track, "mousedown", useGrabToScroll(track)]);
      // }

      for (const [element, eventName, handler] of this.handlers) {
        element.addEventListener(eventName, handler);
      }
    }

    removeEventListeners() {
      for (const [element, eventName, handler] of this.handlers) {
        element.removeEventListener(eventName, handler);
      }
    }
  }
);

/**
 * Use grab to scroll the carousel horizontally
 * @returns {function} mouseDownHandler
 *
 * Do not use on touch devices:  (Check if window.matchMedia("(hover: hover)").matches)
 */
function useGrabToScroll(elementToScrollWithin) {
  const pos = { left: 0, x: 0 };
  //

  const mouseDownHandler = (e) => {
    if (e.button !== 0) return; // Only left click

    // Using scroll-snap or smooth scroll while dragging is buggy on chrome
    elementToScrollWithin.style.setProperty("--scroll-behaviour", "auto");
    elementToScrollWithin.style.setProperty("--scroll-snap-type", "none");
    pos.left = elementToScrollWithin.scrollLeft; // The current x-scrolled amount
    pos.x = e.clientX; // Get the current mouse x-position
    e.preventDefault(); // needed to allow the mouseup event to fire (-_-)

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e) => {
    const dx = e.clientX - pos.x;
    elementToScrollWithin.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = () => {
    window.removeEventListener("mousemove", mouseMoveHandler);
    window.removeEventListener("mouseup", mouseUpHandler);

    elementToScrollWithin.style.setProperty("--scroll-behaviour", "inherit");
    // elementToScrollWithin.style.setProperty("--scroll-snap-type", "inherit");
  };

  return mouseDownHandler;
}
