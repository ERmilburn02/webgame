import Vec2 from "./Vec2";

/**
 * Collection of Utility functions
 */
export default class Utils {
    static getRelativeMousePosition(e: MouseEvent, element: HTMLElement): Vec2 {
        var _rect = element.getBoundingClientRect();
        return new Vec2(Math.round(e.clientX - _rect.left), Math.round(e.clientY - _rect.top));
    }
}