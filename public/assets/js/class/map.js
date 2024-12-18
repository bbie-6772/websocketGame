class Map {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.color = "#FFFFFF"
        this.x = Math.trunc(this.canvas.width/2)
        this.y = Math.trunc(this.canvas.height / 2)
        this.startX = Math.trunc((this.canvas.width - this.width) / 2)
        this.startY = Math.trunc((this.canvas.height - this.height) / 2)
    }

    update([translateX, translateY], player, camera, stage) {
        // 색 지정
        this.color = stage?.color || this.color

        if (player.x > this.startX + camera.width/3
            && player.x < this.width + this.startX  - camera.width/3) {
                this.ctx.translate(-translateX, 0)
                this.x +=  translateX
            }

        if (player.y > this.startY + camera.height/3
            && player.y < this.height + this.startY - camera.height/3) {
                this.ctx.translate(0, -translateY)
                this.y += translateY
            }
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }
}

export default Map;