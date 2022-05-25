import { OrderIntent } from "../types";
import BaseElement from "./base";
import rupaLogo from "./rupa-logo";

const RUPA_PRIMARY_COLOR = "#0075cd";

class OrderButton extends BaseElement {
  protected orderIntent: OrderIntent;
  protected background: string;
  protected color: string;
  protected text: string;

  constructor({
    orderIntent,
    background = RUPA_PRIMARY_COLOR,
    color = "#fff",
    text = "Order with Rupa",
  }: {
    orderIntent: OrderIntent;
    background?: string;
    color?: string;
    text?: string;
  }) {
    super();

    this.orderIntent = orderIntent;
    this.background = background;
    this.color = color;
    this.text = text;
  }

  private attachFontLinksToHead() {
    const styleLinks = [
      document.createElement("link"),
      document.createElement("link"),
      document.createElement("link"),
    ];

    styleLinks[0].setAttribute("rel", "preconnect");
    styleLinks[0].setAttribute("href", "https://fonts.googleapis.com");

    styleLinks[1].setAttribute("rel", "preconnect");
    styleLinks[1].setAttribute("href", "https://fonts.gstatic.com");
    styleLinks[1].setAttribute("crossOrigin", "");

    styleLinks[2].setAttribute("rel", "stylesheet");
    styleLinks[2].setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600&display=swap"
    );

    for (const link of styleLinks) {
      document.head.appendChild(link);
    }
  }

  private getStyle() {
    const style = document.createElement("style");
    style.textContent = `
      .button {
        background: ${this.background};
        padding: 8px 16px;
        border-radius: 6px;
        color: ${this.color};
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        min-width: max-content;
        transition: box-shadow 0.16s;
      }

      .button:hover {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.07);
      }

      .button__text {
        margin-left: 8px;
        font-family: 'Josefin Sans', sans-serif;
        font-size: 14px;
        margin-top: 2px;
      }
    `;

    return style;
  }

  getChildren() {
    this.attachFontLinksToHead();

    const style = this.getStyle();

    const button = document.createElement("a");
    button.setAttribute("class", "button");
    button.setAttribute("href", this.orderIntent.redirect_url);

    const logoTemplate = document.createElement("template");
    logoTemplate.innerHTML = rupaLogo.trim();
    const logo = logoTemplate.content.firstChild;

    const textElement = document.createElement("span");
    textElement.textContent = this.text;
    textElement.setAttribute("class", "button__text");

    button.appendChild(logo);
    button.appendChild(textElement);

    return [style, button];
  }
}

export default OrderButton;
