import java.util.Random;

public class Cell {

    public Garden garden;
    public int cellX;
    public int cellY;
    public int state;

    public int player; //placeholder
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
            int deathBound = 80/(Math.abs(garden.countNeighbors(cellX, cellY) - 4) + 1);
            boolean die = false;
            if (age < deathBound - 1) {
                die = rand.nextInt(deathBound - age) == 0;
            } else {
                die = true;
            }
            if (die) {
                if (garden.checkForNeighbors(cellX, cellY)) {
                    state = 1;
                } else {
                    state = 0;
                }
            }

            if (state == 2) {
                if (age < 9) {
                    if (rand.nextInt(10 - age) == 0) { //a plant takes at most 10 turns to mature
                        state = 3;
                    }
                } else {
                    state = 3;
                }

            } else if (state == 3) { //growing fruit
                if (rand.nextInt(20) == 0) {
                    state = 4;
                }
            } else if (state == 4) { //rotting
                if (rand.nextInt(10 ) == 0) {
                    state = 3;
                }
            }
        } else if (state == 1) {
            age = 0;
            if (garden.checkForNeighbors(cellX, cellY)) {
                if (rand.nextInt(30) == 0) {
                    state = 2;
                    garden.triggerNeighbors(cellX, cellY);
                }
            } else {
                state = 0;
            }
        } else if (state == 0) {
            age = 0;
        }
    }
}
