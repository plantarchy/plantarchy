import java.awt.*;

public class Plantarchy {

    static final int TIME_STEP = 1000;
    static final int framesPerSeed = 3;
    static int seeds = 3;
    static int berries = 0;
    static int frame = 0;
    public static void main(String[] args) throws InterruptedException {
        Garden garden = new Garden(100, 100, 10);
        GUI gui = new GUI(garden);

        EventQueue.invokeLater(() -> {
            gui.setVisible(true);
        });

        while (true) {
            Thread.sleep(TIME_STEP);
            garden.evolve();
            gui.repaint();
            frame++;
            if (frame % framesPerSeed == 0) {
                seeds++;
            }
        }
    }




}

