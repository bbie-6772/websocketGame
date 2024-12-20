// import { sendEvent } from "./Socket.js";

class Score {
    constructor(ctx, userInfo, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.stageChange = true;
        this.scorePs = 1;
        this.time = 0;
        this.score = 0;
        this.highScore = userInfo?.highScore || 0
        this.userId = userInfo?.uuid || null
        this.nickname = userInfo?.nickname || null
        this.stage = 0;
        this.rank = [];
    }

    update(stage, highScore, rank, deltaTime) {
        this.score += this.scorePs *deltaTime;
        this.time += deltaTime;
        this.highScore = Math.max(highScore, Math.trunc(this.score));
        this.stage = stage?.level
        this.rank = rank
    }

    addScore(score) {
        this.score += score;
    }

    setScorePs(scorePerSecond) {
        this.scorePs = scorePerSecond
    }

    setUserId() {
        localStorage.setItem("userId", this.userId);
    }

    getScore() {
        return [this.score, this.highScore, this.time];
    }

    reset() {
        this.time = 0;
        this.score = 0;
        this.stage = 0;
    }

    draw(map, camera) {
        //map.x 는 변환되는 값을 조정하여 화면의 중간을 알려줌
        const leftX = map.x - (camera.width/2 - 5)
        const fontSize = 40 * this.scaleRatio;
        const timeY = map.y - (camera.height / 2 - 40 * this.scaleRatio)
        const scoreY = timeY + 40 * this.scaleRatio;
        const highScoreY = scoreY + 40 * this.scaleRatio;
        const stageY = highScoreY + 40 * this.scaleRatio;
        const nicknameY = stageY + 40 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(5, 0);
        const highScorePadded = this.highScore.toString().padStart(5, 0);
        const minutes = Math.floor((this.time % 3600) / 60);
        const seconds = Math.floor(this.time % 60);
        const timePadded = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const rightX = map.x - camera.width / 20

        this.ctx.font = `${fontSize}px sans-serif `;
        this.ctx.fillStyle = "rgb(67, 20, 255)";

        for (let i = 0;i < this.rank?.length;i++){
            this.ctx.fillText(`Rank ${i+1} : ${this.rank[i][0]} / score: ${this.rank[i][1]}`, rightX, map.y - (camera.height / 2 -(i+1) * 40 * this.scaleRatio));
        }

        this.ctx.font = `bold ${fontSize}px sans-serif `;
        this.ctx.fillStyle = "rgb(0, 0, 0)";

        this.ctx.fillText(`Time: ${timePadded}`, leftX, timeY);
        this.ctx.fillText(`Score: ${scorePadded}`, leftX, scoreY);
        this.ctx.fillText(`High-Score: ${highScorePadded}`,leftX, highScoreY);
        this.ctx.fillText(`Stage: ${this.stage}`, leftX, stageY);
        this.ctx.fillText(`Nickname: ${this.nickname}`, leftX, nicknameY);
    }
}

export default Score;
