// 서버에 메모리형식으로 접속되어있는 users 저장
const users = [];

// users에 접근하는 함수들
// users setter
export const addUser = (user) => {
    users.push(user)
}
export const setUserSocket = (uuid, socketId, nickname) => {
    const userIdx = users.findIndex((e) => e.uuid === uuid)
    if (userIdx !== -1) {
        users[userIdx].socketId = socketId
        users[userIdx].nickname = nickname
    }
}
// users getter
export const getUser = () => {
    return users
}

export const setItemScore = (uuid, Score) => {
    const userIdx = users.findIndex((e) => e.uuid === uuid)
    if (userIdx !== -1) users[userIdx].itemScore = Score
}

export const getItemScore = (uuid) =>{
    const userIdx = users.findIndex((e) => e.uuid === uuid)
    const user = users[userIdx]
    return user.itemScore
}

export const setHighSore = (uuid, highScore) => {
    const userIdx = users.findIndex((e) => e.uuid === uuid )
    const user = users[userIdx]
    if (user.highScore < highScore) users[userIdx].highScore = highScore 
}
