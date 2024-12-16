import Bullet from "./bullet.js";

class BulletsController {
    //몬스터들 저장공간
    bullets = [];

    constructor(ctx, attackSpeed) {
        this.ctx = ctx
        this.canvas = ctx.canvas
        //초당 몇번 공격
        this.attackSpeed = attackSpeed
        this.attackCoolDown = 0;
    }

    //총알 생성
    shootBullet(shooter, target) {
        if (target === null) return
        const positionX = shooter.x;
        const positionY = shooter.y;
        const angle = Math.atan2(target.y - shooter.y, target.x - shooter.x)
        const size = 10
        const bullet = new Bullet(this.ctx, positionX, positionY, size, size, shooter.damage, 100, angle)

        this.bullets.push(bullet)
    }

    //가장 가까운 몬스터 찾기
    findCloseMonster(shooter, targets) {
        let closestTarget = null;
        let closestDistance = Infinity;
        targets.forEach((target) => {
            const dx = target.x - shooter.x;
            const dy = target.y - shooter.y;
            const distance = Math.hypot(dx, dy);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        })
        return closestTarget
    }

    // 타겟과 접촉 여부 확인
    colliedWith(target) {
        return this.bullets.some((bullet, idx) => {
            // a의 왼쪽이 b의 오른쪽보다 왼쪽에 있을 때
            if (target.x < bullet.x + bullet.width &&
                // a의 오른쪽이 b의 왼쪽보다 오른쪽에 있을 때
                target.x + target.width > bullet.x &&
                // a의 위가 b의 아래보다 위에 있을 때
                target.y < bullet.y + bullet.height &&
                // a의 아래가 b의 위보다 아래에 있을 때
                target.y + target.height > bullet.y) {
                bullet.hitOrOut = true
            }
            return bullet.hitOrOut
        })
    }

    updateAttackSpeed(time) {
        this.attackSpeed = time;
    }

    // 총알 하나 삭제
    delete(idx) {
        this.bullets.splice(idx, 1);
    }

    // 총알 전체 삭제
    reset() {
        this.bullets = [];
    }

    // 총알 그리기
    draw() {
        this.bullets.forEach((bullet) => bullet.draw())
    }

    // 확장성을 위해 핸들러처럼 사용
    update(shooter, target, deltaTime) {
        //공격속도를 이용해 공격
        if (this.attackCoolDown >= Math.trunc(100 / this.attackSpeed)) {
            this.shootBullet(shooter, target)
            this.attackCoolDown = 0;
        }
        this.attackCoolDown += deltaTime * 100

        for (let i = 0; i < this.bullets.length; i++) {
            // 맞거나 화면 밖으로 나갈 시 삭제
            if (this.bullets[i].hitOrOut) this.delete(i)
            this.bullets[i]?.update(deltaTime)
        }
    }

}

export default BulletsController