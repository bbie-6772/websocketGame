import { CLIENT_VERSION } from "../constant.js"
import { getUser, removeUser } from "../models/user.model.js"
import handlerMappings from "./handler.Mapping.js"

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id)
    console.log('User disconnected: ',socket.id)
    console.log('Current users: ',getUser())
}

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected: ${uuid} with socket Id ${socket.id}` );
    console.log('Current users: ', getUser())

    //유저와 연결되면 uuid를 메세지로 전달
    socket.emit('connection', {uuid})
}

export const handlerEvent = (io, socket, data) => {
    //클라이언트 버전 확인
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { 
            status: "fail",
            message: "Client version not found"
        });
        return;
    }

    const handler = handlerMappings[data.handlerId]
    if (!handler) {
        socket.emit('response', {
            status : "fail",
            message: "Handler not found"
        })
        return;
    }

    const response = handler(data.userId, data.payload);

    // 서버 전 유저에게 알림
    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }
    // 대상 유저에게만 보냄
    socket.emit('response', response);
}