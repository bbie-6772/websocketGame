class Map {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.startX = Math.trunc((this.canvas.width - this.width) / 2)
        this.startY = Math.trunc((this.canvas.height - this.height) / 2)
    }

    update([translateX, translateY]) {
        // 화면이동
        this.ctx.translate(-translateX, -translateY)
    }

    draw() {
        this.ctx.fillStyle ="rgb(130, 218, 162)"
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }
}

export default Map;