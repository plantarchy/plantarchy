import java.awt.*;

public class Plantarchy {
    public static void main(String[] args) throws InterruptedException {
        Garden garden = new Garden(100, 100, 10);
        GUI gui = new GUI(garden);

        EventQueue.invokeLater(() -> {
            gui.setVisible(true);
        });

        while (true) {
            Thread.sleep(3000);
            garden.evolve();
            gui.repaint();
        }
    }


}

