import { addUser} from "../models/user.model.js"
//uuid 생성 버전4 
import { v4 as uuidv4 } from "uuid"
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";


const registerHandler = (io) => {
    // 모든 유저가 '연결' 시 콜백함수 실행
    io.on('connection', (socket) => {
        //uuid 생성
        const userUUID = uuidv4();
        //유저 추가
        addUser({ uuid: userUUID, socketId: socket.id});

        handleConnection(socket, userUUID)

        // '이벤트' 발생 시 맵핑 실행
        socket.on('event', (data) => handlerEvent(io, socket, data));
        // 유저가 '연결해제' 시 실행
        socket.on('disconnect', () => handleDisconnect(socket))

        socket.on('chat', (data) => handlerEvent(io, socket, data));
    })
}

export default registerHandler