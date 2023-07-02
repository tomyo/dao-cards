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
        <div class="single-view-wrapper">
          <a href="#${this.id}">
            <div class="content">
              <slot name="title"></slot>
              <slot name="description"></slot>
            </div>
            <slot>
              <!-- image expected into default slot -->
            </slot>
          </a>
        </div>
        <style>
          :host {
            position: relative;
          }

          .content {
            --padding: 7%;
            max-height: calc(100% - var(--padding) - 1%);
            overflow-y: auto;
            padding: var(--padding);
          }

          ::slotted(img) {
            height: 100%;
            object-fit: cover;
          }

          :host .content {
            display: none;
            z-index: 1;
            position: relative;
          }

          .single-view-wrapper {
            display: contents;
            --direction: row;
          }


          @media (orientation: portrait) {
            .single-view-wrapper {
              --direction: column;
            }
          }

          @media (orientation: landscape) {
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

          :host(:fullscreen) .single-view-wrapper {
            display: flex;
            flex-direction: var(--direction);
            place-content: center;
            height: 100%;
          }


          :host(:fullscreen)::backdrop {
            background-color: transparent;
            backdrop-filter: brightness(.6) blur(6px);
          }
        </style>
      `;
    }

    addEventListeners() {
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
            this.requestFullscreen();
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
