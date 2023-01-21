class Garden {

    grid = [];
    cellSize;
    width;
    height;

    constructor(width, height, cellSize) {
        for (let i = 0; i < height; i++) {
            this.grid.push(new Array(width));
        }
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
    }
}

