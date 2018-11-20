/**
 * ObjectEditor Setup
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Allows functionality for editing a collidable
 *
 */

class ObjectEditor {

    // Receives the type of object to edit and level area to listen for changes
    constructor( editableClass, droppable$ ) {

        // Set event handlers on form and editable
        this._setEventHandlers( editableClass, droppable$ );

    }

    _setEventHandlers( editableClass, droppable$ ) {
        $( '#edit-object-form' ).on( 'submit', ( event ) => {
            this._updateObject( event );
        });

        // Listen for changes in level area, triggered in level area class
        droppable$.on( 'contentschanged' , () => {
            this._prepareEditablesForClick( editableClass );
        });
    }

    _updateObject( event ) {
        event.preventDefault();

        // Check for unexisting id
        if ( $( '#edit-object-form #in-object-id' ).val() === "") {
            return;
        }

        // Get the values for the object to update
        let objectId = $( '#edit-object-form #in-object-id' ).val();
        let objectWidth = $( '#edit-object-form #in-object-width' ).val();
        let objectHeight = $( '#edit-object-form #in-object-height' ).val();
        let objectTexture = $( '#edit-object-form #in-object-texture' ).val();
        let objectBounce = $( '#edit-object-form #in-object-bounce' ).val();
        let objectMass = $( '#edit-object-form #in-object-mass' ).val();
        let objectFriction = $( '#edit-object-form #in-object-friction' ).val();

        // Update the object
        Collidable.Update( objectId, objectWidth, objectHeight, objectTexture, objectBounce, objectMass, objectFriction );
    }

    _prepareEditablesForClick( editableClass ) {
        $( '.' + editableClass ).on( 'click', ( event ) => {
            this._outline( event, editableClass );
            this._populateForm( event );
        });
    }

    // Creates an outline around the object to edit
    _outline( event, editableClass ) {
        // Remove active class from all editables
        $( '.' + editableClass ).removeClass( 'editable-active' );

        // Set active class on the object to edit
        $( '#' + event.target.id ).addClass( 'editable-active' );
    }

    _populateForm( event ) {
        let objectId = event.target.id;

        // Populate the form with the editable object's info
        $( '#edit-object-form #in-object-id' ).val( objectId );
        $( '#edit-object-form #in-object-width' ).val( $( '#' + objectId ).data( 'width' ) );
        $( '#edit-object-form #in-object-height' ).val( $( '#' + objectId ).data( 'height' ) );

        // Hardcoding the selected option, making a lot of assumptions on the object's texture data
        $( '#edit-object-form #in-object-texture' ).val( $( '#' + objectId ).data( 'texture' ) );

        $( '#edit-object-form #in-object-bounce' ).val( $( '#' + objectId ).data( 'bounce' ) );
        $( '#edit-object-form #in-object-mass' ).val( $( '#' + objectId ).data( 'mass' ) );
        $( '#edit-object-form #in-object-friction' ).val( $( '#' + objectId ).data( 'friction' ) );
    }

}
