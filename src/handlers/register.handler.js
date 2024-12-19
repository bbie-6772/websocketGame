import { addUser, getUser, setUserSocket } from "../models/user.model.js"
//uuid 생성 버전4 
import { v4 as uuidv4 } from "uuid"
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";
import { CLIENT_VERSION } from "../constant.js"
import { getRanking } from "../models/ranking.model.js";


const registerHandler = (io) => {
    // 모든 유저가 '연결' 시 콜백함수 실행
    io.on('connection', (socket) => {
        // 첫 접속 값 가져오기
        const information = socket.handshake.query
        // 접속 시 클라이언트 버전 확인
        if (!CLIENT_VERSION.includes(information.clientVersion)) socket.emit('response', { status: "fail" })

        // 접속 시 userId의 uuid 검증 후 uuid 생성
        const UUID = /^[{(]?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})[)}]?$/  

        const userUUID = UUID.test(information.userId) ? information.userId : uuidv4()
        const nickname = information?.nickname || null

        // 유저 확인
        let userInfo = getUser().find((e) => e.uuid === userUUID)
        // 서버에 유저가 없을 경우
        if (!userInfo) {
            userInfo = { uuid: userUUID, socketId: socket.id, nickname ,highScore: 0, itemScore: 0 }
            //유저 생성
            addUser(userInfo);
        } else {
            // 유저 수정
            setUserSocket(userUUID, socket.id, nickname)
        }

        // 만든 유저 정보를 클라이언트로 전달
        handleConnection(socket, userInfo)
        io.emit('rank', getRanking())

        // '이벤트' 발생 시 맵핑 실행
        socket.on('event', (data) => handlerEvent(io, socket, data));
        // 유저가 '연결해제' 시 실행
        socket.on('disconnect', () => handleDisconnect(socket))
    })
}

export default registerHandler