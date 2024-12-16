class Monster {
    constructor(ctx, positionX, positionY, width, height, health, defense, speed, score) {
        this.ctx = ctx
        this.canvas = ctx.canvas;
        this.x = positionX;
        this.y = positionY;
        this.width = width;
        this.height = height;
        this.health = health;
        this.defense = defense;
        this.speed = speed;
        this.preDirection = 0;
        this.score = score;
    }

    // 확장성을 위해 핸들러처럼 사용
    update(target, deltaTime) {
        this.moving(target, deltaTime)
    }

    // 움직임
    moving(target, deltaTime) {
        const direction = Math.atan2(target.y - this.y, target.x - this.x)
        const currentDirection = direction * (180 / Math.PI)
        let accSpeed = 0;

        // 관성 적용
        if (this.preDirection === 0) {
            this.preDirection = currentDirection
        } else {
            // 방향 각도 차이가 30도 아래이면 가속
            if (Math.abs(this.preDirection - currentDirection) <= 30) {
                accSpeed = 20
                // 방향 각도 차이가 100도 이상이면 감속
            } else if (Math.abs(this.preDirection - currentDirection) > 100) {
                accSpeed = -10
                // 적절한 진로 변경은 상관 없음
            } else {
                accSpeed = 0
            }

            // 이동속도가 0이 되는 걸 방지
            if (this.speed + accSpeed < 0) {
                accSpeed = 1 - this.speed
            }
        }

        this.x += Math.cos(direction) * (this.speed + accSpeed) * deltaTime
        this.y += Math.sin(direction) * (this.speed + accSpeed) * deltaTime
    }

    // 피격당함
    damaged(damage) {
        if (this.health > damage) this.health -= damage > 0 ? damage : 0;
        else this.health = 0
    }

    // 몬스터 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Monster