const OBJECT_TYPES = {
    BIRD: 'bird',
    CANNON: 'cannon',
    BOX: 'box',
};

// TODO: Abstract this away to a Level class
const levelIdsToElementMap = new Map();
// {cannon: Cannon, birds: Bird[], boxes: Box[]}
let levelObjectsData = {cannon: null, birds: {}, boxes: {}};

function onDragStartObjectArea(event) {
    const dragInitialRect = event.target.getBoundingClientRect();
    const mouseInInitialDragX = event.clientX - dragInitialRect.x;
    const mouseInInitialDragY = event.clientY - dragInitialRect.y;
    const type = event.target.getAttribute('data-level-object-type');
    event.dataTransfer.setData('application/json', JSON.stringify({
        type,
        initialDragOffset: {
            x: mouseInInitialDragX,
            y: mouseInInitialDragY,
        },
    }));
}

function onDragStartLevelArea(event) {
    const dragInitialRect = event.target.getBoundingClientRect();
    const mouseInInitialDragX = event.clientX - dragInitialRect.x;
    const mouseInInitialDragY = event.clientY - dragInitialRect.y;
    const type = event.target.getAttribute('data-level-object-type');
    event.dataTransfer.setData('application/json', JSON.stringify({
        id: event.target.getAttribute('data-object-id'),
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

function onDropNewObject(event, data) {
    if (data.type === OBJECT_TYPES.CANNON && levelObjectsData.cannon != null) {
        return;
    }

    const id = uuidv4();
    const newLevelObject = document.createElement('div');
    newLevelObject.setAttribute('data-object-id', id);
    newLevelObject.classList.add('level-object');
    newLevelObject.setAttribute('draggable', 'true');
    const dropRect = event.target.getBoundingClientRect();
    const mouseInDropX = event.clientX - dropRect.x - data.initialDragOffset.x;
    const mouseInDropY = event.clientY - dropRect.y - data.initialDragOffset.y;
    newLevelObject.style.left = `${mouseInDropX}px`;
    newLevelObject.style.top = `${mouseInDropY}px`;
    const newObject = {id, x: mouseInDropX, y: mouseInDropY};
    switch (data.type) {
        case OBJECT_TYPES.BIRD:
            levelObjectsData = {...levelObjectsData, birds: {
                ...levelObjectsData.birds,
                [newObject.id]: newObject,
            }};
            newLevelObject.setAttribute('data-level-object-type', OBJECT_TYPES.BIRD);
            newLevelObject.classList.add('level-object-bird');
            break;
        case OBJECT_TYPES.CANNON:
            levelObjectsData = {...levelObjectsData, cannon: newObject};
            newLevelObject.setAttribute('data-level-object-type', OBJECT_TYPES.CANNON);
            newLevelObject.classList.add('level-object-cannon');
            break;
        case OBJECT_TYPES.BOX:
            levelObjectsData = {...levelObjectsData, boxes: {
                ...levelObjectsData.boxes,
                [newObject.id]: newObject,
            }};
            newLevelObject.setAttribute('data-level-object-type', OBJECT_TYPES.BOX);
            newLevelObject.classList.add('level-object-box');
            break;
        default:
            throw new Error('Level object type does not exist');
    }
    newLevelObject.addEventListener('dragstart', onDragStartLevelArea);
    levelIdsToElementMap.set(id, newLevelObject);
    event.target.append(newLevelObject);
}

function onDropExistingObject(event, data) {
    const levelObject = levelIdsToElementMap.get(data.id);

    if (levelObject != null) {
        const dropRect = event.target.getBoundingClientRect();
        const mouseInDropX = event.clientX - dropRect.x - data.initialDragOffset.x;
        const mouseInDropY = event.clientY - dropRect.y - data.initialDragOffset.y;
        levelObject.style.left = `${mouseInDropX}px`;
        levelObject.style.top = `${mouseInDropY}px`;
        const updatedObject = {id: data.id, x: mouseInDropX, y: mouseInDropY};
        switch (data.type) {
            case OBJECT_TYPES.BIRD:
                levelObjectsData = {...levelObjectsData, birds: {
                    ...levelObjectsData.birds,
                    [updatedObject.id]: updatedObject,
                }};
                break;
            case OBJECT_TYPES.CANNON:
                levelObjectsData = {...levelObjectsData, cannon: updatedObject};
                break;
            case OBJECT_TYPES.BOX:
                levelObjectsData = {...levelObjectsData, boxes: {
                    ...levelObjectsData.boxes,
                    [updatedObject.id]: updatedObject,
                }};
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
        objectDefault.addEventListener('dragstart', onDragStartObjectArea);
    });

    // Drop zone
    levelCanvas.addEventListener('drop', onDrop);
    levelCanvas.addEventListener('dragover', onDragOver);
});
