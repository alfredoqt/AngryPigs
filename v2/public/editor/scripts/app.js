const OBJECT_TYPES = {
    BIRD: 'bird',
    CANNON: 'cannon',
    BOX: 'box',
};

function onDragStart(event) {
    const dragInitialRect = event.target.getBoundingClientRect();
    const mouseInInitialDragX = event.clientX - dragInitialRect.x;
    const mouseInInitialDragY = event.clientY - dragInitialRect.y;
    const type = event.target.getAttribute('data-level-object-default-type');
    event.dataTransfer.setData('application/json', JSON.stringify({
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
    // TODO: Show a warning when trying to add two cannons

    const newLevelObject = document.createElement('div');
    newLevelObject.classList.add('level-object');
    newLevelObject.setAttribute('draggable', 'true');
    const dropRect = event.target.getBoundingClientRect();
    const mouseInDropX = event.clientX - dropRect.x - parsedData.initialDragOffset.x;
    const mouseInDropY = event.clientY - dropRect.y - parsedData.initialDragOffset.y;
    newLevelObject.style.left = `${mouseInDropX}px`;
    newLevelObject.style.top = `${mouseInDropY}px`;
    switch (parsedData.type) {
        case OBJECT_TYPES.BIRD:
            newLevelObject.classList.add('level-object-bird');
            break;
        case OBJECT_TYPES.CANNON:
            newLevelObject.classList.add('level-object-cannon');
            break;
        case OBJECT_TYPES.BOX:
            newLevelObject.classList.add('level-object-box');
            break;
        default:
            throw new Error('Level object type does not exist');
    }
    event.target.append(newLevelObject);
}

window.addEventListener('DOMContentLoaded', () => {
    const objectDefaults = document.querySelectorAll('.object-default');
    const levelCanvas = document.querySelector('.level-canvas');

    // Add the ondragstart event listener
    objectDefaults.forEach((objectDefault) => {
        objectDefault.addEventListener('dragstart', onDragStart);
    });

    // Drop zone
    levelCanvas.addEventListener('drop', onDrop);
    levelCanvas.addEventListener('dragover', onDragOver);
});
