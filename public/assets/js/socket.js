import { CLIENT_VERSION } from "./constants.js";

// 채팅창 AI 다수 활용 + 해석은 해야지..
// DOM 요소 선택  
let chatToggle = null;
let chatOverlay = null;
let chatClose = null;
let chatInput = null;
let chatSend = null;
let chatMessages = null;

document.addEventListener('DOMContentLoaded', () => {  
    chatToggle = document.getElementById('chatToggle');
    chatOverlay = document.getElementById('chatOverlay');
    chatClose = document.getElementById('chatClose');
    chatInput = document.getElementById('chatInput');
    chatSend = document.getElementById('chatSend');
    chatMessages = document.querySelector('.chat-messages');

    // 채팅창 토글  
    chatToggle.addEventListener('click', () => {
        chatOverlay.classList.remove('hidden');
    });

    // 채팅창 닫기  
    chatClose.addEventListener('click', () => {
        chatOverlay.classList.add('hidden');
    });

    // 메시지 전송 함수  
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            sendEvent(21, message)
            // 입력창 초기화  
            chatInput.value = '';
        }
    }

    // 메시지 전송 이벤트 리스너  
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
})

// localhost:3000 에 연결하여 CLIENT_VERSION을 넘겨줌
const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
    },
});

// 클라이언트에서 저장해둘 userId 선언
let userId = null;

socket.on('response', (data) => {
    console.log(data)
    // 응답이 올바르지 않을 시 내쫓기
    if (data.status !== "success") window.location.href = 'serverError.html'

    if (data.msg) {
        if (data.id === userId){
            // 사용자 메시지 추가  
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'flex justify-end';
            userMessageDiv.innerHTML = `  
                    <div class="bg-blue-500 text-white p-2 rounded-lg max-w-[70%]">  
                        ${data.msg}  
                    </div>  
                `;
            chatMessages.appendChild(userMessageDiv);
            // 스크롤 맨 아래로  
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            // 다른 사람 메시지
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'flex justify-start';
            botMessageDiv.innerHTML = `  
                    <div class="bg-gray-100 text-black p-2 rounded-lg max-w-[70%]">  
                         ${data.msg}  
                    </div>  
                `;
            chatMessages.appendChild(botMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
    }
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


export { sendEvent, };