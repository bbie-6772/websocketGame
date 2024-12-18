// import { sendEvent } from "./Socket.js";

class Score {

    HIGH_SCORE_KEY = 'highScore';

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.stageChange = true;
        this.scorePs = 1;
        this.time = 0;
        this.score = 0;
        this.highScore = 0;
        this.stage = 0;
    }

    update(stage, deltaTime) {
        this.score += this.scorePs *deltaTime;
        this.time += deltaTime;
        this.highScore = Math.max(this.highScore, Math.trunc(this.score));
        this.stage = stage?.level
    }

    addScore(score) {
        this.score += score;
    }

    setScorePs(scorePerSecond) {
        this.scorePs = scorePerSecond
    }

    setHighScore() {
        const getHighScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > getHighScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    getHighScore() {
        this.highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0
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
        const x = map.x - (camera.width/2 - 5)
        const fontSize = 40 * this.scaleRatio;
        this.ctx.font = `bold ${fontSize}px sans-serif `;
        this.ctx.fillStyle = "rgb(0, 0, 0)";

        const timeY = map.y - (camera.height / 2 - 40 * this.scaleRatio)
        const scoreY = timeY + 40 * this.scaleRatio;
        const highScoreY = scoreY + 40 * this.scaleRatio;
        const stageY = highScoreY + 40 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(5, 0);
        const highScorePadded = this.highScore.toString().padStart(5, 0);
        const minutes = Math.floor((this.time % 3600) / 60);
        const seconds = Math.floor(this.time % 60);
        const timePadded = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.ctx.fillText(`Time: ${timePadded}`, x, timeY);
        this.ctx.fillText(`Score: ${scorePadded}`, x, scoreY);
        this.ctx.fillText(`High-Score: ${highScorePadded}`,x, highScoreY);
        this.ctx.fillText(`Stage: ${this.stage}`, x, stageY);
    }
}

export default Score;
