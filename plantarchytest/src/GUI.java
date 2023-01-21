import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;

public class GUI extends JFrame {

    Garden garden;
    public final int WING_BUFFER = 200;
    public final int GARDEN_X = 50;
    public final int GARDEN_Y = 50;

    private BufferedImage dbImage;
    private Graphics dbg;


    public GUI(Garden garden) {
        this.garden = garden;
        initUI();
        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int mouseX = e.getX();
                int mouseY = e.getY();
                System.out.println("cell clicked");
                garden.cellClicked(mouseX - GARDEN_X - WING_BUFFER, mouseY - GARDEN_Y);
                repaint();
            }
        });

    }

    private void initUI() {
        setTitle("Plantarchy");
        setSize(garden.width * garden.cellSize + 2 * GARDEN_X + 2 * WING_BUFFER, garden.height * garden.cellSize + 2 * GARDEN_Y);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        getContentPane().setBackground(new Color(40, 20, 10));
        this.repaint();
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);
        dbImage = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_INT_ARGB);
        dbg = dbImage.getGraphics();
        paintComponent(dbg);
        g.drawImage(dbImage, 0, 0, this);
    }

    public void paintComponent(Graphics g) {
        for (int i = 0; i < garden.width; i++) {
            for (int j = 0; j < garden.height; j++) {
                switch (garden.getPlant(i, j).state) {
                    case 0 -> g.setColor(new Color(50, 25, 15));
                    case 1 -> g.setColor(new Color(25, 50, 10));
                    case 2 -> g.setColor(new Color(140, 200, 100));
                    case 3 -> g.setColor(new Color(60, 120, 0));
                    case 4 -> g.setColor(new Color(240, 10, 100));
                }
                dbg.fillRect(GARDEN_X + i * garden.cellSize + WING_BUFFER, +GARDEN_Y + j * garden.cellSize, garden.cellSize, garden.cellSize);
            }
        }
    }
}