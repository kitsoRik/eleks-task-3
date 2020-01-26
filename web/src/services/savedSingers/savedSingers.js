let singers = [];

export function hasSinger(id) {
    singers.forEach(singer => {
        if(singer.id === id) return true;
    });
    return false;
}

export function getSinger(id) {
    singers.forEach(singer => {
        if(singer.id === id) return singer;
    });
    return null;
}

export function saveSinger(singer) {
    singers.push(singer);
}