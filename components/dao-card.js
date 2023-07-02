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
        <div class="card-wrapper">
          <a href="#${this.id}" class="card" part="card">
            <div class="content border" part="content">
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

          .border {
            transform: translateZ(50px);
            transform-style: preserve-3d;
          }

          :host {
            position: relative;
          }

          .content {
            display: none;
            --padding: 7%;
            max-height: calc(100% - var(--padding) - 1%);
            overflow-y: auto;
            padding: var(--padding);
            position: absolute;
            inset: 0;
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
              e.preventDefault(); // Avoid hash change
              return;
            }

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
