import java.util.Random;

public class Cell {

    public Garden garden;
    public int cellX;
    public int cellY;
    public int state;

    public int user; //placeholder
    public int age;
    private Random rand = new Random();

    public Cell(Garden garden, int cellX, int cellY) {
        this.garden = garden;
        this.cellX = cellX;
        this.cellY = cellY;
        this.age = 0;
        this.state = 0;
        //state 0 is blank, 1 is root square, 2 is new plant, state 3 is mature, state 4 is berry (harvestable);
    }

    public void evolve() {
        if (state > 1) {
            age++;
            if (state == 2) {
                if (rand.nextInt(10 - age) == 0) { //a plant takes at most 10 turns to mature
                    state = 3;
                }
            } else if (state == 3) {
                if (rand.nextInt(20) == 19) {
                    state = 4;
                }
            }
        } else if (state == 1) {
            if (rand.nextInt(30) == 0) {
                state = 2;
                garden.triggerNeighbors(cellX, cellY);
            }
        }
    }
}
