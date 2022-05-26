abstract class BaseElement {
  protected abstract getChildren(): HTMLElement[];

  /*
   * Mounts the element's children to a shadow node under the element
   * pointed to by the `selector` argument.
   */
  mount(selector: string | Element) {
    const element =
      selector instanceof Element ? selector : document.querySelector(selector);

    const shadow = element.attachShadow({ mode: "open" });

    const children = this.getChildren();

    for (const child of children) {
      shadow.appendChild(child);
    }
  }
}

export default BaseElement;
