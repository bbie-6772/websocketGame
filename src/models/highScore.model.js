const highScore = {};

// stage reset
export const createHighScore = (uuid)=> {
    highScore[uuid] = [];
}

// stage get,set
export const getHighScore = (uuid) => {
    return stages[uuid]
}

export const setStage = (uuid, highScore) => {
    return stages[uuid].push({ highScore })
}