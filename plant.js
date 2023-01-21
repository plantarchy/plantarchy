class Plant {
    color;
    crop;

    constructor(crop, cell) {
        this.crop = crop;
        this.cell = cell;
    }

    setCrop(crop) {
        switch (crop) {
            case 0:
                this.color = "#000000";
                break;
            case 1:
                this.color = "#0AF064";
                break;
            case 2:
                this.color = "#32B464";
                break;
            case 3:
                this.color = "#F00A64";
                break;
        }
        this.cell.setAttr("fill", this.color);
        this.crop = crop;
    }
}
