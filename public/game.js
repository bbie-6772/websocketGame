import Player from "./assets/js/class/player.js";
import MonstersController from "./assets/js/class/monstersController.js";
import BulletsController from "./assets/js/class/bulletsController.js";
import ItemsController from "./assets/js/class/itemsController.js";
import Score from "./assets/js/class/score.js";
import Map from "./assets/js/class/map.js";
import { loadGameAssets, getGameAssets } from "./assets/js/assets.js"
import { sendEvent, getUser, getRank} from "./assets/js/socket.js"

/* 카메라(화면) 설정 */
// 보이는 화면 비율
const CAMERA_WIDTH = 1920
const CAMERA_HEIGHT = 1080
/* map 기본값 */
// map 사이즈
const MAP_WIDTH = 2500
const MAP_HEIGHT = 2500
/* player 기본값 */
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_MAX_HEALTH = 3;
const PLAYER_DAMAGE = 5;
// 초당 이동속도(px/s)
const PLAYER_SPEED = 300;
/* bullet 기본값 */
// 초당 발사속도
const BULLET_ATTACK_SPEED = 1;
// 총알 속도
const BULLET_SPEED = 1000;
// 사거리
const BULLET_RANGE = 400;
const BULLET_SIZE = 20;
/* monster 기본값*/
// 10초당 스폰 속도
const MONSTER_SPAWN_SPEED = 1;
// 크기
const MONSTER_SIZE = 30;
/* score 기본값 */
let USER_INFO = null;

const canvas = document.getElementById('gameCanvas');
// 캔버스에 그래픽을 그리거나 조작하는데 이용
const ctx = canvas.getContext('2d');
// 게임 요소
let player = null;
let camera = null;
let map = null;
let bullets = null
let monsters = null
let score = null
let items = null
let stage = null

// 조정 요소
let scaleRatio = null;
let previousTime = null;
let unlockItem = null
let unlockMonster = null
let gameOver = false;
let gameClear = false;
let isStart = true;
//재시작 이벤트 확인
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

// 게임에셋 불러오기
await loadGameAssets()

// 요소 생성
function createSprites() {
    // user 정보 가져오기
    USER_INFO = getUser()
    // 비율에 맞게 조정
    // 맵 크기
    const mapWidthInGame = MAP_WIDTH * scaleRatio;
    const mapHeightInGame = MAP_HEIGHT * scaleRatio;
    // 카메라 크기
    const cameraWidth = CAMERA_WIDTH * scaleRatio;
    const cameraHeight = CAMERA_HEIGHT * scaleRatio;
    // 유저 크기
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    // 총알 크기
    const bulletSizeInGame = BULLET_SIZE * scaleRatio
    const bulletRangeInGame = BULLET_RANGE * scaleRatio        
    // 몬스터 크기
    const monsterSizeInGame = MONSTER_SIZE * scaleRatio
    // 아이템 크기

    map = new Map(
        ctx,
        mapWidthInGame,
        mapHeightInGame,
        scaleRatio
    )

    camera = new Map(
        ctx,
        cameraWidth,
        cameraHeight,
        scaleRatio
    )

    player = new Player(
        ctx,
        map,
        playerWidthInGame,
        playerHeightInGame,
        PLAYER_MAX_HEALTH,
        PLAYER_DAMAGE,
        PLAYER_SPEED,
        scaleRatio
    );

    bullets = new BulletsController(
        ctx,
        map,
        BULLET_ATTACK_SPEED,
        BULLET_SPEED,
        bulletSizeInGame,
        bulletRangeInGame,
        scaleRatio
    )

    monsters = new MonstersController(
        ctx,
        map,
        MONSTER_SPAWN_SPEED,
        monsterSizeInGame,
        scaleRatio
    )

    items = new ItemsController(
        ctx,
        map,
        scaleRatio
    )

    score = new Score(
        ctx, 
        USER_INFO,
        scaleRatio
    );
    score.setUserId()
}

//비율 구하기
function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

    // 가로세로 비율을 계산하여 작은 높이/너비 를 구별하여 비율 반환
    if (screenWidth / screenHeight < CAMERA_WIDTH / CAMERA_HEIGHT) {
        return screenWidth / CAMERA_WIDTH;
    } else {
        return screenHeight / CAMERA_HEIGHT;
    }
}

// 화면 설정
function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = MAP_WIDTH * scaleRatio * 2;
    canvas.height = MAP_HEIGHT * scaleRatio * 2;
    createSprites();
    waitingToStart = true;
    // 카메라를 기준으로 중심이 되도록 설정
    ctx.setTransform(1, 0, 0, 1, -camera.startX, -camera.startY)

    setTimeout(() => {
        window.addEventListener('keyup', function (event) {
            // 채팅 입력창에서 발생한 이벤트는 무시  
            if (event.target.tagName === 'INPUT' && event.target.type === 'text') {
                return;
            }
            reset () 
        }, { once: true });
    }, 1000);
}

// 스테이지 이동
function stageMove(stage, time, scorePoint) {
    const stageInfo = getGameAssets().stages
    const data = stageInfo.data

    //1차 클라이언트 검증
    if (!stage?.level) return data[0]
        
    const nextStage = data.find((e) => e.level === stage.level+1) 
    if (nextStage?.time <= time) {
        sendEvent(11, { currentStage: stage.level, targetStage: nextStage.level, score: scorePoint })
        return nextStage
    }
    else return stage
}

// 해금요소 저장
function unlocked(stage) {
    const assets = getGameAssets()
    const unlockInfo = assets.unlock
    const itemInfo = assets.item
    const monsterInfo = assets.monster
    const data = [unlockInfo.data, itemInfo.data, monsterInfo.data ];

    const unlocked = data[0].filter((e) => stage.level >= e.stage_level).map((e) => e.target_id)
    // 해금 요소 저장
    unlockItem = data[1].findLast((e) => unlocked.includes(e.id))
    unlockMonster = data[2].findLast((e) => unlocked.includes(e.id))
}

// 게임오버 멘트
function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = 'black';
    const x = player.x - camera.width / 8;
    const y = player.y - camera.height / 5;
    ctx.fillText('GAME OVER', x, y);
}

// 게임클리어 멘트
function showGameClear() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = 'white';
    const x = player.x - camera.width / 8;
    const y = player.y - camera.height / 5;
    ctx.fillText('GAME CLEAR', x, y);
}

// 시작 확인 멘트
function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = 'black';
    const x = player.x - camera.width / 6;
    const y = player.y - camera.height / 5;
    ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

// 게임 초기화
function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    isStart = true;
    waitingToStart = false;
    stage = null

    player.reset(PLAYER_MAX_HEALTH, PLAYER_DAMAGE, PLAYER_SPEED);
    bullets.updateAttackSpeed(BULLET_ATTACK_SPEED)
    monsters.reset();
    items.reset();
    score.reset()
    map.reset()
    ctx.setTransform(1, 0, 0, 1, -camera.startX, -camera.startY)
}

// 게임 종료 시
function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;
        
        //입력 확인
        setTimeout(() => {
            window.addEventListener('keyup', () => reset(), { once: true });
        }, 1000);
    }
}

setScreen()
// 화면이 조절될 시 
window.addEventListener('resize', setScreen);
// 화면 방향 변경시
if (screen.orientation) screen.orientation.addEventListener('change', setScreen);


// 게임 Loop
function gameLoop(currentTime) {
    //deltaTime을 구하기 위한 로직
    // deltaTime = 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
    // 프레임 렌더링 속도 (단위: 초)
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const deltaTime = (currentTime - previousTime) * 0.001
    previousTime = currentTime;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 게임 오버, 시작 확인
    if (!gameOver && !gameClear && !waitingToStart) {
        // 게임 시작 보내기
        if(isStart) {
            isStart = false
            sendEvent(2, { timestamp: Date.now() })
        } 
        // 업데이트
        map.update(player.update(deltaTime), player, camera, stage);
        monsters.update(player, unlockItem, deltaTime)
        items.update(deltaTime)
        // 랭킹 , 최고점수 실시간 업데이트
        score.update(stage, getUser().highScore , getRank(),deltaTime)

        // 가까운몬스터 찾기
        bullets.update(player, monsters.monsters, deltaTime)
    }

    // 그려주기
    map.draw();
    player.draw();
    monsters.draw();
    bullets.draw();
    items.draw();
    score.draw(map, camera);

    const [scorePoint, highScore, time] = score.getScore()

    //스테이지 이동
    stage = stageMove(stage, time, scorePoint)
    //스테이지 당 획득점수 조절
    score.setScorePs(stage.scorePerSecond)
    monsters.updateSpawnSpeed(stage.spawn)
    //해금
    unlocked(stage)
    monsters.updateMonster(unlockMonster)

    // 플레이어 피격
    if (!player.isDamaged && monsters.colliedWith(player)) player.damaged(1)

    // 총알 충돌
    const monsterIdx = monsters.monsters.findIndex((monster) => bullets.colliedWith(monster))
    // 총알이 몬스터한테 맞았을 때
    if ( monsterIdx >= 0) { 
        //충돌한 총알 찾기
        const bulletIdx = bullets.bullets.findIndex((bullet) => bullet.hitOrOut === true)
        if (bullets.bullets[bulletIdx].hitOrOut) {
            const damage = bullets.bullets[bulletIdx].damage - monsters.monsters[monsterIdx].defense
            // 데미지 적용
            monsters.monsters[monsterIdx].damaged(damage)
            // 총탄 삭제
            bullets.delete(bulletIdx)
        }
        // 죽었는지 확인 + 아이템 정보
        if (monsters.monsters[monsterIdx].health < 1) monsters.dead(items, monsterIdx)
    }

    // 아이템 획득
    if (items.colliedWith(player)) {
        const itemIndex = items.items.findIndex((item) => item.pickup === true)
        const item = items.items[itemIndex]
        sendEvent(4, item)
        // 아이템 스탯 적용 
        player.heal(item.health)
        player.statUp(item.damage, item.speed)
        bullets.increaseAttackSpeed(item.attackSpeed)
        score.addScore(item.score)
    }

    // 게임 끝 
    // 게임 오버
    if (!gameOver && player.health < 1) {
        gameOver = true;
        sendEvent(3, { timestamp: Date.now(), score: Math.trunc(scorePoint) })
        setupGameReset()
    }
    // 클리어
    if (!gameClear && time >= 600) {
        gameClear = true;
        sendEvent(3, { timestamp: Date.now(), score: Math.trunc(scorePoint) })
        setupGameReset()
    }

    if (gameClear) showGameClear()
    if (gameOver) showGameOver()
    
    // 시작 대기
    if (waitingToStart) showStartGameText()

    // 애니메이션화 60fps + 재귀호출로 반복
    requestAnimationFrame(gameLoop);
} 

requestAnimationFrame(gameLoop);

// 키 맵핑
window.addEventListener('keydown', (e) => {player.keydown(e.key)});
window.addEventListener('keyup', (e) => {player.keyup(e.key)});


