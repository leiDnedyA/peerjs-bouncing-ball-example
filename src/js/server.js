const peer = new Peer('server', { debug: 0 });

/**
 * List of connections
 * First element in list = current ball holder
*/
var universeState = [];

function makeMail(iworld, message) {
    return {iworld: iworld, message: message};
}

function handleUFuncResult(result) {
    const [univState, mails, toRemove] = result;

    for (i in mails) {
        mail = mails[i];
        mail.iworld.send(mail.message);
    }

    // implement solution for removing worlds

    return univState;

}

function addWorld(u, iw) {
    const nextU = u.concat(iw);
    const mails = [makeMail(nextU[0], "it-is-your-turn")];
    const toRemove = [];
    return [nextU, mails, toRemove];
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


peer.on('open', () => {
    peer.on('connection', (conn) => {

        const name = conn.metadata.name;
        console.log(`${name} connected.`);

        conn.on('open', () => {
            universeState = handleUFuncResult(addWorld(universeState, conn));
        })

        conn.on('data', (data) => {
            console.log(`${name}: ${data}`);
            universeState = handleUFuncResult(nextBall(universeState, conn, data));
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