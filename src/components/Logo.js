public addGrid = () => {

    var grid = 50;
    var canvasWidth = this.canvas.getWidth();
    var canvasHeight = this.canvas.getHeight();

    for (var i = 0; i < (canvasWidth / grid); i++) {
        this.canvas.sendToBack(
            new fabric.Line([i * grid, 0, i * grid, canvasHeight],
                { type: 'line', name: 'grid line', stroke: '#ccc', selectable: false }));
        this.canvas.sendToBack(new fabric.Line(
            [0, i * grid, canvasWidth, i * grid],
            { type: 'line', name: 'grid line', stroke: '#ccc', selectable: false }))
    }
};

