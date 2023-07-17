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

    getElement() {
      switch (this.dataset.suit) {
        case "♠":
          return "Strategy";
        case "♣":
          return "Coordination";
        case "♥":
          return "Incentive";
        case "♦":
          return "Consensus";
        default:
          return "";
      }
    }

    renderShadow() {
      const suit = this.dataset.suit || "";
      const rank = this.dataset.rank || "";
      const element = this.getElement();
      const title = this.dataset.title || "";
      const rankSuiteColor = ["♣", "♠"].includes(suit)
        ? "black"
        : "hsl(359, 84%, 53%)"; // Red

      this.shadowRoot.innerHTML = /*html*/ `
        <button onclick="document.exitFullscreen()" class="close-button"></button>
        <div class="card-wrapper">
          <button class="card" part="card">
            <div class="rank-suit">
              <div>
                <span class="rank">${rank}</span><br/><span class="suit">${suit}</span>
              </div>
              <div>
                <span class="rank">${rank}</span><br/><span class="suit">${suit}</span>
              </div>
            </div>
            <div class="summary">
              <span>${element}</span>
              <span>${title}</span>
            </div>
            <div class="content" part="content">
              <header>
                <h2>${title}</h2>
                <slot name="description"></slot>
              </header>
            </div>
            <slot>
            <!-- image expected into default slot -->
            </slot>
          </button>
        </div>

        <style>
          :host {
            --base-font-size: clamp(1rem, 9vw, 1.5rem);
            --card-color: ${rankSuiteColor};
            --border-radius: 20px;
            --close-button-color: white;
            --close-button-bottom: 4vw;
            --close-button-width: 40px;
            --close-button-line-height: 3px;
            position: relative;
          }
          :host(.show-info)  .summary :last-child {
            visibility: hidden;
          }

          :host(.show-info) .content {
            display: block;
          }
          :host(.show-info) .card::after {
            display: block;
            content: "";
            position: absolute;
            inset: 0rem;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: var(--card-border-radius);
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
            border-radius: var(--border-radius);
            border: none;
            padding: 0;
          }

          .card .summary {
            position: absolute;
            inset: 0;
            padding: calc(10% + 1ch) calc(14%) calc(14%) ;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: var(--card-color);
            font-size: clamp(1.3rem, 5vw, 1.5rem);
            transform: translateZ(45px);
            webkit-transform: translateZ(45px);
          }

          .card .summary :first-child {
            align-self: end;
          }

          .card .summary :last-child {
            align-self: start;
            max-width: 80%;
            text-align: start;
          }

          .rank-suit {
            position: absolute;
            inset: 0;
            padding: 14% 10%;
            font-size: clamp(2rem, 9vw, 3rem);
            font-family: "Hind";
            font-weight: 600;
            color: var(--card-color);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;
            line-height: .9;
            transform: translateZ(45px);
            webkit-transform: translateZ(45px);
          }


          .rank-suit .rank {
            margin-block: -1rem;
          }

          .rank-suit .suit {
            font-family: "Dejavu Sans";
            font-weight: 600;
            font-size: .8em;
          }

          .rank-suit > :last-child {
            transform: rotate(180deg);
            align-self: end;
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
            webkit-transform: translateZ(50px);
            transform-style: preserve-3d;
            webkit-transform-style: preserve-3d;
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
      const card = this.shadowRoot.querySelector(".card");

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
            if (e.composedPath().includes(card)) {
              this.classList.toggle("show-info");
            }
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
