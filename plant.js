const YOU = ["#19320a", "#0af064", "#32b464", "#F00A64"];
const OTHERS = [
    ["#0a0a32", "#0a0af0", "#0a0af0", "#0a0af0"], // blue
    ["#320e0a", "#f0250a", "#f0250a", "#f0250a"], // red
    ["#331c0a", "#f06e0a", "#f06e0a", "#f06e0a"], // dark brown / orange
    ["#332f0a", "#f0d90a", "#f0d90a", "#f0d90a"], // yellow
    ["#240a33", "#9c0af0", "#9c0af0", "#9c0af0"], // purple
    ["#0a3133", "#0bb3bc", "#9c0af0", "#9c0af0"], // light blue
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
                this.color = "#512b0a";
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
