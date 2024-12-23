class Item {
    constructor(ctx, positionX, positionY, width, height, id, damage, health, attackSpeed, speed, score, color, prob, scaleRatio) {
        this.ctx = ctx
        this.canvas = ctx.canvas;
        this.x = positionX;
        this.y = positionY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.damage = damage;
        this.health = health;
        this.attackSpeed = attackSpeed
        this.speed = speed;
        this.score = score;
        this.pickup = false;
        this.color = color
        this.scaleRatio = scaleRatio
        this.prob = prob
    }

    // 확장성을 위해 핸들러처럼 사용
    update(map, deltaTime) {
        if ( this.x < map.startX 
            || this.x > map.startX + map.width
            || this.y < map.startY
            || this.y > map.startY + map.height) this.pickup = true;
    }

    // 아이템 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath()
        this.ctx.roundRect(this.x, this.y, this.width, this.height, 50 * this.scaleRatio);
        this.ctx.fill();
    }

}

export default Item