const YOU = ["#19320a", "#0af064", "#32b464", "#F00A64"];
const OTHERS = [
    ["#0a0a32", "#0a0af0", "#0a0af0", "#0a0af0"],
    ["#320e0a", "#f0250a", "#f0250a", "#f0250a"],
    ["#331c0a", "#f06e0a", "#f06e0a", "#f06e0a"],
    ["#332f0a", "#f0d90a", "#f0d90a", "#f0d90a"],
    ["#240a33", "#9c0af0", "#9c0af0", "#9c0af0"],
]
const HUE_MAPPING = {};

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
                    this.color = YOU[0];
                } else {
                    this.color = HUE_MAPPING[this.owner][0];
                }
                break;
            case 2:
                if (this.owner == window.playerID) {
                    this.color = YOU[1];
                } else {
                    this.color = HUE_MAPPING[this.owner][1];
                }
                break;
            case 3:
                if (this.owner == window.playerID) {
                    this.color = YOU[2];
                } else {
                    this.color = HUE_MAPPING[this.owner][2];
                }
                break;
            case 4:
                if (this.owner == window.playerID) {
                    this.color = YOU[3];
                } else {
                    this.color = HUE_MAPPING[this.owner][3];
                }
                break;
        }
        // console.log("COLOR", this.color)
        this.cell.setAttr("fill", this.color);
        this.crop = crop;
    }
}
