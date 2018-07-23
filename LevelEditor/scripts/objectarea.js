/**
 * ObjectArea class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Allows functionality for dragging new entities
 *
 */


class ObjectArea {

    // Sets events on the objects to be added
    constructor( objectClass ) {
        this._setEventsOnDraggables( objectClass );
    }

    _setEventsOnDraggables( objectClass ) {

        // Set drag functionality for items from object list
        $( '.' + objectClass ).on( 'dragstart', ( event ) => {
            // Store the type of the object area item
            let type = '';

            // Check for specific types
            if ( $( event.target ).hasClass( 'bird' ) ) {
                type = "Bird";
            } else if ( $( event.target ).hasClass( 'collidable' ) ) {
                type = "Collidable";
            }

            let levelObjectData = {
                targetType: type
            };

            let dataFortransfer = JSON.stringify( levelObjectData );
            event.originalEvent.dataTransfer.setData( EDITOR.DATA_TRANSFER_KEY, dataFortransfer );
            event.originalEvent.dataTransfer.effectAllowed = "move";
        });
    }

}
