// 맵핑이 될 함수
export const handleChat = (uuid, payload) => {
    return { status: "success", id: uuid, msg: payload, broadcast: true };
};