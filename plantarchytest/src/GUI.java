import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class GUI extends JFrame {

    Garden garden;
    public final int GARDEN_X = 50;
    public final int GARDEN_Y = 50;

    public GUI(Garden garden) {
        this.garden = garden;
        initUI();
        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int mouseX = e.getX();
                int mouseY = e.getY();
                System.out.println("cell clicked");
                garden.cellClicked(mouseX - GARDEN_X, mouseY - GARDEN_Y);
                repaint();
            }
        });

    }

    private void initUI() {
        setTitle("Plantarchy");
        setSize(garden.width * garden.cellSize + 2 * GARDEN_X, garden.height * garden.cellSize + 2 * GARDEN_Y);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.repaint();
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);
        for (int i = 0; i < garden.width; i++) {
            for (int j = 0; j < garden.height; j++) {
                switch (garden.getPlant(i, j).state) {
                    case 0 -> g.setColor(Color.lightGray);
                    case 1 -> g.setColor(new Color(100, 160, 120));
                    case 2 -> g.setColor(new Color(10, 240, 100));
                    case 3 -> g.setColor(new Color(50, 180, 100));
                    case 4 -> g.setColor(new Color(240, 10, 100));
                }
                g.fillRect(+GARDEN_X + i * garden.cellSize, +GARDEN_Y + j * garden.cellSize, garden.cellSize, garden.cellSize);
            }
        }
    }
}