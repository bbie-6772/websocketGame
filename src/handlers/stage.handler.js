import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js"


export const moveStageHandler = (userId, payload) => {

    let currentStages = getStage(userId)
    if (!currentStages.length) {
        return { 
            status: "fail", 
            message: "No stages found for user"
        }
    }

    // 내림차순 정렬로 가장 큰 숫자가 현재 스테이지이므로 확인가능
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length -1]

    // 서버<>클라이언트 검증 과정 - 현재 stage
    if (currentStage.id !== payload.currentStage) {
        return {
            status: "fail",
            message: "Current Stage mismatch"
        }
    }

    // 점수 검증
    const serverTime = Date.now();
    // 클라이언트의 스테이지 클리어 시간 확인 (ms => s)
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000
    // stage 1 => 2 과정에서 시간이 100s을 넘겨야됨
    // 추가로 지연시간으로 오차범위 5초 까지 인정
    if (elapsedTime < 100 || elapsedTime > 105) {
        return { 
            status: "fail",
            message: "Invalid elapsed time"
        }
    }

    // 서버<>클라이언트 검증 과정 - 다음 stage 유무
    const { stages } = getGameAssets();
    // Object.some() 메서드를 이용하여 includes와 비슷한 느낌으로 검증
    if(!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return {
            status: "fail",
            message: "Target stage not found"
        }
    }

    setStage(userId, payload.targetStage, serverTime)

    return { status: "success"}
}