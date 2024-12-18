class Map {
    constructor(ctx, width, height, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.color = "#FFFFFF"
        this.x = Math.trunc(this.canvas.width/2)
        this.y = Math.trunc(this.canvas.height / 2)
        this.startX = Math.trunc((this.canvas.width - this.width) / 2)
        this.startY = Math.trunc((this.canvas.height - this.height) / 2)
        this.scaleRatio = scaleRatio
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
        // this.ctx.fillStyle = this.color
        // this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
        const size = 200 * this.scaleRatio

        for (let y = 0; y < this.height; y += size) {
            for (let x = 0; x < this.width; x += size) {
                this.ctx.fillStyle = (x / size % 2 === y / size % 2) ? this.color : 'grey'; // 체크무늬 색상  
                this.ctx.fillRect(this.startX + x, this.startY + y, size, size); // 사각형 그리기  
            }
        }  
    }
}

export default Map;