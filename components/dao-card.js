customElements.define(
  "dao-card",
  class extends HTMLElement {
    constructor() {
      super().attachShadow({ mode: "open" });

      /**
       * @type {[HTMLElement, string, EventListener][]}
       */
      this.handlers = [];
    }

    connectedCallback() {
      this.renderShadow();
      this.addEventListeners();
    }

    disconnectedCallback() {
      this.removeEventListeners();
    }

    renderShadow() {
      this.shadowRoot.innerHTML = /*html*/ `
        <button onclick="document.exitFullscreen()" class="close-button"></button>
        <div class="card-wrapper">
          <a href="#${this.id}" class="card" part="card">
            <div class="content" part="content">
              <header>
                <slot name="title"></slot>
                <slot name="description"></slot>
              </header>
            </div>
            <slot>
              <!-- image expected into default slot -->
            </slot>
          </a>
        </div>

        <style>
          :host {
            position: relative;

            --close-button-color: white;
            --close-button-bottom: 4vw;
            --close-button-width: 40px;
            --close-button-line-height: 3px;
          }

          .card-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            perspective: 400px;
          }

          .card {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            backface-visibility: hidden;
            display: inline-block;
            border-radius: 20px;
          }

          .card header {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            perspective: 400px;
            transform-style: preserve-3d;
            width: 80%;
          }

          .content {
            display: none;
            --padding: 7%;
            max-height: calc(100% - var(--padding) - 1%);
            padding: var(--padding);
            position: absolute;
            inset: 0;
            transform: translateZ(50px);
            transform-style: preserve-3d;
          }

          ::slotted(img) {
            height: 100%;
            object-fit: cover;
          }

          .card-wrapper {
            display: contents;
            --direction: row;
          }


          @media (orientation: portrait) {
            .card-wrapper {
              --direction: column;
              width: 70%;
            }
          }

          @media (orientation: landscape) {
            .card-wrapper {
              --direction: column;
              height: 75%;
            }

            :host(:fullscreen) a {
              flex-basis: 100%;
            }
          }

          .close-button {
            display: none;
          }

          :host(:fullscreen) .close-button {
            display: block;
            position: fixed;
            top: 1em;
          }

          :host(:fullscreen) a {
            flex-basis: -moz-available;
          }

          :host(:fullscreen) ::slotted(img) {
            display: block;
            margin: auto;
          }

          :host(:fullscreen) .card-wrapper {
            display: flex;
            flex-direction: var(--direction);
            place-content: center;
          }


          :host(:fullscreen)::backdrop {
            background-color: transparent;
            backdrop-filter: brightness(.6) blur(6px);
          }
          

          /* Default close-button styles */
          .close-button {
            width: var(--close-button-width);
            aspect-ratio: 1/1;
            position: relative;
            background-color: transparent;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
          }

          .close-button::before, .close-button::after{
            content: "";
            position: absolute;
            width: 100%;  
            height: var(--close-button-line-height);
            top: calc(50% - var(--close-button-line-height) / 2);
            left: 0;
            background-color: var(--close-button-color);
          }
          .close-button::before {
            transform: rotate(45deg);
          }

          .close-button::after {
            transform: rotate(-45deg);
          }

          @media (hover: hover) {
            /* We can hover (probably not a touch device) */
            slot:not([name]) {
              cursor: move;
            }
            .close-button {
              opacity: 0.65;
            }

            .close-button:hover {
              opacity: 1;
            }
          }

        </style>
      `;
    }

    addEventListeners() {
      let toggled = false;
      const a = this.shadowRoot.querySelector("a");

      this.handlers = [
        [
          // Hide cards when image fails to load
          this.querySelector("img"),
          "error",
          (e) => {
            this.classList.add("missing-img");
          },
        ],
        [
          this,
          "click",
          (e) => {
            if (!document.fullscreenElement) {
              this.requestFullscreen();
            }
            this.classList.toggle("show-info");

            const href = a.getAttribute("href");

            if (toggled) {
              a.href = href == "#" ? `#${this.id}` : "#";
              history.replaceState(null, null, a.href);
            }

            if (href == "#") toggled = true;
          },
        ],
      ];

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
