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

function move(ws) {
    const isActive = typeof ws == 'number';
    
    if (isActive) {
        const ballFinished = ws <= - (RADIUS * 2);
        if (ballFinished) {
            return ["RESTING", "done"]
        } else {
            return ws - SPEED;
        }
    }

    return ws;
}

function draw(name) {
    return (ws) => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        const worldIsActive = typeof ws == 'number';
        
        if (worldIsActive) {
            fillCircle(WIDTH / 4 - RADIUS / 4, ws, RADIUS, "blue");
        }
    }
}

function receive(w, m) {
    const worldIsActive = typeof w == "number"; 
    
    if (!worldIsActive) {
        return HEIGHT;
    }
    
    return w;
}

const initState = "RESTING";
bigBang(initState, {toDraw: draw(NAME), onTick: move, onReceive: receive, name: NAME});