const OBJECT_TYPES = {
    BIRD: 'bird',
    CANNON: 'cannon',
    BOX: 'box',
};

const DATA_LEVEL_OBJECT_ID = 'data-level-object-id';
const DATA_LEVEL_OBJECT_TYPE = 'data-level-object-type';

// TODO: Abstract this away to a level reducer
const levelIdsToElementMap = new Map();
// {entities: {birds: {byId: Map<ID, Bird>, ids: ID[], structure: {byId: Map<ID, Box>, ids: ID[]}}}, name: string, cannon: Cannon}
let levelData = {entities: {birds: {byId: {}, ids: []}, structure: {byId: {}, ids: []}}, name: null, cannon: null};

function onDragStart(event) {
    const dragInitialRect = event.target.getBoundingClientRect();
    const mouseInInitialDragX = event.clientX - dragInitialRect.x;
    const mouseInInitialDragY = event.clientY - dragInitialRect.y;
    const type = event.target.getAttribute(DATA_LEVEL_OBJECT_TYPE);
    event.dataTransfer.setData('application/json', JSON.stringify({
        id: event.target.getAttribute(DATA_LEVEL_OBJECT_ID),
        type,
        initialDragOffset: {
            x: mouseInInitialDragX,
            y: mouseInInitialDragY,
        },
    }));
}

function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function getDropCoordinates(mouseEvent, dropArea, objectOffsetToMouse) {
    const dropRect = dropArea.getBoundingClientRect();
    const mouseInDropX = mouseEvent.clientX - dropRect.x - objectOffsetToMouse.x;
    const mouseInDropY = mouseEvent.clientY - dropRect.y - objectOffsetToMouse.y;
    return {
        x: mouseInDropX,
        y: mouseInDropY,
    };
}

function onDropNewObject(event, data) {
    if (data.type === OBJECT_TYPES.CANNON && levelData.cannon != null) {
        return;
    }

    const id = uuidv4();

    const dropCoordinates = getDropCoordinates(event, event.target, data.initialDragOffset);

    // Update view
    const newLevelObject = document.createElement('div');
    newLevelObject.classList.add('level-object');
    newLevelObject.setAttribute(DATA_LEVEL_OBJECT_ID, id);
    newLevelObject.setAttribute(DATA_LEVEL_OBJECT_TYPE, data.type);
    newLevelObject.setAttribute('draggable', 'true');
    newLevelObject.addEventListener('dragstart', onDragStart);
    newLevelObject.style.left = `${dropCoordinates.x}px`;
    newLevelObject.style.top = `${dropCoordinates.y}px`;
    newLevelObject.classList.add(`level-object-${data.type}`);

    levelIdsToElementMap.set(id, newLevelObject);
    event.target.append(newLevelObject);

    // Update data
    const newObject = {id, x: dropCoordinates.x, y: dropCoordinates.y, type: data.type};
    switch (data.type) {
        case OBJECT_TYPES.BIRD:
            levelData = {
                ...levelData,
                entities: {
                    ...levelData.entities,
                    birds: {
                        byId: {
                            ...levelData.entities.birds.byId,
                            [id]: newObject,
                        },
                        ids: [...levelData.entities.birds.ids, id],
                    },
                },
            };
            break;
        case OBJECT_TYPES.CANNON:
            levelData = {...levelData, cannon: newObject};
            break;
        case OBJECT_TYPES.BOX:
            levelData = {
                ...levelData,
                entities: {
                    ...levelData.entities,
                    structure: {
                        byId: {
                            ...levelData.entities.structure.byId,
                            [id]: newObject,
                        },
                        ids: [...levelData.entities.structure.ids, id],
                    },
                },
            };
            break;
        default:
            throw new Error('Level object type does not exist');
    }
}

function onDropExistingObject(event, data) {
    const levelObject = levelIdsToElementMap.get(data.id);

    if (levelObject != null) {
        const dropCoordinates = getDropCoordinates(event, event.target, data.initialDragOffset);
        
        // Update view
        levelObject.style.left = `${dropCoordinates.x}px`;
        levelObject.style.top = `${dropCoordinates.y}px`;

        // Update data
        const updatedObject = {x: dropCoordinates.x, y: dropCoordinates.y};
        switch (data.type) {
            case OBJECT_TYPES.BIRD:
                levelData = {
                    ...levelData,
                    entities: {
                        ...levelData.entities,
                        birds: {
                            ...levelData.entities.birds,
                            byId: {
                                ...levelData.entities.birds.byId,
                                [data.id]: {...levelData.entities.birds.byId[data.id], ...updatedObject},
                            },
                        },
                    },
                };
                break;
            case OBJECT_TYPES.CANNON:
                levelData = {...levelData, cannon: {...levelData.cannon, updatedObject}};
                break;
            case OBJECT_TYPES.BOX:
                levelData = {
                    ...levelData,
                    entities: {
                        ...levelData.entities,
                        structure: {
                            ...levelData.entities.structure,
                            byId: {
                                ...levelData.entities.structure.byId,
                                [data.id]: {...levelData.entities.structure.byId[data.id], ...updatedObject},
                            },
                        },
                    },
                };
                break;
            default:
                throw new Error('Level object type does not exist');
        }
    }
}

function onDrop(event) {
    event.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = event.dataTransfer.getData('application/json');
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (e) {
        console.log(e);
        return;
    }
    if (parsedData.id == null) {
        onDropNewObject(event, parsedData);
    } else {
        onDropExistingObject(event, parsedData);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const objectDefaults = document.querySelectorAll('.object-default');
    const levelCanvas = document.querySelector('.level-canvas');

    objectDefaults.forEach((objectDefault) => {
        objectDefault.addEventListener('dragstart', onDragStart);
    });

    // Drop zone
    levelCanvas.addEventListener('drop', onDrop);
    levelCanvas.addEventListener('dragover', onDragOver);
});

// Ship {
//     totalHealth: 5,4,3,2
//     healthLeft: 5,4,3,2
//     hitSpots = [false, false, false, false, false]
//     direction: left | top | right | bottom
//     head: [i, j]

//     hit(i, j): boolean { // Boolean
//         // Check hit spots
//         // If hit, decrease health
//     }


//     isSunk() {
//         return healthLeft === 0;
//     }
// }

// Square {
//     state: HIT, OCEAN, SUNK, NOT_HIT
//     ship?: Ship (optional): Ship | undefined
//     i: int
//     j: int
//     hit() {
//         if (ship) {
//             const isHit = ship.hit(i, j);
//             if (isHit) {
//                 // ChangeState
//             }
//         }
//     }

//     shipSunk() {
//         return ship.isSunk()
//     }
// }

// FleetMap { // squares: [100][100]

//     // Interacts with the html
//     hit(squareElement) {
//         const i = squareElement.getAttribute('data-i');
//         const j = squareElement.getAttribute('data-j');
//         const square = squares[i][j];
//         if (square.ship) {
//             if (square.shipSunk()) {
//                 return;
//             }
//             square.hit();
//             if (square.shipSunk()) {
//                 // Update all the other squares that have that ship
//                 const head = square.ship.head;
//                 const direction = square.direction;
//                 if (direction === left) {
//                 }
//             }
//         } else {
//             // Is water
//         }
//     }
// }

// [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ]
