import { CLIENT_VERSION } from './Constants.js';

// localhost:3000 에 연결하여 CLIENT_VERSION을 넘겨줌
const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
    },
});

// 클라이언트에서 저장해둘 userId 선언 
let userId = null;

// response로 받아온 데이터들을 console에 출력
socket.on('response', (data) => {
    console.log(data);
});

// 서버에 연결되었을 시, console에 출력하며 userId를 저장
socket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
});

// 클라이언트에서 총합적으로 server에 보내주는걸 관리
const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
        userId,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload,
    });
};

export { sendEvent };