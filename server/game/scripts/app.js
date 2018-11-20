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
        this._init();
    }

    async _init() {
        // Creating a new game object
        this.game = new Game();

        const data = await this.getLevelList();
        // Passing the levels to the game
        this.game.setLevelList(data);

        // Registering events for the play button after getting the level-list
        this.registerEvents();

        this.hideGameOverScreen();
        this.hideGameScreen();
        this.showMainMenu();
    }

    async getLevelList()
    {
        const response = await fetch('http://localhost:5010/levels');
        const data = await response.json();
        return data;
    }

    registerEvents() {
        $("#play-button").on ('click', (event)=> {
            this.hideMainMenu();
            this.showGameScreen();

            // Launching the level
            this.game.initGame();
        });
        $("#editor-button").on ('click', (event)=> {
            window.open(`/editor`, '_self');
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
