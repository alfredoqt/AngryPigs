/**
 * LevelArea class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Allows functionality for the manipulating the level area
 *
 */

 const ENTITIES = {
     BIRD: "Bird",
     COLLIDABLE: "Collidable",
     CANNON: {
         DEFAULT_X: 10,
         DEFAULT_Y: 590
     }
 };

class LevelArea {

    // Creates a droppable, receives items class and data to transfer key
    constructor( droppable$, itemsClass, tranferredDataKey ) {
        // Let it be droppable
        this._setEvents( droppable$, itemsClass, tranferredDataKey );

        // Add objects to level
        this._addObjects( droppable$, itemsClass );

        // Contents' been changed after adding new objects
        droppable$.trigger( 'contentschanged' );
    }

    // Rebuilds the level
    rebuild( droppable$, itemsClass, levelData ) {
        // Reset the droppable
        droppable$.empty();

        //Add the objects
        this._addObjects( droppable$, itemsClass, levelData );

        // Content's been changed
        droppable$.trigger( 'contentschanged' );
    }

    _addObjects( droppable$, itemsClass, levelData = undefined ) {
        // Prepare ids for birds and collidables
        this._nextBirdId = 0;
        this._nextCollidableId = 0;

        // Only add the cannon at default location
        if ( levelData === undefined ) {
            this._createCannon( droppable$, itemsClass, ENTITIES.CANNON.DEFAULT_X, ENTITIES.CANNON.DEFAULT_Y );
        }
        // Add the cannon and everything else
        else {
            // Get cannon from data
            let cannon = levelData.level.cannon;
            this._createCannon( droppable$, itemsClass, cannon.sx, cannon.sy );

            // Get the birds
            let birds = levelData.level.entities.birds;
            this._createBirds( droppable$, itemsClass, birds );

            // Get the collidables
            let collidables = levelData.level.entities.collidables;
            this._createCollidables( droppable$, itemsClass, collidables );
        }
    }

    // Adds a cannon to the level
    _createCannon( droppable$, itemsClass, posX, posY ) {
        droppable$.append(`<div id="level-cannon" class="${itemsClass} cannon" 
        style="top: ${posY}px; left: ${posX}px;" draggable="true"></div>`);
    }

    // Adds birds to the level
    _createBirds( droppable$, itemsClass, birds ) {
        // Iterate through the birds
        for (let i = 0; i < birds.length; ++i) {
            // Create a bird
            Bird.Create( droppable$, this._nextBirdId, itemsClass, birds[i] );
            ++this._nextBirdId;
        }
    }

    // Adds birds to the level
    _createCollidables( droppable$, itemsClass, collidables ) {
        // Iterate through the collidables
        for (let i = 0; i < collidables.length; ++i) {
            // Create a bird
            Collidable.Create( droppable$, this._nextCollidableId, itemsClass, collidables[i] );
            ++this._nextCollidableId;
        }
    }

    _setEvents( droppable$, itemsClass, tranferredDataKey ) {
        // Add a listener to whenever content inside is changed
        droppable$.on( 'contentschanged' , () => {
            this._prepareItemsForDrag( itemsClass );
        });

        droppable$.on( 'drop', ( event ) => {
            event.preventDefault();

            // Get the transferred data
            let transferredDataString = event.originalEvent.dataTransfer.getData( tranferredDataKey );
            let transferredData = JSON.parse( transferredDataString );
            let draggableId = transferredData.targetId;

            // Check if the item passed existed
            if ( draggableId ) {
                this._move( event, draggableId );
            } else {
                // Create a new object
                let newObjectId = this._createNewObject( droppable$, itemsClass, transferredData );

                // Move it
                this._move( event, newObjectId );
            }

            // Content has been changed
            droppable$.trigger( 'contentschanged' );
        });

        droppable$.on('dragover', (event) => {
            event.preventDefault();
        });
    }

    _prepareItemsForDrag( itemsClass ) {
        // Set drag functionality for items inside the level area
        $( '.' + itemsClass ).on( 'dragstart', ( event ) => {
            let levelObjectData = {
                targetId: event.target.id
            };
            let dataFortransfer = JSON.stringify( levelObjectData );
            event.originalEvent.dataTransfer.setData( EDITOR.DATA_TRANSFER_KEY, dataFortransfer );
            event.originalEvent.dataTransfer.effectAllowed = "move";
        });
    }

    _move( event, draggableId ) {
        // Stores the dropArea offset from top left corner
        let dropAreaOffset = $(event.target).offset();

        // Get the mouse position relative to the drop area
        let dropAreaMouseX = event.clientX - Math.floor( dropAreaOffset.left );
        let dropAreaMouseY = event.clientY - Math.floor( dropAreaOffset.top );

        // Move the existing object
        $( '#' + draggableId).css( { "top": dropAreaMouseY + "px", "left": dropAreaMouseX + "px" } );
    }

    // Creates a new object and returns the id of the object created
    _createNewObject( droppable$, itemsClass, transferredData ) {
        let newObjectId = '';
        // Check for a bird
        if ( transferredData.targetType === ENTITIES.BIRD ) {
            newObjectId = Bird.Create( droppable$, this._nextBirdId, itemsClass );
            ++this._nextBirdId;
        }
        // Check for a collidable
        else if ( transferredData.targetType === ENTITIES.COLLIDABLE) {
            newObjectId = Collidable.Create( droppable$, this._nextCollidableId, itemsClass );
            ++this._nextCollidableId;
        }
        return newObjectId;
    }

}
