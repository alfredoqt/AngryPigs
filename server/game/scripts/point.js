/*
 * Point Class
 *
 * Stores and translates between world co-ordinates and screen co-ordiantes
 *
 * Copyright 2018 - Alfredo & Harish
 */

'use strict';

import { physics } from "./Physics.js";

export const DIMENSIONS = {
    WIDTH: 1280,
    HEIGHT: 720
}

export class Point {

    // Stored as screen coordinates
    constructor( pointData = { x: 0, y: 0 } ) {
        this.data = pointData;
    }

    // World
    get x() 
    {
        return this.data.x / physics.WORLD_SCALE;
    }

    get y() 
    { 
        return this.data.y / physics.WORLD_SCALE;
    }

    set x( value ) {
        this.data.x = value;
    }

    set y( value ) {
        this.data.y = value;
    }

    // Screen
    get left() 
    { 
        return this.data.x; 
    }

    get top()  
    {
        return this.data.y; 
    }

}
