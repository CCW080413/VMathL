class ExponentialLogarithmVisualizer {
    constructor() {
        this.canvas = document.getElementById('expLogCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.expBase = 2;
        this.expCoeff = 1;
        this.logBase = 2;

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

    update() {
        this.expBase = parseFloat(document.getElementById('exp-base').value) || 2;
        this.expCoeff = parseFloat(document.getElementById('exp-coeff').value) || 1;
        this.logBase = parseFloat(document.getElementById('log-base').value) || 2;

        this.updateInfoPanel();
        this.draw();
    }

    exponential(x) {
        return Math.pow(this.expBase, this.expCoeff * x);
    }

    logarithm(x) {
        if (x <= 0) return null;
        return Math.log(x) / Math.log(this.logBase);
    }

    updateInfoPanel() {
        document.getElementById('exp-info').textContent =
            `y = ${this.expBase}^(${this.expCoeff}x)`;
        document.getElementById('log-info').textContent =
            `y = log₍${this.logBase.toFixed(1)}₎(x)`;
        document.getElementById('exp-prop').textContent =
            `${this.expBase} > 0 且 ≠ 1`;
        document.getElementById('log-prop').textContent =
            `${this.logBase} > 0 且 ≠ 1`;

        const expAt1 = this.exponential(1).toFixed(2);
        document.getElementById('exp-at-1').textContent = `y = ${expAt1}`;

        document.getElementById('log-at-base').textContent = `y = 1`;
        document.getElementById('inverse-info').textContent =
            `关于 y = x 对称`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawExponential();
        this.drawLogarithm();
        this.drawInverseLine();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;

        for (let i = -8; i <= 8; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + i * this.scale, 0);
            this.ctx.lineTo(this.centerX + i * this.scale, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, this.centerY - i * this.scale);
            this.ctx.lineTo(this.canvas.width, this.centerY - i * this.scale);
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

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('x', this.canvas.width - 30, this.centerY - 10);
        this.ctx.fillText('y', this.centerX + 10, 20);
    }

    drawExponential() {
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let first = true;
        for (let x = -5; x <= 5; x += 0.05) {
            const y = this.exponential(x);
            if (y > -10 && y < 10) {
                const canvasX = this.centerX + x * this.scale;
                const canvasY = this.centerY - y * this.scale;

                if (first) {
                    this.ctx.moveTo(canvasX, canvasY);
                    first = false;
                } else {
                    this.ctx.lineTo(canvasX, canvasY);
                }
            }
        }
        this.ctx.stroke();

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('指数', this.canvas.width - 100, 30);
    }

    drawLogarithm() {
        this.ctx.strokeStyle = '#34c759';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let first = true;
        for (let x = 0.1; x <= 10; x += 0.05) {
            const y = this.logarithm(x);
            if (y !== null && y > -10 && y < 10) {
                const canvasX = this.centerX + x * this.scale;
                const canvasY = this.centerY - y * this.scale;

                if (first) {
                    this.ctx.moveTo(canvasX, canvasY);
                    first = false;
                } else {
                    this.ctx.lineTo(canvasX, canvasY);
                }
            }
        }
        this.ctx.stroke();

        this.ctx.fillStyle = '#34c759';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('对数', 30, this.canvas.height - 20);
    }

    drawInverseLine() {
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }
}

window.addEventListener('load', () => {
    const visualizer = new ExponentialLogarithmVisualizer();
    window.updateExpLog = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
