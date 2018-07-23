/**
 * Editor class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Puts together the main components in the level editor
 *
 */

'use strict';

// Defines constraints on editor dimensions
const EDITOR = {
    "WIDTH": 1280,
    "HEIGHT": 720,
    "DATA_TRANSFER_KEY": "level-object"
};

class Editor {

    constructor() {
        // Get level list
        this._fetchLevelList();

        // Set the events for loading and saving a level
        // this._setEventsOnSaveLoad();

        // Create the droppable level area
        this.levelArea = new LevelArea( $( '#level-area' ), 'level-area-item', EDITOR.DATA_TRANSFER_KEY );

        // Create the object editor
        let objectEditor = new ObjectEditor( 'editable', $( '#level-area' ) );

        // Setup the object area
        let objectArea = new ObjectArea( 'object-area-item' );

        this._setupSave();

        this._setupLoad();


    }

    _setupSave() {
        $( '#save-level-form' ).on( 'submit', ( event ) => { 
            this._saveLevel( event );                    
        });
    }

    _setupLoad() {
        $( '#load-level-form' ).on( 'submit', ( event ) => {
            this._loadLevel( event );
        });
    }

    _saveLevel( event ) {
        event.preventDefault();

        // Get values
        let name = $( '#in-level-name' ).val();
        let projectiles = $( '#in-level-ammo' ).val();

        // Construct the level
        let level = new Level( name, projectiles, $( '#level-area' ) );

        // Serialize the level and action
        let request = [
            { name: "action", value: "save_level"},
            { name: "level", value: JSON.stringify( level.getData() ) },
            { name: "file", value: $( '#in-level-name' ).val() }
        ];

        // Get the parameters ready
        let params = $.param( request );

        // Save level
        $.post( "../server/server.php", params )
        .then( ( data ) => {
            // Get the level list again to populate the load form
            this._fetchLevelList();
        });
    }

    _loadLevel( event ) {
        event.preventDefault();

        // Get the parameters
        let request = $( event.target ).serializeArray();
        request.push( { name: "action", value: "load_level" } );
        let params = $.param( request );

        // Request data from server
        $.post( '../server/server.php', params )
        .then( (data) => {
            let levelData = JSON.parse( data );
            // Rebuild the level area
            this.levelArea.rebuild( $( '#level-area' ), 'level-area-item', levelData );

            // Set some values on the save level form
            $( '#in-level-name' ).val( levelData.level.name );
            $( '#in-level-ammo' ).val( levelData.level.projectiles );
        });
    }

    _fetchLevelList() {
        let request = { action: "get_level_list" };
        let params = $.param(request);

        let fetchedLevels = [];

        // Post request to server
        $.post( "../server/server.php", params )
            .then( ( data ) => this._setLevelsToLoad( JSON.parse( data ))
        );
    }

    _setLevelsToLoad( levelList ) {
        // Reset the select
        $( '#level-select' ).empty();

        // Append level list
        for (let i = 0; i < levelList.length; ++i) {
            $( '#level-select' ).append( `<option value="${levelList[i]}">${levelList[i]}</option>` );
        }
    }

}
