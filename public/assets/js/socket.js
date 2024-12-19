import { CLIENT_VERSION } from "./constants.js";

// 채팅창 AI 다수 활용 + 해석은 해야지..
// DOM 요소 선택  
let chatToggle = null;
let chatOverlay = null;
let chatClose = null;
let chatInput = null;
let chatSend = null;
let chatMessages = null;
// 클라이언트에서 저장해둘 정보 선언
let userInfo = null
let rankings = null

// 채팅창 오버레이 관련
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

    chatInput.addEventListener('keyup', function (event) {
        // 이벤트 버블링 중지
        event.stopPropagation(); 
    });
})

// localhost:3000 에 서버를 연결하여 값을 넘겨줌
const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
        // 로컬에 저장된 id 정보를 같이 보냄
        userId: localStorage.getItem("userId") || null,
        nickname: localStorage.getItem("nickname") || null
    },
});

socket.once('connection', (data) => {
    userInfo = data
})

socket.on('response', (data) => {
    // 응답이 올바르지 않을 시 내쫓기
    if (data.status !== "success") window.location.href = 'serverError.html'
    // 최고 점수 갱신
    if (data.highScore) userInfo.highScore = data.highScore
    if (data.msg) {
        // 사용자 이름 확인
        const nicknameSpan = document.createElement('span');
        nicknameSpan.className = 'text-sm text-gray-600 mr-2 mb-1';  
        nicknameSpan.textContent = data?.nickname || "익명"
        if (data.id === userInfo.uuid){
            // 사용자 메시지 추가  
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'flex flex-col items-end mb-2';

            const messageDiv = document.createElement('div');
            messageDiv.className = 'bg-blue-500 text-white p-2 rounded-lg max-w-[70%]';
            messageDiv.textContent = data.msg;  
 
            userMessageDiv.appendChild(nicknameSpan); 
            userMessageDiv.appendChild(messageDiv);
            chatMessages.appendChild(userMessageDiv);
            // 스크롤 맨 아래로  
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            // 다른 사람 메시지
            const otherMessageDiv = document.createElement('div');
            otherMessageDiv.className = 'flex flex-col items-start mb-2';

            const messageDiv = document.createElement('div');
            messageDiv.className = "bg-gray-100 text-black p-2 rounded-lg max-w-[70%]";
            messageDiv.textContent = data.msg;  

            otherMessageDiv.appendChild(nicknameSpan);
            otherMessageDiv.appendChild(messageDiv);
            chatMessages.appendChild(otherMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// 랭킹 조회
socket.on('rank', (rank) => {
    rankings = rank
})

// 클라이언트에서 총합적으로 server에 보내주는걸 관리
export const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
        userId: userInfo.uuid,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload,
    });
};

export const getUser = () => {
    return userInfo
}

export const getRank = () => {
    return rankings
}