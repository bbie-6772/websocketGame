class Bullet {
    constructor(ctx, x, y, width, height, damage, speed, angle) {
        this.ctx = ctx
        this.canvas = ctx.canvas
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.damage = damage
        this.speed = speed
        this.angle = angle
        this.hitOrOut = false;
    }

    // 확장성을 위해 핸들러처럼 사용
    update(deltaTime) {
        this.moving(deltaTime)
    }

    // 움직임
    moving(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime
        this.y += Math.sin(this.angle) * this.speed * deltaTime
        this.hitOrOut = this.y > this.canvas.height || this.x > this.canvas.width
    }

    // 총알 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Bullet