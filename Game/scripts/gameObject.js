/*
 * GameObject Class
 *
 * A base class for all objects in the game world
 *
 * Copyright 2018 - Alfredo & Harish
 */

'use strict';

import { CollidableController } from "./collidablecontroller.js";
import { CollisionTypes } from "./Physics.js";
import { Point } from "./point.js";


export const GameObjectTypes = {
    Bird: 0,
    Collidable: 1,
    Pigs: 3,
}

'use strict';

import { physics } from "./Physics.js";
import { PhysicsComponent } from "./physicscomponent.js";

export class GameObject {

    constructor( worldController, data ) {
        // Physics
        this.physicsComponent = new PhysicsComponent( worldController.model, data );

        this.isVisible = true;

        this.worldController = worldController;

    }

    applyImpulse() {}

    applyForce() {}

}
