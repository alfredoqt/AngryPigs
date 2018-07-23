/*
 * LifeSpan Class
 *
 * Destroys an object after a certain amount of time
 *
 * Copyright 2018 - Alfredo & Harish
 */
'use strict';

// Sets a life span on a game object
export class LifeSpan {

    // Receives life span as seconds
    constructor( worldController, gameObject, lifeSpan ) {
        this.worldController = worldController;
        this.gameObject = gameObject;
        this.lifeSpan = lifeSpan;

        // Destroy after some time
        this.destroy();
    }

    destroy() {
        setTimeout( () => {
            // Remove from view
            this.gameObject.view$.remove();

            // Remove from object list
            let indexToRemove = this.worldController.gameObjects.indexOf( this.gameObject );

            if (indexToRemove > -1) {
                this.worldController.gameObjects.splice(indexToRemove, 1);

                // Remove it from the world
                this.worldController.model.DestroyBody( this.gameObject.physicsComponent.fixture.GetBody() );
            }

        }, this.lifeSpan * 1000);
    }

}
