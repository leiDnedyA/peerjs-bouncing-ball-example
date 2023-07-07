/**
 * TODO: delegate canvas width and height controls
 *       to draw() function
 */

const FPS = 27;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.setAttribute("style", "border-style:solid; border-width:1px;");
const [WIDTH, HEIGHT] = [800, 400];
canvas.width = WIDTH;
canvas.height = HEIGHT;

document.body.appendChild(canvas);

function fillCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

function handleWFuncResult(result, conn) {
    const isBundle = Array.isArray(result);

    if (!isBundle) {
        return result;
    }

    const [nextWs, message] = result;

    if (conn) {
        conn.send(message);
    }

    return nextWs;

}

function bigBang(initState, options) {
    const {toDraw, onReceive, onTick, name} = options;
    var worldState = initState;

    console.log('starting client...');

    const peer = new Peer();

    peer.on('open', () => {
        const conn = peer.connect("server", { metadata: { name: name } });
        
        conn.on("open", () => { console.log("open") });
        
        conn.on("data", (data) => {
            console.log(data);
            worldState = handleWFuncResult(onReceive(worldState, data), conn);
        })
        
        window.addEventListener("beforeunload", () => {
            alert('window closing')
            conn.close();
        })

        setInterval(() => {
            worldState = handleWFuncResult(onTick(worldState), conn);
            toDraw(worldState);
        }, 1000 / FPS)
    });

}