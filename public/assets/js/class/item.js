class Item {
    constructor(ctx, positionX, positionY, width, height, id, damage, heal, attackSpeed, speed, score,color) {
        this.ctx = ctx
        this.canvas = ctx.canvas;
        this.x = positionX;
        this.y = positionY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.damaged = damage;
        this.heal = heal;
        this.attackSpeed = attackSpeed
        this.speed = speed;
        this.score = score;
        this.pickup = false;
        this.color = color
    }

    // 확장성을 위해 핸들러처럼 사용
    update(deltaTime) {
    }

    // 아이템 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Item