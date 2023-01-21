public class Garden {

    public Cell[][] grid;
    public int width;
    public int height;
    public int cellSize;

    public Garden(int width, int height, int cellSize) {
        this.width = width;
        this.height = height;
        this.grid = new Cell[width][height];
        this.cellSize = cellSize;
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                grid[i][j] = new Cell(this, i, j);
            }
        }
    }

    public void evolve() {
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (grid[i][j] != null) {
                    grid[i][j].evolve();
                }
            }
        }
    }

    public Cell getPlant(int x, int y) {
        return grid[x][y];
    }

    public void cellClicked(int x, int y) {
        int cellX = x / cellSize;
        int cellY = y / cellSize;

        if (grid[cellX][cellY].state < 2) {
            grid[cellX][cellY].state = 2;
            triggerNeighbors(cellX, cellY);
        } else if (grid[cellX][cellY].state == 4) {
            grid[cellX][cellY].state = 3;
        }
    }

    public void triggerNeighbors(int cellX, int cellY) {
        if (cellX > 0) {
            if (grid[cellX - 1][cellY].state == 0) {grid[cellX - 1][cellY].state = 1;}
            if (cellY > 0) {
                if (grid[cellX][cellY - 1].state == 0) {grid[cellX][cellY - 1].state = 1;}
                if (grid[cellX - 1][cellY - 1].state == 0) {grid[cellX - 1][cellY - 1].state = 1;}
            }
            if (cellY < height - 1) {
                if (grid[cellX][cellY + 1].state == 0) {grid[cellX][cellY + 1].state = 1;}
                if (grid[cellX - 1][cellY + 1].state == 0) {grid[cellX - 1][cellY + 1].state = 1;}
            }
        }
        if (cellX < width - 1) {
            if (grid[cellX + 1][cellY].state == 0) {grid[cellX + 1][cellY].state = 1;}
            if (cellY > 0) {
                if (grid[cellX][cellY - 1].state == 0) {grid[cellX][cellY - 1].state = 1;}
                if (grid[cellX + 1][cellY - 1].state == 0) {grid[cellX + 1][cellY - 1].state = 1;}
            }
            if (cellY < height - 1) {
                if (grid[cellX][cellY + 1].state == 0) {grid[cellX][cellY + 1].state = 1;}
                if (grid[cellX + 1][cellY + 1].state == 0) {grid[cellX + 1][cellY + 1].state = 1;}
            }
        }
    }
}
