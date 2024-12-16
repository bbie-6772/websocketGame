import Player from "./assets/js/class/player.js";
import MonstersController from "./assets/js/class/monstersController.js";
import BulletsController from "./assets/js/class/bulletsController.js";
import ItemsController from "./assets/js/class/itemsController.js";
import Score from "./assets/js/class/score.js";
import { loadGameAssets, getGameAssets } from "./assets/js/assets.js"

const canvas = document.getElementById('gameCanvas');
// 캔버스에 그래픽을 그리거나 조작하는데 이용
const ctx = canvas.getContext('2d');
// 크기 조정
canvas.width = 800;
canvas.height = 800;

let previousTime = null;
let closestMonster = null;
let gameOver = false;
let player = new Player(ctx,20,20,3,2,300)
// 10 초당 스폰율
let monsters = new MonstersController(ctx, 25)
// 초당 공격속도
let bullets = new BulletsController(ctx, 2)
// 10초당 스폰율 
let items = new ItemsController(ctx, 5)
let score = new Score(ctx, 1)
// 게임에셋 불러오기
loadGameAssets()

const { stages, unlock, item, monster } = getGameAssets()

// 시간 변환
function secondsToTime(totalSeconds) {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}  

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
    player.update(deltaTime);
    monsters.update(player, score, deltaTime)
    items.update(deltaTime)
    score.update(deltaTime)

    // 가까운몬스터 찾기
    closestMonster = bullets.findCloseMonster(player, monsters.monsters)
    bullets.update(player, closestMonster, deltaTime)

    // 그려주기
    player.draw();
    monsters.draw();
    bullets.draw();
    items.draw();

    // 플레이어 피격
    if (!player.isDamaged && monsters.colliedWith(player)) {
        player.damaged(1)
    }

    // 총알 충돌
    const monsterIdx = monsters.monsters.findIndex((monster) => bullets.colliedWith(monster))
    // 충돌이 일어났을 경우
    if ( monsterIdx !== -1) { 
        //충돌한 총알 찾기
        const bulletIdx = bullets.bullets.findIndex((bullet) => bullet.hitOrOut === true)
        const damage = bullets.bullets[bulletIdx].damage - monsters.monsters[monsterIdx].defense
        if (bullets.bullets[bulletIdx].hitOrOut) monsters.monsters[monsterIdx].damaged(damage)
    }

    // 아이템 획득
    if (items.colliedWith(player)) {
        const itemIndex = items.items.findIndex((item) => item.pickup === true)
        const item = items.items[itemIndex]
        // 아이템 스탯 적용 
        player.heal(item.heal)
        player.statUp(item.damage, item.speed)
        score.addScore(item.score)
    }

    // 게임오버
    if (!gameOver && player.health < 1) {
        alert('Game Over! Your score: ' + Math.floor(score.score).toString().padStart(4, 0));
        gameOver = true;
        document.location.reload();
    }

    // 플레이어 화면의 점수 업데이트
    document.getElementById('score').innerText = 'Score: ' + Math.floor(score.score).toString().padStart(4, 0);
    // 플레이어 화면의 시간 업데이트
    document.getElementById('time').innerText = 'Time: ' + secondsToTime(score.time);

    // 애니메이션화 60fps + 재귀호출로 반복
    requestAnimationFrame(update);
} 


// 키 맵핑
window.addEventListener('keydown', (e) => {player.keydown(e.key)});
window.addEventListener('keyup', (e) => {player.keyup(e.key)});
requestAnimationFrame(update);