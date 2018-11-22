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
        this._init();
    }

    async _init() {
        const levels = await this._fetchLevelList();
        this._setLevelsToLoad(levels);
        this.levelArea = new LevelArea( $( '#level-area' ), 'level-area-item', EDITOR.DATA_TRANSFER_KEY );

        // Create the object editor
        let objectEditor = new ObjectEditor( 'editable', this.levelArea.droppable$ );

        // Setup the object area
        let objectArea = new ObjectArea( 'object-area-item' );

        this._setupSave();

        this._setupLoad();

        this._setupButtons();
    }

    _setupButtons() {
        $( '#play-button' ).on( 'click', ( event ) => { 
            window.open('/', '_self');                   
        });
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

    async _saveLevel( event ) {
        event.preventDefault();

        // Get values
        let name = $( '#in-level-name' ).val();
        let projectiles = $( '#in-level-ammo' ).val();

        // Construct the level
        let level = new Level( name, projectiles, this.levelArea );

        // Serialize the level and action
        let data = level.getData();

        if (!data.id) {
            // Post level
            await fetch('https://alfredoqt.com/angry-pigs/levels', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            });
        } else {
            // Put level
            await fetch(`https://alfredoqt.com/angry-pigs/levels/${data.id}`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            });
        }
        const levels = await this._fetchLevelList();
        this._setLevelsToLoad(levels);
    }

    async _loadLevel( event ) {
        event.preventDefault();

        // Get the parameters
        let request = $( event.target ).serializeArray();
        //console.log(request[0].value);

        const response = await fetch(`https://alfredoqt.com/angry-pigs/levels/${request[0].value}`);
        
        let levelData = await response.json();
        // Rebuild the level area
        this.levelArea.rebuild( $( '#level-area' ), 'level-area-item', levelData );

        // Set some values on the save level form
        $( '#in-level-name' ).val( levelData.name );
        $( '#in-level-ammo' ).val( levelData.projectiles );
    }

    async _fetchLevelList() {

        // // Post request to server
        // $.post( "../server/server.php", params )
        //     .then( ( data ) => this._setLevelsToLoad( JSON.parse( data ))
        // );
        const response = await fetch('https://alfredoqt.com/angry-pigs/levels');
        const data = await response.json();
        return data;
    }

    _setLevelsToLoad( levelList ) {
        // Reset the select
        $( '#level-select' ).empty();

        // Append level list
        for (let i = 0; i < levelList.length; ++i) {
            $( '#level-select' ).append( `<option value="${levelList[i].id}">${levelList[i].name}</option>` );
        }
    }

}
