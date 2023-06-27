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
        <div class="content">
          <slot name="title"></slot>
          <slot name="description"></slot>
        </div>
        <slot>
          <!-- image expected into default slot -->
        </slot>

        <style>
          :host {
            position: relative;
          }

          .content {
            max-height: 100%;
            overflow-y: auto;
            padding: 6%;
          }

          ::slotted(img) {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }

          :host .content {
            display: none;
            z-index: 1;
            position: relative;
          }

          :host(:target) .content, :host(:hover) .content, :host(:focus) .content {
            display: block;
            margin-inline: 1em;
          }
          

          :host(:target) ::slotted(img), :host(:hover) ::slotted(img), :host(:focus) ::slotted(img)  {
            position: absolute;
            inset: 0;
            /*z-index: -1;*/
            filter: blur(1px) brightness(.4);
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
