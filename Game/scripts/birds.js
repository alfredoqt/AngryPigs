/*
 * Bird Class
 *
 * Stores and Manages the position and state of the Birds in the game world and also renders them
 *
 * Copyright 2018 - Alfredo & Harish
 */

import { CollisionTypes } from "./Physics.js";
import { physics } from "./Physics.js";

import { GameObject } from "./gameObject.js";
import { LifeSpan } from "./lifespan.js";

export const DefaultBirdDetails = {
    height: 100,
    width: 100,
    radius: 48,
    mass: 5,
    bounce: 0.1,
    friction: 1.0,
    collisionType: CollisionTypes.Circle,
    texture: ""
};

export class Bird extends GameObject
{
    constructor( worldController, data ) {
        super( worldController, data );
        // View on the map
        this.view$ = $( '<div class="game-area-item bird"></div>' );

        // Set user data
        this.type = "Bird";
        this.physicsComponent.fixture.GetBody().SetUserData( this );

        // Not hit yet
        this.hit = false;
    }

    update()
    {
        // Check if it should be destroyed, YEAHHHH 11:09pm
        if ( this.hit ) {
            // Destroy after 1 second
            let lifeSpan = new LifeSpan( this.worldController, this, 0.05);
            
            // Decrease bird count
            this.worldController.birdCount--;

            // This prevents it to run on the next frame
            this.hit = false;
        }
    }
    render()
    {
        let angle = this.physicsComponent.fixture.GetBody().GetAngle() * physics.RAD_2_DEG;
        this.view$.css( { "top": this.physicsComponent.fixture.GetBody().GetPosition().y * physics.WORLD_SCALE - DefaultBirdDetails.height / 2, 
                        "left": this.physicsComponent.fixture.GetBody().GetPosition().x * physics.WORLD_SCALE - DefaultBirdDetails.width / 2,
                        "transform": `rotate(${angle}deg)`} );
    }
}
