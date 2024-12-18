import { getGameAssets } from "../init/assets.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";

let itemScore = 0;

export const gameStart = (uuid, payload) => {
    const { stages: stageInfo,} = getGameAssets();

    //스테이지 초기화
    createStage(uuid);

    // 첫번째 stage의 정보로 setStage
    /*  payload.timestamp의 경우 원래는 클라이언트에서 들어온 정보이기에 
        서버에 바로 들이면 보안성 부분에서 문제가 일어날 수 있음   */
    setStage(uuid, stageInfo.data[0].level, payload.timestamp)

    console.log("Stage: ", getStage(uuid))

    return { status: "success"}
}

export const gameEnd = (uuid, payload) => {

    const { stages: stageInfo } = getGameAssets();
    const { timestamp: gameEndTime, score} = payload;
    // 스테이지 정보 확인
    const stages = getStage(uuid)
    if (!stages?.length) return {
            status: "fail",
            message: "No stages found for user"
        }

    let totalScore = itemScore;

    stages.forEach((stage, index) => {
        // 서버의 스테이지 초당 점수 가져오기 
        const scorePerSecond = stageInfo.data.find((e) => e.level === stage.level).scorePerSecond
        let stageEndTime;
        // 마지막 스테이지일 경우 마지막 시간을,
        if (index === stages.length -1) {
            stageEndTime = gameEndTime;
        // 아닐 경우 이전 스테이지의 시간을 가져옴
        } else {
            stageEndTime = stages[index+1].timestamp
        }

        // 스테이지당 머문시간 확인 (ms => s)
        const stageDuration = (stageEndTime - stage.timestamp) / 1000
        totalScore += stageDuration * scorePerSecond
    })

    // 점수, 타임스탬프 검증 (오차범위 +-5까지 인정)
    if (Math.abs(score - totalScore) > 5) return {
            status: "fail",
            message: "Score verification failed"
        }

    //스테이지 초기화
    createStage(uuid);

    return { 
        status: "success",
        message: "Game ended",
        score
    }
}

export const getItem = (uuid,payload) => {
    const { unlock: unlockInfo, item: itemInfo} = getGameAssets();
    const { id, score, health, damage, speed, attackSpeed, prob } = payload

    // 스테이지 정보 확인
    const stages = getStage(uuid)
    if (!stages?.length) return {
        status: "fail",
        message: "No stages found for user"
    }

    // 현재 스테이지 레벨 확인
    stages.sort((a, b) => a.level - b.level);
    const currentStage = stages[stages.length - 1]

    // 스테이지와 비교해서 언락된 아이템인지 확인
    const unlocked = unlockInfo.data.find((unlock) => unlock.target_id === id)
    if (!unlocked || unlocked?.stage_level > currentStage.level) return {
        status: "fail",
        message: "Not unlocked item"
    }

    // 아이템 검증
    const item = itemInfo.data.find((item) => item.id === id)
    if (!item
        || item?.score !== score
        || item?.health !== health
        || item?.damage !== damage
        || item?.speed !== speed
        || item?.attackSpeed !== attackSpeed
        || item?.prob !== prob
    ) return {
        status: "fail",
        message: "Item verification failed"
    }

    //점수 검증때 사용
    itemScore += score

    return {
        status: "success"
    }
}