import { getGameAssets } from "../init/assets.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";


export const gameStart = (uuid, payload) => {
    // stage 정보 추출
    const { stages } = getGameAssets();

    //스테이지 초기화
    createStage(uuid);

    // 첫번째 stage의 정보로 setStage
    /*  payload.timestamp의 경우 원래는 클라이언트에서 들어온 정보이기에 
        서버에 바로 들이면 보안성 부분에서 문제가 일어날 수 있음   */
    setStage(uuid, stages.data[0].id, payload.timestamp)

    console.log("Stage: ", getStage(uuid))

    return { status: "success"}
}

export const gameEnd = (uuid, payload) => {
    const { timestamp: gameEndTime, score} = payload;
    // 스테이지 정보 불러오기
    const stages = getStage(uuid)
    if (!stages.length) {
        return {
            status: "fail",
            message: "No stages found for user"
        }
    }

    let totalScore = 0;

    stages.forEach((stage, index) => {
        let stageEndTime;
        // 마지막 스테이지일 경우 마지막 시간을,
        if (index === stages.length -1) {
            stageEndTime = gameEndTime;
        // 아닐 경우 이전 스테이지의 시간을 가져옴
        } else {
            stageEndTime = stage[index+1].timestamp
        }

        // 스테이지당 머문시간 확인 (ms => s)
        const stageDuration = (stageEndTime - stage.timestamp) / 1000
        totalScore += stageDuration
    })

    // 점수, 타임스탬프 검증 (오차범위 +-5까지 인정)
    if (Math.abs(score - totalScore) > 5) {
        return {
            status: "fail",
            message: "Score verification failed"
        }
    }

    return { 
        status: "success",
        message: "Game ended",
        score
    }
}