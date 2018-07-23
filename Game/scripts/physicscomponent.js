/*
 * Physics Component Class
 *
 * Stores all the physics information about a game object in the game world
 *
 * Copyright 2018 - Alfredo & Harish
 */

'use strict';

import { physics } from "./Physics.js";
import { CollisionTypes } from "./Physics.js";

// A component for the game objects
export class PhysicsComponent {

    constructor( world, data ) {
        this.bodyDefn = new physics.BodyDef;
        this.bodyDefn.type = physics.Body.b2_dynamicBody;

        if (data.isStatic) {
            this.bodyDefn.type = physics.Body.b2_staticBody;
        }

        this.bodyDefn.position.x = data.point.x;
        this.bodyDefn.position.y = data.point.y;

        // Fixes offset
        this.bodyDefn.position.x += (data.width / 2.0) / physics.WORLD_SCALE;
        this.bodyDefn.position.y += (data.height / 2.0) / physics.WORLD_SCALE;
        
        let fixDefn = this._SetShape( data );

        fixDefn.density = data.mass; // mass / volume
        fixDefn.friction = data.friction; // 1 = sticky, 0 = slippery
        fixDefn.restitution = data.bounce; // 1 = very bouncy, 0 = almost no bounce

        // Get a reference to the fixture
        this.fixture = world.CreateBody( this.bodyDefn ).CreateFixture( fixDefn );
    }


    // Returns a b2FixtureDef with the specified shape
    _SetShape( data ) {
        let fixDefn = new physics.FixtureDef;

        // Check the shape
        if ( data.shape === CollisionTypes.Box ) {
            fixDefn.shape = new physics.PolygonShape;
            fixDefn.shape.SetAsBox( data.width / 2.0 / physics.WORLD_SCALE, data.height / 2.0 / physics.WORLD_SCALE);
        } else if ( data.shape === CollisionTypes.Circle ) {
            fixDefn.shape = new physics.CircleShape( data.radius / physics.WORLD_SCALE );
        }

        return fixDefn;
    }

}
