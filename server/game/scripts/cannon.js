/*
 * Cannon Class
 *
 * Manages the input of the player and updates the cannon accordingly.
 * Fires Projectile
 *
 * Copyright 2018 - Alfredo & Harish
 */

'use strict';

import { CollisionTypes } from "./Physics.js";
import { physics } from "./Physics.js";

import { GameObject } from "./gameObject.js";
import { Point } from "./point.js";
import { Projectile } from "./projectile.js";

const changeInAngle = 0.1;

export const DefaultCannonSettings = {
    height: 124,
    width: 160,
    collisionType: CollisionTypes.Box,
    mass: 100,
    bounce: 0,
    friction: 1,
    collisionType: CollisionTypes.Box,
    texture: ""
}

export class Cannon
{
    constructor(worldController, data, projectilesAvailable ) 
    {
        // Information about the world
        this.worldController = worldController;
        this.worldView = worldController.view$;

        // Information about the cannon
        this.position = data.point;
        this.angle = 0;
        this.dimensions = {
            height: data.height,
            width: data.width,
            centroid: null
        };

        this.dimensions.centroid = { x: (this.position.left + this.dimensions.width / 2), y: (this.position.top + this.dimensions.height / 2) };

        this.projectilesLeft = projectilesAvailable;

        // View on the map
        this.view$ = $( `<div class="game-area-item cannon"></div>` );
        this.view$.css( { "top": this.position.top, "left": this.position.left } );
        
        // Tracking mouse movement
        this.mouse = {
            x: 0,
            y: 0
        };

        // Keep the angle of launch
        this.angle = 0.0

        this.setUpMouseTracking();
        this.setUpMissileSpawn();
    }

    setUpMouseTracking()
    {
        this.worldView.mousemove(event => {
            let offset = this.worldView.offset(); 
            this.mouse.x = event.pageX - offset.left;
            this.mouse.y = event.pageY - offset.top;
            this.updateCannonRotation();
        });
    }

    updateCannonRotation()
    {
        let x = this.mouse.x - this.dimensions.centroid.x;
        let y = this.mouse.y - this.dimensions.centroid.y;

        this.angle = Math.atan2(y, x) * physics.RAD_2_DEG;

        if ( this.angle > -71 && this.angle < 11 )
        {
            this.view$.css({"transform": `rotate(${this.angle}deg)`});
        }
    }

    setUpMissileSpawn() {
        this.worldView.on( 'click', ( event ) => {
            this.firePig();
        })
    }

    firePig()
    {
        if ( this.projectilesLeft > 0 ) {
            let projectileData = {
                isStatic: false,
                point: new Point( { x: this.dimensions.centroid.x - 50, y: this.dimensions.centroid.y - 50 } ),
                height: 100,
                width: 100,
                radius: 50,
                mass: 10,
                bounce: 0.1,
                friction: 1.0,
                texture: "",
                shape: CollisionTypes.Circle
            };
            // Impulse applied to projectile, that 5000 is the impulse strength
            let impulse = new physics.Vec2( Math.cos( this.angle * physics.DEG_2_RAD) * 5000, Math.sin( this.angle * physics.DEG_2_RAD) * 5000 );

            let projectile = new Projectile( this.worldController, projectileData, impulse);
            this.worldController.gameObjects.push( projectile );
            this.worldController.view$.append( projectile.view$ );

            this.projectilesLeft--;

            // Decrease projectiles on world controller
            this.worldController.projectileCount--;
        }
    }
}