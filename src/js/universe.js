
function makeMail(iworld, message) {
    return { iworld: iworld, message: message };
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

function universe(initState, options){
    const {onNew, onMessage} = options;

    var universeState = initState;

    const peer = new Peer('server', { debug: 0 });

    peer.on('open', () => {
        peer.on('connection', (conn) => {

            const name = conn.metadata.name;
            console.log(`${name} connected.`);

            conn.on('open', () => {
                universeState = handleUFuncResult(onNew(universeState, conn));
            })

            conn.on('data', (data) => {
                console.log(`${name}: ${data}`);
                universeState = handleUFuncResult(onMessage(universeState, conn, data));
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
}