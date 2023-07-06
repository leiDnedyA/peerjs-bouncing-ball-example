

/**
 * TODO: Refactor code to look like implementation 
 * found here:
 * 
 * https://docs.racket-lang.org/teachpack/2htdpuniverse.html
 * (ctrl + F search for "Designing the Ball World")
 * 
 * /


/**
 * Get NAME from query params and set it to NAME, or 
 * redirect user to homepage to generate a new url with 
 * a name param.
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const NAME = urlParams.get('name');

if (!NAME) {
    alert("Invalid URL, no name provided...");
    window.location.href = "../";
}

/**
 * Canvas setup
 */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute("style", "border-style:solid; border-width:1px;");
document.body.appendChild(canvas);

const SPEED = 3;
const RADIUS = 10;
const [WIDTH, HEIGHT] = [800, 400];

const FPS = 27;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function fillCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

const WORLD = {
    isActive: false,
    posy: HEIGHT + RADIUS * 2,
    setActive: function () { this.isActive = true; console.log(this) },
    setInactive: function () { this.isActive = false; this.posy = HEIGHT + RADIUS * 2 }
}

// Returns next world state
function move() {
    if (WORLD.isActive) {
        if (WORLD.posy > - (RADIUS * 2)) {
            WORLD.posy -= SPEED;
        } else {
            WORLD.setInactive();
        }
    }
}

// Draws image to canvas based on world state
function draw(name) {
    return () => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        if (WORLD.isActive) {
            fillCircle(WIDTH / 4 - RADIUS / 4, WORLD.posy, RADIUS, "blue");
        }
    }
}


function receive(data) {

}

function start() {

    console.log('starting client...')

    /**
    * PeerJS setup
    */
    const peer = new Peer();
    peer.on('open', () => {
        const conn = peer.connect("server", { metadata: { name: NAME } });
        conn.on("open", () => { console.log("open") });
        
        window.addEventListener("beforeunload", () => {
            alert('window closing')
            conn.close();
        })

    });

    setInterval(() => {
        move();
        draw();
    }, 1000 / FPS)

}



function testStart() {
    WORLD.setActive();
    start();
}

start();