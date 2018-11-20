'use strict';

import { physics } from "./Physics.js";

export class CollidableController {

    constructor( theWorld, worldX, worldY, isStatic = false ) {
        let bodyDefn = new physics.BodyDef;
        bodyDefn.type = new physics.Body.b2_dyanmicBody;

        // The body cannot move
        if ( isStatic ) {
            bodyDefn.type = new physics.Body.b2_staticBody;
        }
        
        bodyDefn.position.x = worldX;
        bodyDefn.position.y = worldY;

        // Defines shape, width, height
        let fixDefn = new physics.FixtureDef;
        fixDefn.shape = new physics.PolygonShape;
        fixDefn.shape.SetAsBox( box.w, box.h );

        fixDefn.density = 5; // mass / volume
        fixDefn.friction = 0.65; // 1 = sticky, 0 = slippery
        fixDefn.restitution = 0.4; // 1 = very bouncy, 0 = almost no bounce
        
        // Add it to the world model
        this.model = theWorld.model.CreateBody( bodyDefn );
        this.model.CreateFixture( fixDefn );

        // View on the map
        this.view = $( '<div></div>' );
    }

    applyImpulse() {}

    applyForce() {}

    update() {}

    render() {}

}