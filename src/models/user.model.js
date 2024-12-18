// 서버에 메모리형식으로 접속되어있는 users 저장
const users = [];

// users에 접근하는 함수들
// users setter
export const addUser = (user) => {
    users.push(user)
}
export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    // socketId를 통해 찾았을 경우 삭제하고 그 id값을 반환
    if (index !== -1) return users.splice(index, 1);
}
// users getter
export const getUser = () => {
    return users
}