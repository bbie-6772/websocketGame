import Item from "./item.js";

class ItemsController {
    // 아이템 저장공간
    items = [];

    constructor(ctx, map, scaleRatio) {
        this.ctx = ctx
        this.itemStat = null
        this.canvas = map
        this.scaleRatio = scaleRatio
    }

    createItem(x, y, item) {
        const {id, score, health, damage, attackSpeed, speed, prob, color} = item 
        const size = 30 * this.scaleRatio
        const createdItem = new Item(this.ctx, x, y, size, size, id, damage, health, attackSpeed, speed, score, color, prob, this.scaleRatio)

        this.items.push(createdItem)
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
    update(map, deltaTime) {
        this.items.forEach((item, idx) => {
            item.update(map, deltaTime)
            // 획득 시 삭제
            if (item.pickup) this.delete(idx)
        })
    }

    updateItem(itemStat) {
        this.itemStat = itemStat
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