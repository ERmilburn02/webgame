import Vec2 from "./Vec2";

/**
 * Collection of Utility functions
 */
export default class Utils {
  /**
   * Get the relative mouse position from the given element
   * @param e {MouseEvent} Mouse event to check
   * @param element {HTMLElement} Element to check
   * @returns {Vec2} The position of the mouse relative to the element
   */
  static getRelativeMousePosition(e: MouseEvent, element: HTMLElement): Vec2 {
    var _rect = element.getBoundingClientRect();
    return new Vec2(
      Math.round(e.clientX - _rect.left),
      Math.round(e.clientY - _rect.top)
    );
  }

  /**
   * Load an image from a given url and return a promise that will be resolved with the image
   * @param url {string} The url to load
   * @returns {Promise<HTMLImageElement>} The loaded image
   */
  static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.src = url;
    });
  }

  static getUrlArgs(): { [key: string]: string } {
    const args: { [key: string]: string } = {};
    const query = window.location.search.substring(1);
    const pairs = query.split("&");
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split("=");
      args[pair[0]] = decodeURIComponent(pair[1]);
    }
    return args;
  }
}
