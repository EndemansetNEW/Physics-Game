class DrawInfo {
    constructor(width, height, list) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.width = width;
        this.height = height;

        this.SIDE_PAD = 100;
        this.TOP_PAD = 150;

        this.GRADIENTS = ["#888888", "#aaaaaa", "#cccccc"];

        this.setList(list);
    }

    setList(list) {
        this.list = list;
        this.min = Math.min(...list);
        this.max = Math.max(...list);

        this.blockWidth = Math.floor((this.width - this.SIDE_PAD) / list.length);
        this.blockHeight = Math.floor((this.height - this.TOP_PAD) / (this.max - this.min));
        this.startX = this.SIDE_PAD / 2;
    }
}

function draw(info, algoName, ascending) {
    const ctx = info.ctx;
    ctx.clearRect(0, 0, info.width, info.height);

    document.getElementById("title").innerText =
        `${algoName} - ${ascending ? "Ascending" : "Descending"}`;

    drawList(info);
}

function drawList(info, colors = {}) {
    const ctx = info.ctx;
    ctx.clearRect(0, info.TOP_PAD, info.width, info.height);

    info.list.forEach((val, i) => {
        const x = info.startX + i * info.blockWidth;
        const y = info.height - (val - info.min) * info.blockHeight;

        ctx.fillStyle = colors[i] || info.GRADIENTS[i % 3];
        ctx.fillRect(x, y, info.blockWidth, info.height);
    });
}

function generateList(n, min, max) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
}

async function bubbleSort(info, ascending = true) {
    let arr = info.list;

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if ((arr[j] > arr[j + 1] && ascending) ||
                (arr[j] < arr[j + 1] && !ascending)) {

                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                drawList(info, {
                    [j]: "green",
                    [j + 1]: "red"
                });

                await new Promise(r => setTimeout(r, 10));
            }
        }
    }
}

async function insertionSort(info, ascending = true) {
    let arr = info.list;

    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i;

        while (j > 0 &&
            ((arr[j - 1] > current && ascending) ||
             (arr[j - 1] < current && !ascending))) {

            arr[j] = arr[j - 1];
            j--;
            arr[j] = current;

            drawList(info, {
                [j]: "red",
                [j + 1]: "green"
            });

            await new Promise(r => setTimeout(r, 10));
        }
    }
}

let n = 50;
let minVal = 0;
let maxVal = 100;

let list = generateList(n, minVal, maxVal);
let info = new DrawInfo(800, 600, list);

let sorting = false;
let ascending = true;

let currentSort = bubbleSort;
let algoName = "Bubble Sort";

draw(info, algoName, ascending);

document.addEventListener("keydown", async (e) => {
    if (sorting) return;

    if (e.key === "r") {
        list = generateList(n, minVal, maxVal);
        info.setList(list);
        draw(info, algoName, ascending);
    }

    if (e.key === " ") {
        sorting = true;
        await currentSort(info, ascending);
        sorting = false;
    }

    if (e.key === "a") {
        ascending = true;
        draw(info, algoName, ascending);
    }

    if (e.key === "d") {
        ascending = false;
        draw(info, algoName, ascending);
    }

    if (e.key === "i") {
        currentSort = insertionSort;
        algoName = "Insertion Sort";
        draw(info, algoName, ascending);
    }

    if (e.key === "b") {
        currentSort = bubbleSort;
        algoName = "Bubble Sort";
        draw(info, algoName, ascending);
    }
});
