// 서버에 메모리형식으로 접속되어있는 user들의 현재 stages 저장
const stages = {};

// stage reset
export const createStage = (uuid)=> {
    stages[uuid] = [];
}

// stage get,set

export const getStage = (uuid) => {
    return stages[uuid]
}

export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp })
}