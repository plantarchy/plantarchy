import java.awt.*;
import java.util.Random;

public class Plant {

    public int state;
    public int age;
    private Random rand = new Random();

    public Plant() {
        this.age = 0;
        this.state = 1;
        //state 1 is new plant, state 2 is mature, state 3 is berry (harvestable);
    }

    public void update() {
        age++;
        if (state == 1) {
            if (rand.nextInt(4 - age) == 0) { //a plant takes at most 3 turns to mature
                state = 2;
            }
        } else if (state == 2) {
            if (rand.nextInt(20) == 19) {
                state = 3;
            }
        }
    }
}
