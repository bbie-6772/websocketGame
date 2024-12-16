import Monster from "./monster.js"

class MonstersController {
    //몬스터들 저장공간
    monsters = [];

    constructor(ctx, spawnSpeed) {
        this.ctx = ctx
        this.canvas = ctx.canvas
        // 스폰 시간
        this.spawnSpeed = spawnSpeed
        this.spawnCoolDown = 0;
    }

    createMonster() {
        const positionX = Math.random() * this.canvas.width;
        const positionY = Math.random() * this.canvas.height;
        const size = Math.trunc(Math.random() * 20) + 10;
        const monster = new Monster(this.ctx, positionX, positionY, size, size, 3, 1, 150, 10)

        this.monsters.push(monster)
    }

    // 타겟(플레이어)과 접촉 여부 확인
    colliedWith(target) {
        return this.monsters.some((monster) =>
            target.x < monster.x + monster.width &&
            // a의 오른쪽이 b의 왼쪽보다 오른쪽에 있을 때
            target.x + target.width > monster.x &&
            // a의 위가 b의 아래보다 위에 있을 때
            target.y < monster.y + monster.height &&
            // a의 아래가 b의 위보다 아래에 있을 때
            target.y + target.height > monster.y
        )
    }
        
    // 확장성을 위해 핸들러처럼 사용
    update(target, score, deltaTime) {
        // 스폰 시간에 맞춰 몬스터 스폰
        if (this.spawnCoolDown >= Math.trunc(100 / this.spawnSpeed)) {
            this.createMonster()
            this.spawnCoolDown = 0;
        }
        this.spawnCoolDown += deltaTime * 10
        

        this.monsters.forEach((monster, idx) => {
            // 죽었을 시 삭제
            if (monster.health < 1) this.dead(score, monster, idx)
            monster.update(target, deltaTime)
        })
    }

    updateSpawnSpeed(time) {
        this.spawnSpeed = time;
    }

    // 몬스터 하나 삭제
    dead(score, monster, idx) {
        score.addScore(monster.score)
        this.monsters.splice(idx, 1);
    }

    // 몬스터 전부 삭제
    reset() {
        this.monsters = [];
    }

    // 몬스터 그리기
    draw() {
        this.monsters.forEach((monster) => {monster.draw()})
    }

}

export default MonstersController