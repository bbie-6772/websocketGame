import Player from "./assets/js/class/player.js";
import MonstersController from "./assets/js/class/monstersController.js";
import BulletsController from "./assets/js/class/bulletsController.js";
import ItemsController from "./assets/js/class/itemsController.js";
import Score from "./assets/js/class/score.js";
import Map from "./assets/js/class/map.js";
import { loadGameAssets, getGameAssets } from "./assets/js/assets.js"

/* 카메라(화면) 설정 */
// 보이는 화면 비율
const CAMERA_WIDTH = 1360
const CAMERA_HEIGHT = 745
/* map 기본값 */
// map 사이즈
const MAP_WIDTH = 2000
const MAP_HEIGHT = 2000
/* player 기본값 */
const PLAYER_WIDTH = 40
const PLAYER_HEIGHT = 60
const PLAYER_MAX_HEALTH = 3
const PLAYER_DAMAGE = 5
// 초당 이동속도(px/s)
const PLAYER_SPEED = 300
/* bullet 기본값 */
// 초당 발사속도
const BULLET_ATTACK_SPEED = 3;
// 총알 속도
const BULLET_SPEED = 600;
// 사거리
const BULLET_RANGE = 500;
const BULLET_SIZE = 20;
/* monster 기본값*/
// 10초당 스폰 속도
const MONSTER_SPAWN_SPEED = 5;
// 크기
const MONSTER_SIZE = 30;

const canvas = document.getElementById('gameCanvas');
// 캔버스에 그래픽을 그리거나 조작하는데 이용
const ctx = canvas.getContext('2d');
// 비율 확인
let scaleRatio = null;
// deltaTime 용 변수 
let previousTime = null;
let closestMonster = null;
let gameOver = false;
let player = null;
let camera = null;
let map = null;
let bullets = null
let monsters = null
let score = null 
let items = null
let stage = null
let unlockItem = null
let unlockMonster = null
// 게임에셋 불러오기
await loadGameAssets()

function createSprites() {
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
        mapHeightInGame
    )

    camera = new Map(
        ctx,
        cameraWidth,
        cameraHeight
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
        map
        map,
        scaleRatio
    )

    score = new Score(
        ctx, 
        scaleRatio
    );
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
    canvas.width = MAP_WIDTH * scaleRatio * 1.5;
    canvas.height = MAP_HEIGHT * scaleRatio * 1.5;
    createSprites();
    ctx.translate(-camera.startX, -camera.startY)
}

// 스테이지 이동
function stageMove(stage, time) {
    const stageInfo = getGameAssets().stages
    const data = stageInfo.data
    if (!stage?.level) {
        return data[0]
    } else {
        const nextStage = data.find((e) => e.level === stage.level+1) 
        if (nextStage?.time <= time) return nextStage
        else return stage
    }
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

setScreen()
window.addEventListener('resize', setScreen);

// 게임 Loop
function update(currentTime) {
    //deltaTime을 구하기 위한 로직
    // deltaTime = 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
    // 프레임 렌더링 속도 (단위: 초)
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(update);
        return;
    }
    const deltaTime = (currentTime - previousTime) * 0.001
    previousTime = currentTime;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 업데이트
    map.update(player.update(deltaTime), stage);
    monsters.update(player, deltaTime)
    items.update(deltaTime)
    score.update(stage, deltaTime)
 
    // 가까운몬스터 찾기
    closestMonster = bullets.findCloseMonster(player, monsters.monsters)
    bullets.update(player, closestMonster, deltaTime)

    // 그려주기
    map.draw();
    player.draw();
    monsters.draw();
    bullets.draw();
    items.draw();
    score.draw(player, camera);

    const [scorePoint, highScore, time] = score.getScore()

    //스테이지 이동
    stage = stageMove(stage, time)
    //해금
    unlocked(stage)
    items.updateItem(unlockItem)
    monsters.updateMonster(unlockMonster)


    // 플레이어 피격
    if (!player.isDamaged && monsters.colliedWith(player)) {
        player.damaged(1)
    }

    // 총알 충돌
    const monsterIdx = monsters.monsters.findIndex((monster) => bullets.colliedWith(monster))
    // 충돌이 일어났을 경우
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
        if (monsters.monsters[monsterIdx].health < 1) monsters.dead(items, unlockItem, monsterIdx)
    }

    // 아이템 획득
    if (items.colliedWith(player)) {
        const itemIndex = items.items.findIndex((item) => item.pickup === true)
        const item = items.items[itemIndex]
        // 아이템 스탯 적용 
        player.heal(item.heal)
        player.statUp(item.damage, item.speed)
        bullets.increaseAttackSpeed(item.attackSpeed)
        score.addScore(item.score)
    }

    // 게임오버
    if (!gameOver && player.health < 1) {
        alert('Game Over! Your score: ' + Math.floor(scorePoint).toString().padStart(4, 0));
        gameOver = true;
        score.setHighScore()
        document.location.reload();
    }

    // 애니메이션화 60fps + 재귀호출로 반복
    requestAnimationFrame(update);
} 


// 키 맵핑
window.addEventListener('keydown', (e) => {player.keydown(e.key)});
window.addEventListener('keyup', (e) => {player.keyup(e.key)});
requestAnimationFrame(update);
