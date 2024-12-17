class Bullet {
    constructor(ctx, x, y, size, damage, speed, angle, scaleRatio) {
        this.ctx = ctx
        this.canvas = ctx.canvas
        this.x = x
        this.y = y
        this.width = size
        this.height = size
        this.damage = damage
        this.speed = speed
        this.angle = angle
        this.hitOrOut = false;
        this.scaleRatio = scaleRatio
        this.survivalTime = 2;
        this.currentTime = 0;
    }

    // 확장성을 위해 핸들러처럼 사용
    update(deltaTime) {
        this.moving(deltaTime)
        this.currentTime += deltaTime 
        // 시간이 지나면 소멸되도록 설정
        this.hitOrOut = this.survivalTime <= this.currentTime
    }

    // 움직임
    moving(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime * this.scaleRatio
        this.y += Math.sin(this.angle) * this.speed * deltaTime * this.scaleRatio
        this.hitOrOut = this.y > this.canvas.height || this.x > this.canvas.width
    }

    // 총알 나타내기
    draw() {
        this.ctx.fillStyle = 'orange';
        this.ctx.fillRect(this.x-1, this.y-1, this.width+2, this.height+2);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Bullet