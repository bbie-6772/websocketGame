class Map {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.color = "FFFFFF"
        this.startX = Math.trunc((this.canvas.width - this.width) / 2)
        this.startY = Math.trunc((this.canvas.height - this.height) / 2)
    }

    update([translateX, translateY], stage) {
        // 화면이동
        this.color = stage?.color || this.color
        this.ctx.translate(-translateX, -translateY)
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }
}

export default Map;