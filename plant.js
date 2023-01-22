class Plant {
    color;
    crop;
    owner;

    constructor(owner, crop, cell) {
        this.crop = crop;
        this.cell = cell;
        this.owner = owner;
    }

    setCrop(crop) {
        switch (crop) {
            case 0:
                this.color = "#000000";
                break;
            case 1:
                if (this.owner == window.playerID) {
                    this.color = "#19320a";
                } else {
                    this.color = "#0a0a32";
                }
                break;
            case 2:
                if (this.owner == window.playerID) {
                    this.color = "#0AF064";
                } else {
                    this.color = "#0a0af0";
                }
                break;
            case 3:
                if (this.owner == window.playerID) {
                    this.color = "#32B464";
                } else {
                    this.color = "#0a0af0";
                }
                break;
            case 4:
                if (this.owner == window.playerID) {
                    this.color = "#F00A64"
                } else {
                    this.color = "#0a0af0";
                }
                break;
        }
        this.cell.setAttr("fill", this.color);
        this.crop = crop;
    }
}
