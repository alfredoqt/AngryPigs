/*
 * Projectile Class
 *
 * Lauunches Projectiles with a force in a specific direction
 *
 * Copyright 2018 - Alfredo & Harish
 */

'use strict';

import { CollisionTypes } from "./Physics.js";
import { physics } from "./Physics.js";

import { GameObject } from "./gameObject.js";
import { LifeSpan } from "./lifespan.js";

export const DefaultCollidableDetails = {
    collisionType: CollisionTypes.Box,
};

export class Projectile extends GameObject
{
    // Receives an impulse
    constructor( worldController, data, impulse ) {
        super( worldController, data );

        // View on the map
        this.view$ = $( `<div class="game-area-item projectile"></div>` );

        // I'm going to use this later
        this.width = data.width;
        this.height = data.height;

        // Apply the impulse
        this.physicsComponent.fixture.GetBody().ApplyImpulse( impulse , new physics.Vec2( 0, 0 ) );

        // Set user data
        this.type = "Projectile";
        this.physicsComponent.fixture.GetBody().SetUserData( this );

        // Remove it after 5 seconds
        this.lifeSpanComponent = new LifeSpan( this.worldController, this, 5.0 );

    }

    update()
    {
        
    }
    render()
    {
        let angle = this.physicsComponent.fixture.GetBody().GetAngle() * physics.RAD_2_DEG;
        this.view$.css( { "top": this.physicsComponent.fixture.GetBody().GetPosition().y * physics.WORLD_SCALE - this.height / 2, 
                        "left": this.physicsComponent.fixture.GetBody().GetPosition().x * physics.WORLD_SCALE - this.width / 2,
                        "transform": `rotate(${angle}deg)`} );
    }
}
