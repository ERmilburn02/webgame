// Vec2
// {x: 0, y: 0}

/**
 * Vector2
 */
export default class Vec2 {
    x: number;
    y: number;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    };

    /**
     * Vector2 with zero values
     * @returns {Vec2} {x: 0, y: 0}
     */
    static zero(): Vec2 {
        return new Vec2(0, 0);
    };

    /**
     * @returns the Vector2 as a string
     */
    toString(): string {
        return `x: ${this.x}, y: ${this.y}`;
    };

    /**
     * 
     * @param vec {Vec2} The Vector2 to add
     * @returns the sum of this and vec
     */
    add(vec: Vec2): Vec2 {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };

    /**
     * 
     * @param vec1 {Vec2}
     * @param vec2 {Vec2}
     * @returns {Vec2} The Vector2 that is the result of the addition of vec1 and vec2
     */
    static add(vec1: Vec2, vec2: Vec2): Vec2 {
        return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);
    };
};