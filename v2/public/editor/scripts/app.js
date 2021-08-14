const OBJECT_TYPES = {
    BIRD: 'bird',
};

function onDragStart(event) {
    const dragInitialRect = event.target.getBoundingClientRect();
    const mouseInInitialDragX = event.clientX - dragInitialRect.x;
    const mouseInInitialDragY = event.clientY - dragInitialRect.y;
    event.dataTransfer.setData('application/json', JSON.stringify({
        type: OBJECT_TYPES.BIRD,
        initialDragOffset: {
            x: mouseInInitialDragX,
            y: mouseInInitialDragY,
        },
    }));
}

function onDragOver(event) {
    event.preventDefault();
    console.log(event);
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
    if (parsedData.type === OBJECT_TYPES.BIRD) {
        const div = document.createElement('div');
        div.classList.add('object-default-bird');
        div.classList.add('level-object');
        div.setAttribute('draggable', 'true');
        const dropRect = event.target.getBoundingClientRect();
        const mouseInDropX = event.clientX - dropRect.x - parsedData.initialDragOffset.x;
        const mouseInDropY = event.clientY - dropRect.y - parsedData.initialDragOffset.y;
        div.style.left = `${mouseInDropX}px`;
        div.style.top = `${mouseInDropY}px`;
        event.target.append(div);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Get the element by id
    const birdInitialDrag = document.querySelector('#bird-default');
    const levelCanvas = document.querySelector('.level-canvas');

    // Add the ondragstart event listener
    birdInitialDrag.addEventListener('dragstart', onDragStart);

    // Drop zone
    levelCanvas.addEventListener('drop', onDrop);
    levelCanvas.addEventListener('dragover', onDragOver);
});
