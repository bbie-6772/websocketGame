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
        this.highScore = Math.max(Number(localStorage.getItem(this.HIGH_SCORE_KEY)), Math.trunc(this.score));
        this.stage = stage?.level
    }

    setScorePs(scorePerSecond) {
        this.scorePs = scorePerSecond
    }

    addScore(score) {
        this.score += score;
    }

    getScore() {
        return [this.score, this.highScore, this.time];
    }

    setHighScore() {
        const getHighScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > getHighScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    draw(player,map) {
        const x = player.x - (map.width/2 - 5)
        const fontSize = 40 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = "rgb(12, 237, 204)";

        const timeY = player.y - (map.height/2 - 40)
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
