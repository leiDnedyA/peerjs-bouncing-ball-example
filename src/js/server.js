/**
 * List of connections
 * First element in list = current ball holder
*/

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

universe([], {onNew: addWorld, onMessage: nextBall});