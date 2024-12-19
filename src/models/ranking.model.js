import { getUser } from "./user.model.js";

// 서버에 메모리형식으로 접속되어있는 ranking 저장
let rankings = [];

export const loadRanking = () => {
    const rank = getUser().sort((a, b) => b.highScore - a.highScore).map((e) => {
        return [e.nickname, e.highScore]
    }).slice(0, 9)
    rankings = rank
}

export const getRanking = () => {
    return rankings
}