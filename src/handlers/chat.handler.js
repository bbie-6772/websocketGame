import { getUser } from "../models/user.model.js";

// 맵핑이 될 함수
export const handleChat = (uuid, payload) => {
    const user = getUser().find((e) => e.uuid === uuid)
    return { status: "success", id: uuid, nickname: user.nickname ,msg: payload, broadcast: true };
};