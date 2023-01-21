public class Garden {

    public Plant[][] grid;
    public int cellSize;

    public Garden(int width, int height, int cellSize) {
        grid = new Plant[width][height];
        this.cellSize = cellSize;
    }

    public void update() {
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] != null) {
                    grid[i][j].update();
                }

            }
        }
    }

    public Plant getPlant(int x, int y) {
        return grid[x][y];
    }

    public void plantSeed(int x, int y) {
        grid[x][y] = new Plant();
    }

    public void cellClicked(int x, int y) {
        int cellX = x / cellSize;
        int cellY = y / cellSize;

        if (grid[cellX][cellY] == null) {
            plantSeed(cellX, cellY);
        } else if (grid[cellX][cellY].state == 3) {
            grid[cellX][cellY].state = 2;
        }
    }
}
