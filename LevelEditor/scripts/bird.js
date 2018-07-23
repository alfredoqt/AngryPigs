/**
 * Bird class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Creation and serialization of birds
 *
 */

class Bird {

    // Creates a bird in a droppable area and returns id
    static Create( droppable$, id, itemsClass, bird = undefined ) {
        let birdId = `level-bird-${id}`;

        // Check if data about bird was sent
        if (bird === undefined) {
            Bird._addDefault( droppable$, birdId, itemsClass );
        } else {
            Bird._addCustom( droppable$, birdId, itemsClass, bird );
        }

        return birdId;
    }

    static _addDefault( droppable$, birdId, itemsClass ) {
        // Add it to the droppable
        droppable$.append(`<div id="${birdId}" class="${itemsClass} bird" draggable="true"></div>`);
    }

    static _addCustom( droppable$, birdId, itemsClass, bird ) {
        // Add it to the droppable
        droppable$.append(`<div id="${birdId}" class="${itemsClass} bird" draggable="true"
        style="top: ${bird.sy}px; left: ${bird.sx}px;"></div>`);
    }

}
