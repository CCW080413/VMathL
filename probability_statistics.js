class StatsVisualizer {
    constructor() {
        this.canvas = document.getElementById('statsCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.mean = 0;
        this.stdDev = 1;
        this.sampleSize = 100;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.update();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.draw();
    }

    normalDistribution(x) {
        const exponent = -Math.pow(x - this.mean, 2) / (2 * Math.pow(this.stdDev, 2));
        return (1 / (this.stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }

    update() {
        this.mean = parseFloat(document.getElementById('mean').value) || 0;
        this.stdDev = parseFloat(document.getElementById('std-dev').value) || 1;
        this.sampleSize = parseInt(document.getElementById('sample-size').value) || 100;

        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        document.getElementById('normal-dist').textContent =
            `N(${this.mean}, ${this.stdDev}²)`;
        document.getElementById('mean-value').textContent =
            `μ = ${this.mean}`;
        document.getElementById('stddev-value').textContent =
            `σ = ${this.stdDev.toFixed(2)}`;

        const lower68 = (this.mean - this.stdDev).toFixed(2);
        const upper68 = (this.mean + this.stdDev).toFixed(2);
        document.getElementById('interval-68').textContent =
            `[${lower68}, ${upper68}]`;

        const lower95 = (this.mean - 2 * this.stdDev).toFixed(2);
        const upper95 = (this.mean + 2 * this.stdDev).toFixed(2);
        document.getElementById('interval-95').textContent =
            `[${lower95}, ${upper95}]`;

        const lower997 = (this.mean - 3 * this.stdDev).toFixed(2);
        const upper997 = (this.mean + 3 * this.stdDev).toFixed(2);
        document.getElementById('interval-997').textContent =
            `[${lower997}, ${upper997}]`;

        document.getElementById('sample-effect').textContent =
            `n = ${this.sampleSize}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawNormalCurve();
        this.drawIntervals();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;

        for (let i = -8; i <= 8; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + i * this.scale, 0);
            this.ctx.lineTo(this.centerX + i * this.scale, this.canvas.height);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();
    }

    drawNormalCurve() {
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        const maxValue = this.normalDistribution(this.mean);

        for (let x = this.mean - 4 * this.stdDev; x <= this.mean + 4 * this.stdDev; x += 0.05) {
            const y = this.normalDistribution(x);
            const canvasX = this.centerX + x * this.scale;
            const canvasY = this.centerY - y * 200 / maxValue;

            if (canvasY >= 0 && canvasY <= this.canvas.height) {
                if (Math.abs(x - (this.mean - 4 * this.stdDev)) < 0.1) {
                    this.ctx.moveTo(canvasX, canvasY);
                } else {
                    this.ctx.lineTo(canvasX, canvasY);
                }
            }
        }
        this.ctx.stroke();
    }

    drawIntervals() {
        const maxValue = this.normalDistribution(this.mean);

        // 68% 区间 (浅蓝)
        this.ctx.fillStyle = 'rgba(0, 113, 227, 0.1)';
        const x1_68 = this.mean - this.stdDev;
        const x2_68 = this.mean + this.stdDev;
        this.drawIntervalShade(x1_68, x2_68, maxValue);

        // 95% 区间 (浅绿)
        this.ctx.fillStyle = 'rgba(52, 199, 89, 0.08)';
        const x1_95 = this.mean - 2 * this.stdDev;
        const x2_95 = this.mean + 2 * this.stdDev;
        this.drawIntervalShade(x1_95, x2_95, maxValue);
    }

    drawIntervalShade(xMin, xMax, maxValue) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + xMin * this.scale, this.centerY);

        for (let x = xMin; x <= xMax; x += 0.05) {
            const y = this.normalDistribution(x);
            const canvasX = this.centerX + x * this.scale;
            const canvasY = this.centerY - y * 200 / maxValue;
            this.ctx.lineTo(canvasX, canvasY);
        }

        this.ctx.lineTo(this.centerX + xMax * this.scale, this.centerY);
        this.ctx.fill();
    }
}

window.addEventListener('load', () => {
    const visualizer = new StatsVisualizer();
    window.updateStats = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
