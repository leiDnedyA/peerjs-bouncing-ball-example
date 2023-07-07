
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

    const debugOptions = {
        noLogs: 0,
        logErrors: 1,
        logErrorsAndWarnings: 2,
        logAll: 3
    }

    const peer = new Peer('server', { debug: debugOptions.noLogs });

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

            
            /**
             * TODO: Figure out a way of implementing this
             *       that doesn't assume the universe state
             *       will be a list.
             * ref: https://docs.racket-lang.org/teachpack/2htdpuniverse.html#%28form._%28%28lib._2htdp%2Funiverse..rkt%29._on-disconnect%29%29
             * 
             */
            const removeConnection = () => {
                console.log(`${name} disconnected.`);

                for (i in universeState) {
                    currConn = universeState[i];
                    if (currConn.peer == conn.peer) {
                        universeState.splice(i, 1);
                    }
                }
            }

            // Handles connection close signaled by client (best case)
            conn.on('close', removeConnection);

            // Handles connection close when client goes missing (worst case)
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