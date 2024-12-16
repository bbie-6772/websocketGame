import Item from "./item.js";

class ItemsController {
    // 아이템 저장공간
    items = [];

    constructor(ctx, spawnSpeed) {
        this.ctx = ctx
        this.canvas = ctx.canvas
        // 스폰 시간
        this.spawnSpeed = spawnSpeed
        this.spawnCoolDown = 0;
    }

    createItem() {
        const positionX = Math.random() * this.canvas.width;
        const positionY = Math.random() * this.canvas.height;
        const size = 15;
        const item = new Item(this.ctx, positionX, positionY, size, size, 0, 1, 10, 5)

        this.items.push(item)
    }

    // 타겟(플레이어)과 접촉 여부 확인
    colliedWith(target) {
        return this.items.some((item) =>
            item.pickup = target.x < item.x + item.width &&
            // a의 오른쪽이 b의 왼쪽보다 오른쪽에 있을 때
            target.x + target.width > item.x &&
            // a의 위가 b의 아래보다 위에 있을 때
            target.y < item.y + item.height &&
            // a의 아래가 b의 위보다 아래에 있을 때
            target.y + target.height > item.y
        )
    }

    // 확장성을 위해 핸들러처럼 사용
    update(deltaTime) {
        // 스폰 시간에 맞춰 아이템
        if (this.spawnCoolDown >= Math.trunc(100 / this.spawnSpeed)) {
            this.createItem()
            this.spawnCoolDown = 0;
        }
        this.spawnCoolDown += deltaTime * 10

        this.items.forEach((item, idx) => {
            item.update(deltaTime)
            // 획득 시 삭제
            if (item.pickup) this.delete(idx)
        })
    }

    // 아이템 하나 삭제
    delete(idx) {
        this.items.splice(idx, 1);
    }

    // 아이템 전부 삭제
    reset() {
        this.items = [];
    }

    // 몬스터 그리기
    draw() {
        this.items.forEach((item) => item.draw())
    }

}

export default ItemsController