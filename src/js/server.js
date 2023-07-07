const peer = new Peer('server', { debug: 0 });

/**
 * List of connections
 * First element in list -> current ball holder
 */
var universeState = [];

function makeMail(iworld, message) {
    return {iworld: iworld, message: message};
}

/**
 * 
 * @param {*} u curr universe state
 * @param {*} iw iw to add
 * 
 * @returns [<next universe state>, <mails>, <worlds to remove>]
 * 
 */
function addWorld(u, iw) {
    const nextU = u.concat(iw);
    return [nextU, [makeMail(nextU[0], "it-is-your-turn")], []]
}

function nextBall(u, iw, m) {
    if (u.length > 0) {
        const nextU = [...u.slice(1), u[0]];
        const mails = [makeMail(nextU[0], "it-is-your-turn")]
        const toRemove = [];
        return [nextU, mails, toRemove]
    }
    return [u, [], []];
}

/**
 * Handles input from universe func,
 * returns universe state
 */
function parseUniverseResult(result) {
    const [us, mails, toRemove] = result;

    for (i in mails) {
        mail = mails[i];
        mail.iworld.send(mail.message);
    }

    // implement solution for removing worlds

    return us;

}

peer.on('open', () => {
    peer.on('connection', (conn) => {

        const name = conn.metadata.name;
        console.log(`${name} connected.`);

        conn.on('open', () => {
            universeState = parseUniverseResult(addWorld(universeState, conn));
        })

        conn.on('data', (data) => {
            // console.log(data);
            universeState = parseUniverseResult(nextBall(universeState, conn, data));
        });

        const removeConnection = () => {
            console.log(`${name} disconnected.`);

            for (i in universeState) {
                currConn = universeState[i];
                if (currConn.peer == conn.peer) {
                    universeState.splice(i, 1);
                }
            }
        }

        conn.on('close', removeConnection)
        conn.peerConnection.addEventListener(
            "connectionstatechange",
            (e) => {
                switch (conn.peerConnection.connectionState) {
                    case "failed":
                    case "closed":
                    case "disconnected":
                        removeConnection();
                        break;
                    default:
                        break;
                }
            });
    });
});