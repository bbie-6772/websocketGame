class Player {
    constructor(ctx, width, height, maxHealth, damage, speed) {
        // 메서드에 이용하기위해 부여받음
        this.ctx = ctx
        this.canvas = ctx.canvas
        this.x = this.canvas.width / 2
        this.y = this.canvas.height / 2
        // size를 넓이와 높이로 분리하여 변수로 지정
        this.width = width
        this.height = height
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.damage = damage
        this.speed = speed
        this.isDamaged = false;
        this.keys = {};
    }

    keydown(key) {
        this.keys[key] = true
    }
    keyup(key) {
        this.keys[key] = false
    }

    // 확장성을 위해 핸들러처럼 사용
    update(deltaTime) {
        this.moving(deltaTime)
    }

    // 피격당할 시
    damaged(damage)  {
        this.isDamaged = true
        if (this.health > damage) this.health -= damage > 0 ? damage : 0;
        else this.health = 0
        // 무적시간
        setInterval(() => this.isDamaged = false, 1500)
    }

    heal(heal) {
        if (this.maxHealth >= this.health + heal) {
            this.health += heal
        } else this.health = this.maxHealth
    }

    statUp(damage, speed) {
        this.damage += damage
        this.speed += speed
    }

    // 플레이어 움직임
    moving(deltaTime) {
        // 입력되는 값들을 배열로 저장
        const up = ["ArrowUp", "W", "w", "ㅈ"];
        const down = ["ArrowDown", "S", "s", "ㄴ"];
        const left = ["ArrowLeft", "A", "a", "ㅁ"];
        const right = ["ArrowRight", "D", "d", "ㅇ"];
        // keys 에 있는 입력 키들을 확인하기 위해 배열생성
        const keys = Object.keys(this.keys)
        // array.some과 array.includes를 통해 key가 입력되었는지 확인
        if (keys.some((e) => up.includes(e) && this.keys[e]) && this.y > 0)
            this.y -= this.speed * deltaTime;
        if (keys.some((e) => down.includes(e) && this.keys[e]) && this.y < this.canvas.height - this.height)
            this.y += this.speed * deltaTime;
        if (keys.some((e) => left.includes(e) && this.keys[e]) && this.x > 0)
            this.x -= this.speed * deltaTime;
        if (keys.some((e) => right.includes(e) && this.keys[e]) && this.x < this.canvas.width - this.width)
            this.x += this.speed * deltaTime;
    }

    // 플레이어 나타내기
    draw() {
        //플레이어
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        //체력바
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x, this.y - 10, this.height, 5);
        // 체력 1칸당 비율
        const healthPerUnit = this.width / this.maxHealth;
        // 체력바 그리기
        for (let i = 0; i < this.maxHealth; i++) {
            // 현재 체력 
            if (i < this.health) {
                this.ctx.fillStyle = 'green';
                this.ctx.fillRect(this.x + i * healthPerUnit, this.y - 10, healthPerUnit, 5);
            }
            if (i < this.maxHealth-1) {
                // 구분 줄
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(this.x + (i + 1) * healthPerUnit, this.y - 10, 2, 5);
            }
        }
    }

}

export default Player