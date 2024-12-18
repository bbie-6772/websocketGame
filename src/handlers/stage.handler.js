import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js"


export const moveStageHandler = (userId, payload) => {

    // 서버 내 유저의 스테이지 존재 확인
    let currentStages = getStage(userId)
    if (!currentStages?.length) return { 
            status: "fail", 
            message: "No stages found for user"
        }

    // 내림차순 정렬로 가장 큰 숫자가 현재 스테이지이므로 확인가능
    currentStages.sort((a, b) => a.level - b.level);
    const currentStage = currentStages[currentStages.length -1]
    // 데이터 가져오기
    const { stages } = getGameAssets();

    // 서버<>클라이언트 검증 과정 - 현재 stage 확인
    const currentStageTime = stages.data.reduce((acc, cur) => { 
        if (cur.level === payload.currentStage) acc += cur.time
        if (cur.level === payload.currentStage - 1) acc -= cur.time
    })
    if (currentStage.level !== payload.currentStage) return {
            status: "fail",
            message: "Current Stage mismatch"
        }

    // 서버<>클라이언트 검증 과정 - 다음 스테이지 확인
    const nextStage = stages.data.find((stage) => stage.level === payload.targetStage)
    if (!nextStage) return {
            status: "fail",
            message: "Target stage not found"
        }

    // 시간 검증
    const serverTime = Date.now();
    // 클라이언트의 스테이지 클리어 시간 확인 (ms => s)
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000
    // 추가로 지연시간으로 오차범위로 5초 까지 인정
    if (elapsedTime < currentStageTime || elapsedTime > currentStageTime + 5) return { 
            status: "fail",
            message: "Invalid elapsed time"
        }
    
    setStage(userId, payload.targetStage, serverTime)

    return { status: "success"}
}