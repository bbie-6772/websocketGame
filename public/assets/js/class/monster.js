class Monster {
    constructor(ctx, positionX, positionY, width, height, id, health, defense, speed, scaleRatio, color) {
        this.ctx = ctx
        this.canvas = ctx.canvas;
        this.x = positionX;
        this.y = positionY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.health = health;
        this.defense = defense;
        this.speed = speed;
        this.preDirection = 0;
        this.directionTime = 0;
        this.accSpeed = 0;
        this.scaleRatio = scaleRatio
        this.isDamaged = false;
        this.color = color
    }

    // 확장성을 위해 핸들러처럼 사용
    update(target, deltaTime) {
        this.moving(target, deltaTime)
    }

    // 움직임
    moving(target, deltaTime) {
        const direction = Math.atan2(target.y - this.y, target.x - this.x)
        const currentDirection = Math.trunc(direction * 180 / Math.PI)
        this.directionTime += deltaTime

        // 1초마다 관성 적용
        if (this.preDirection === 0) {
            this.preDirection = currentDirection
        } else if (this.directionTime >= 1){
            // 방향 각도 차이가 30도 아래이면 가속
            if (Math.abs(this.preDirection - currentDirection) <= 30) {
                this.accSpeed = 30
                // 방향 각도 차이가 70도 이상이면 감속
            } else if (Math.abs(this.preDirection - currentDirection) > 70) {
                this.accSpeed = -30
                // 적절한 진로 변경은 상관 없음
            } else {
                this.accSpeed = 0
            }

            // 이동속도가 0이 되는 걸 방지
            if (this.speed + this.accSpeed < 0) {
                this.accSpeed = 1 - this.speed
            }
            this.preDirection = currentDirection
            this.directionTime = 0;
        }
        this.x += Math.cos(direction) * (this.speed + this.accSpeed) * deltaTime * this.scaleRatio
        this.y += Math.sin(direction) * (this.speed + this.accSpeed) * deltaTime * this.scaleRatio
    }

    // 피격당함
    damaged(damage) {
        if(!this.isDamaged) {
            this.isDamaged = true
            if (this.health > damage) this.health -= damage > 0 ? damage : 0;
            else this.health = 0
            this.isDamaged = false 
        }
    }

    // 몬스터 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Monster