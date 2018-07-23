/*
 * Collidable Class
 *
 * Stores and Manages the position and state of the Collidables in the game world and also renders them
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

export class Collidable extends GameObject
{
    constructor( worldController, data ) {
        super( worldController, data );

        // View on the map
        this.view$ = $( `<div class="game-area-item collidable" 
                        style="background-image: url(${data.texture});
                        width: ${data.width}px; height: ${data.height}px;"></div>` );

        // Setting the cracked textures
        let newTexture = data.texture;
        newTexture = newTexture.replace(".jpg","");
        newTexture += "-cracked.png";
        this.crackedTexture = newTexture;

        // I'm going to use this later
        this.width = data.width;
        this.height = data.height;

        // Set user data
        this.type = "Collidable";
        this.physicsComponent.fixture.GetBody().SetUserData( this );

        // Not hit yet
        this.hit = false;
        this.health = 100;

    }

    update()
    {
        // Check if it should be destroyed, YEAHHHH 11:09pm
        if ( this.health > 50 ) {

        } else if ( this.health <= 50 && this.health > 0 )
        {
            this.view$.css({"background-image": `url("${this.crackedTexture}")`});
        } else if ( !this.hit ) {
            // Destroy after 1 second
            let lifeSpan = new LifeSpan( this.worldController, this, 0.05);
            this.hit = true;
        }
    }
    render()
    {
        let angle = this.physicsComponent.fixture.GetBody().GetAngle() * physics.RAD_2_DEG;
        this.view$.css( { "top": this.physicsComponent.fixture.GetBody().GetPosition().y * physics.WORLD_SCALE - this.height / 2, 
                        "left": this.physicsComponent.fixture.GetBody().GetPosition().x * physics.WORLD_SCALE - this.width / 2,
                        "transform": `rotate(${angle}deg)`} );
    }
}
