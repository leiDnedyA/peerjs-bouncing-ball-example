const peer = new Peer('server', {debug: 0});

/**
 * List of connections
 * First element in list -> current ball holder
 */
const universeState = [];

peer.on('connection', (conn) => {
    const name = conn.metadata.name;
    console.log(`${name} connected.`)

    universeState.push(conn);

    console.log(universeState)

    conn.on('data', (data) => {
        console.log(data);
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

    conn.peerConnection.onclose = removeConnection;

    conn.peerConnection.addEventListener(
        "connectionstatechange",
        (e) => {
            console.log(`state: ${conn.peerConnection.connectionState}`);
            switch(conn.peerConnection.connectionState) {
                case "failed":
                case "closed":
                case "disconnected":
                    removeConnection();
                    break;
                default:
                    break;
            }
        });

    conn.on('error', () => {
        console.log('error triggered');
    })
});