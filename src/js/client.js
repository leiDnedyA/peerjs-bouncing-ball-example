/**
 * TODO: Refactor code to look like implementation 
 * found here:
 * 
 * https://docs.racket-lang.org/teachpack/2htdpuniverse.html
 * (ctrl + F search for "Designing the Ball World")
 * 
 * */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const NAME = urlParams.get('name');

if (!NAME) {
    alert("Invalid URL, no name provided...");
    window.location.href = "../";
}

const SPEED = 5;
const RADIUS = 10;

var worldState = "RESTING";

// Returns next world state
// May return a list of structure [<next ws>, <message>]
function move(ws) {
    if (typeof ws == 'number') {
        if (ws > - (RADIUS * 2)) {
            return ws - SPEED;
        } else {
            return ["RESTING", "done"]
        }
    }
}

function draw(name) {
    return (ws) => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        if (typeof ws == 'number') {
            fillCircle(WIDTH / 4 - RADIUS / 4, ws, RADIUS, "blue");
        }
    }
}

function receive(w, m) {
    if (!(typeof w == "number")) {
        return HEIGHT;
    }
    return w;
}

bigBang({toDraw: draw(NAME), onTick: move, onReceive: receive});