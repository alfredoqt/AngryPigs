/**
 * Collidable class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Creation and serialization of collidables
 *
 */

const COLLIDABLE_DEFAULTS = {
    WIDTH: 120,
    HEIGHT: 120,
    BOUNCE: 0,
    MASS: 7,
    FRICTION: 1,
    TEXTURE: "images/crate-one.jpg"
};

class Collidable {

    // Creates a collidable in a droppable area and returns id
    static Create( droppable$, id, itemsClass, collidable = undefined ) {
        let collidableId = `level-collidable-${id}`;

        // Check if data about collidable was sent
        if (collidable === undefined) {
            Collidable._addDefault( droppable$, collidableId, itemsClass );
        } else {
            Collidable._addCustom( droppable$, collidableId, itemsClass, collidable );
        }

        return collidableId;
    }

    // Adds a collidable with default settings
    static _addDefault( droppable$, collidableId, itemsClass ) {
        // Add it to the droppable
        droppable$.append(`<div id="${collidableId}" class="${itemsClass} collidable editable" draggable="true" 
        data-width="${COLLIDABLE_DEFAULTS.WIDTH}" data-height="${COLLIDABLE_DEFAULTS.HEIGHT}"
        data-bounce="${COLLIDABLE_DEFAULTS.BOUNCE}" data-mass="${COLLIDABLE_DEFAULTS.MASS}"
        data-friction="${COLLIDABLE_DEFAULTS.FRICTION}" data-texture="${COLLIDABLE_DEFAULTS.TEXTURE}"></div>`);
    }

    static _addCustom( droppable$, collidableId, itemsClass, collidable ) {
        // Add it to the droppable
        droppable$.append(`<div id="${collidableId}" class="${itemsClass} collidable editable" draggable="true" 
        data-width="${collidable.width}" data-height="${collidable.height}"
        data-bounce="${collidable.bounce}" data-mass="${collidable.mass}"
        data-friction="${collidable.friction}" data-texture="${collidable.texture}"
        style="top: ${collidable.sy}px; left: ${collidable.sx}px; width: ${collidable.width}px;
        height: ${collidable.height}px; background-image: url(${collidable.texture});"></div>`);
    }

    // Updates a collidable
    static Update( objectId, objectWidth, objectHeight, objectTexture, objectBounce, objectMass, objectFriction ) {
        // Check if the object exists
        if ( $( '#' + objectId) === undefined ) {
            return;
        }

        // Update its data attributes
        $( '#' + objectId ).data( 'width', parseInt( objectWidth ) );
        $( '#' + objectId ).data( 'height', parseInt( objectHeight ) );
        $( '#' + objectId ).data( 'texture', objectTexture );
        $( '#' + objectId ).data( 'bounce', parseFloat( objectBounce ) );
        $( '#' + objectId ).data( 'mass', parseFloat( objectMass ) );
        console.log(objectMass);
        $( '#' + objectId ).data( 'friction', parseFloat( objectFriction ) );

        // Set some visual stuff
        $( '#' + objectId ).css( { 'width': objectWidth + 'px', 'height': objectHeight + 'px', 'background-image': `url("${objectTexture}")` } );
    }

}
