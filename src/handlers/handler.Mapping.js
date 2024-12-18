import { gameEnd, gameStart, getItem } from "./game.handler.js";
import { moveStageHandler } from "./stage.handler.js";
import { handleChat } from "./chat.handler.js";

// key - value 형식으로 알맞은 key값에 매칭되는 handler를 반환
const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    4: getItem,
    11: moveStageHandler,
    21: handleChat
}

export default handlerMappings