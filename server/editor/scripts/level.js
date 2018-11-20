/**
 * Level class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Represents a level. Constructs a level from the level area
 *
 */

'use strict';

class Level {

    // Constructs level using a level area jquery object
    constructor( name, projectiles, levelArea ) {
        this._name = name;
        this._id = levelArea.levelId;
        this._projectiles = parseInt( projectiles );
        this._cannon = this._readCannon( levelArea );
        this._birds = this._readBirds( levelArea );
        this._collidables = this._readCollidables( levelArea );
    }

    _readCannon( levelArea ) {
        // Get the cannon
        let cannon = levelArea.droppable$.children( '.cannon' )[0];

        // Store cannon's info
        let cannonInfo = {
            "sx": parseInt( $( '#' + cannon.id ).css( 'left' ) ),
            "sy": parseInt( $( '#' + cannon.id ).css( 'top' ) )
        };

        return cannonInfo;
    }

    _readBirds( levelArea ) {
        // Store info as array
        let birds = new Array();

        // Iterate through each bird
        levelArea.droppable$.children( '.bird' ).each( (index, element) => {
            // Store id
            let birdId = '#' + element.id;

            // Store info
            let birdInfo = {
                "sx": parseInt( $( birdId ).css( 'left' ) ),
                "sy": parseInt( $( birdId ).css( 'top' ) )
            };

            birds.push( birdInfo );
        });

        return birds;
    }

    _readCollidables( levelArea ) {
        // Store info as array
        let collidables = new Array();

        // Iterate through each collidable
        levelArea.droppable$.children( '.collidable' ).each( (index, element) => {
            // Store id
            let collidableId = '#' + element.id;

            // Store info
            let collidableInfo = {
                "sx": parseInt( $( collidableId ).css( 'left' ) ),
                "sy": parseInt( $( collidableId ).css( 'top' ) ),
                "height": $( collidableId ).data( 'height' ),
                "width": $( collidableId ).data( 'width' ),
                "texture": $( collidableId ).data( 'texture' ),
                "bounce": $( collidableId ).data( 'bounce' ),
                "mass": $( collidableId ).data( 'mass' ),
                "friction": $( collidableId ).data( 'friction' )
            };

            collidables.push( collidableInfo );
        });

        return collidables;
    }

    getData() {
        let data = {
            "name": this._name,
            "projectiles": this._projectiles,
            "cannon": this._cannon,
            "entities": {
                "birds": this._birds,
                "collidables": this._collidables
            }
        };

        if (this._id !== null) {
            data = { id: this._id, ...data };
        }

        return data;
    }

}
