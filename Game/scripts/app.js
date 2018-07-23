/*
 * App Class
 *
 * Manages the Menu of the game and also launches the game
 *
 * Copyright 2018 - Alfredo & Harish
 */
'use strict';

import { Game } from "./game.js";

// This class is in charge on keeping the level list and changing games
export class App
{
    constructor()
    {
        // Creating a new game object
        this.game = new Game();

        this.getLevelList();

        this.hideGameOverScreen();
        this.hideGameScreen();
        this.showMainMenu();
    }

    getLevelList()
    {
        let request = [];
        request.push( { name: "action", value: "get_level_list"} );

        let params = $.param( request );

        $.post( "../server/server.php", params )
        .then( ( data ) => {
            
            // Passing the levels to the game
            this.game.setLevelList(JSON.parse( data ));

            // Registering events for the play button after getting the level-list
            this.registerEvents();
        });
    }

    registerEvents() {
        $("#play-button").on ('click', (event)=> {
            this.hideMainMenu();
            this.showGameScreen();

            // Launching the level
            this.game.initGame();
        });
    }

    showMainMenu()
    {
        $("#main-menu-screen").show();
    }

    hideMainMenu()
    {
        $("#main-menu-screen").hide();
    }

    showGameScreen()
    {
        $("#game-screen").show();
    }

    hideGameScreen()
    {
        $("#game-screen").hide();
    } 

    showGameOverScreen()
    {
        $("#game-over-screen").show();
    }

    hideGameOverScreen()
    {
        $("#game-over-screen").hide();
    }
}

$( document ).ready( () => {
    let app = new App();
    app.game.run();
});
