/*
 * World Controller Class
 *
 * Builds and Stores Details about the world when called by the game object
 *
 * Copyright 2018 - Alfredo & Harish
 */
'use strict';

import { physics } from "./Physics.js";

import { GameObject } from "./gameObject.js";

import { DefaultBirdDetails } from "./birds.js";
import { Bird } from "./birds.js";

import { DefaultCollidableDetails } from "./collidable.js";
import { Collidable } from "./collidable.js";

import { DefaultCannonSettings } from "./cannon.js";
import { Cannon } from "./cannon.js";

import { Point, DIMENSIONS } from "./point.js";
import { PhysicsComponent } from "./physicscomponent.js";
import { ContactListener } from "./contactmanager.js";

export class WorldController 
{

    constructor( theView$ ) 
    {
        this.model = new physics.World( new physics.Vec2(0, physics.GRAVITY), true );
        this.view$ = theView$;
        this.levelLoaded = false;
        
        /* Used for debugging
        let debugDraw = new physics.DebugDraw();
        debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
        debugDraw.SetDrawScale(physics.WORLD_SCALE);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(physics.DebugDraw.e_shapeBit | physics.DebugDraw.e_jointBit);
        this.model.SetDebugDraw(debugDraw); */

        this.gameObjects = [];
        this.cannon = null;

        // Set initial bird and projectile count
        this.birdCount = 0;
        this.projectileCount = 0;

        // Contact manager
        let contactManager = new ContactListener( this.model );
    }

    update() 
    {
        // physics, world update delta t, velocity iterations, position iterations
        this.model.Step( 1 / 60, 10, 10 );


        /* this.model.DrawDebugData(); // Used for debugging */

        // Loop through game objects
        this.gameObjects.forEach( ( element ) => {
            element.update();
        });

        // Clear forces after each step
        this.model.ClearForces();
        
    }

    render() 
    {
        this.gameObjects.forEach( ( element ) => {
            element.render();
        });
    }
    
    addBoundaries() 
    {
        // Data
        let wallData = {
            isStatic: true,
            point: new Point( { x: 0, y: 0 } ),
            height: DIMENSIONS.HEIGHT,
            width: 1,
            mass: 1.0,
            friction: 1.0,
            bounce: 0.0,
            shape: DefaultCollidableDetails.collisionType
        };

        // Add physics components
        let left = new PhysicsComponent(this.model, wallData);

        wallData.width = DIMENSIONS.WIDTH;
        wallData.height = 1;

        // Add physics components
        let top = new PhysicsComponent(this.model, wallData);

        wallData.point.x = DIMENSIONS.WIDTH;
        wallData.width = 1;
        wallData.height = DIMENSIONS.HEIGHT;

        // Add physics components
        let right = new PhysicsComponent(this.model, wallData);

        wallData.point.x = 0;
        wallData.point.y = DIMENSIONS.HEIGHT;
        wallData.width = DIMENSIONS.WIDTH;
        wallData.height = 1;

        // Add physics components
        let bottom = new PhysicsComponent(this.model, wallData);
    }

    fetchLevelData( levelToLoad )
    {
        this.levelLoaded = false;
        let request = [];
        request.push( { name: "action", value: "load_level" } );
        request.push( { name: "level-to-load", value: levelToLoad } );
    
        let params = $.param( request );

        $.post( "../server/server.php", params )
        .then( ( data ) => {
            // Create the game objects once again
            this.createGameObjects( JSON.parse( data ).level );
            this.levelLoaded = true;
        });
    }

    emptyWorld() {
        // Turning of event handlers and clearing the game-screen div
        this.view$.off();
        this.view$.html("");

        // Empty game object list
        this.gameObjects.length = 0;

        // Set cannon to nothing
        this.cannon = null;

        // Set count back to 0
        this.birdCount = 0;
        this.projectileCount = 0;

        // Pointer to first body
        let bodyToDelete = this.model.GetBodyList();
        // Loop until exhausting list
        while( bodyToDelete !== null ) {
            // Keep a reference to current
            let current = bodyToDelete;
            // Move to the next
            bodyToDelete = bodyToDelete.GetNext();
            // Delete it
            this.model.DestroyBody( current );
        }
    }

    createGameObjects( level )
    {
        // Empty everything first
        this.emptyWorld();

        // Add walls
        this.addBoundaries();

        // Set projectile count
        this.projectileCount = level.projectiles;

        // Building Cannon GameObject
        this.cannon = new Cannon(this, this.buildCannon(level.cannon), level.projectiles );
        this.view$.append( this.cannon.view$ );

        // Extracting birds and collidables from the level data
        let birds = level.entities.birds;
        let collidables = level.entities.collidables;

        // Building Bird GameObjects
        birds.forEach( ( bird ) => {
            let gameObject = new Bird( this, this.buildBird( bird ) );
            
            this.view$.append( gameObject.view$ );
            this.gameObjects.push( gameObject );

            // Increase bird count
            this.birdCount++;
        });
                
        // Building Collidable GameObjects 
        collidables.forEach( ( collidable ) => {
            let gameObject = new Collidable( this, this.buildCollidable( collidable ) );

            this.view$.append( gameObject.view$ );
            this.gameObjects.push( gameObject );
        });
        
    }

    buildBird( data )
    {
        let bird = {
            isStatic: false,
            point: new Point( { x: data.sx, y: data.sy } ),
            height: DefaultBirdDetails.height,
            width: DefaultBirdDetails.width,
            radius: DefaultBirdDetails.radius,
            mass: DefaultBirdDetails.mass,
            bounce: DefaultBirdDetails.bounce,
            friction: DefaultBirdDetails.friction,
            texture: DefaultBirdDetails.texture,
            shape: DefaultBirdDetails.collisionType
        };

        return bird;
    }

    buildCollidable( data )
    {
        let collidable = {
            isStatic: false,
            point: new Point( { x: data.sx, y: data.sy } ),
            height: data.height,
            width: data.width,
            mass: data.mass,
            bounce: data.bounce,
            friction: data.friction,
            texture: data.texture,
            shape: DefaultCollidableDetails.collisionType
        };
        
        return collidable;
    }

    buildCannon( position )
    {
        let cannon = {
            point: new Point( { x: position.sx, y: position.sy } ),
            height: DefaultCannonSettings.height,
            width: DefaultCannonSettings.width,
        };

        return cannon;
    }
}

