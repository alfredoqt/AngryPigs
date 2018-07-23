/*
 * Game Class
 *
 * Manages the launching of the game and loading the levels in to the world
 * Contains game logic as well 
 * 
 * Copyright 2018 - Alfredo & Harish
 */
'use strict';

import { physics } from './Physics.js';
import { WorldController } from './worldcontroller.js';

export class Game {

    constructor() {
        this.world = new WorldController( $( '#game-area' ) );
        this.levelList = []; 
        this.currentLevel = null;
        this.registerEvents();
    }

    initGame() {
        this.world.fetchLevelData(this.currentLevel);
        $("#level-name").html(`Level - ${this.currentLevel}`);
    }

    update() {
        // Checking if the world is loaded before updating the world
        if (this.world.levelLoaded)
        {
            this.world.update();
            $("#pigs-left").html(this.world.projectileCount); // Checking if the birds are dead
            if (this.world.birdCount <= 0)
            {
                // Show the player he has won the game
                this.playerWonGame();
            }
            // Checking if the player has run out of ammo
            else if (this.world.projectileCount <= 0)
            {
                // Show the player that he has lost the game
                this.playerLostGame();
            }
        }
    }

    render() {
        this.world.render();
    }

    run() {
        this.update();
        this.render();

        // Run every frame
        window.requestAnimationFrame( () => { this.run(); });
    }


    setLevelList(levelList)
    {
        this.levelList = levelList;
        this.currentLevel = this.levelList.shift();
    }

    loadNextLevel()
    {
        this.currentLevel = this.levelList.shift();
        this.initGame();
    }
    replayLevel()
    {
        this.initGame();
    }

    registerEvents()
    {
        // Event Handlers
        $("#replay-button").on( 'click', (event)=> {
            this.replayLevel();
            $("#game-over-screen").hide();
            $("#game-screen").show();
        });
        $("#next-level-button").on( 'click', (event)=>{
            this.loadNextLevel();
            $("#game-over-screen").hide();
            $("#game-screen").show();
        });
        $("#menu-button").on( 'click', (event)=>{
            $("#game-screen").hide();
            $("#main-menu-screen").show();
        });
    }

    playerWonGame()
    {
        $("#game-screen").hide();
        $("#replay-button").show();
        $("#game-over-screen").show();

        if (this.levelList.length > 0)
        {
            $("#game-over-message").html("You have completed the level!");
            $("#next-level-button").show();
        }
        else
        {
            $("#game-over-message").html("You have completed all the levels!");
            $("#next-level-button").hide();
        }        
    }

    playerLostGame()
    {
        $("#game-over-message").html("You have run out of Pigs!");
        $("#game-screen").hide();
        $("#replay-button").show();
        $("#next-level-button").hide();
        $("#game-over-screen").show();
    }
}
