class CalculusVisualizer {
    constructor() {
        this.canvas = document.getElementById('calculusCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.funcType = 'quadratic';
        this.tangentX = 1;

        const slider = document.getElementById('tangent-x');
        slider.addEventListener('input', (e) => {
            document.getElementById('tangent-x-input').value = e.target.value;
            this.update();
        });

        document.getElementById('tangent-x-input').addEventListener('change', (e) => {
            document.getElementById('tangent-x').value = e.target.value;
            this.update();
        });

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

    evaluateFunction(x) {
        switch (this.funcType) {
            case 'quadratic': return x * x;
            case 'cubic': return x ** 3 - 2 * x;
            case 'sine': return Math.sin(x);
            default: return x * x;
        }
    }

    evaluateDerivative(x) {
        const h = 0.0001;
        return (this.evaluateFunction(x + h) - this.evaluateFunction(x - h)) / (2 * h);
    }

    update() {
        this.funcType = document.getElementById('func-select').value;
        this.tangentX = parseFloat(document.getElementById('tangent-x-input').value) || 0;

        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        const y = this.evaluateFunction(this.tangentX);
        const derivative = this.evaluateDerivative(this.tangentX);
        const funcName = this.funcType === 'quadratic' ? 'x²' :
            this.funcType === 'cubic' ? 'x³ - 2x' : 'sin(x)';

        document.getElementById('func-value').textContent =
            `f(${this.tangentX.toFixed(2)}) = ${y.toFixed(4)}`;
        document.getElementById('derivative-value').textContent =
            `f'(${this.tangentX.toFixed(2)}) = ${derivative.toFixed(4)}`;

        const c = y - derivative * this.tangentX;
        document.getElementById('tangent-line').textContent =
            `y = ${derivative.toFixed(3)}x + ${c.toFixed(3)}`;

        document.getElementById('integral-info').textContent =
            `对 ${funcName} 积分`;

        document.getElementById('indefinite-int').textContent =
            `∫ f(x)dx 的原函数`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawCurve();
        this.drawTangentLine();
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
    }

    drawCurve() {
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let first = true;
        for (let x = -3; x <= 3; x += 0.05) {
            const y = this.evaluateFunction(x);
            const canvasX = this.centerX + x * this.scale;
            const canvasY = this.centerY - y * this.scale;

            if (canvasY >= 0 && canvasY <= this.canvas.height) {
                if (first) {
                    this.ctx.moveTo(canvasX, canvasY);
                    first = false;
                } else {
                    this.ctx.lineTo(canvasX, canvasY);
                }
            }
        }
        this.ctx.stroke();
    }

    drawTangentLine() {
        const y = this.evaluateFunction(this.tangentX);
        const derivative = this.evaluateDerivative(this.tangentX);

        const x1 = -3;
        const y1 = derivative * x1 + (y - derivative * this.tangentX);
        const x2 = 3;
        const y2 = derivative * x2 + (y - derivative * this.tangentX);

        this.ctx.strokeStyle = '#ff3b30';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + x1 * this.scale, this.centerY - y1 * this.scale);
        this.ctx.lineTo(this.centerX + x2 * this.scale, this.centerY - y2 * this.scale);
        this.ctx.stroke();

        // 标记切点
        const pointX = this.centerX + this.tangentX * this.scale;
        const pointY = this.centerY - y * this.scale;
        this.ctx.fillStyle = '#ff3b30';
        this.ctx.beginPath();
        this.ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

window.addEventListener('load', () => {
    new CalculusVisualizer();
});

function updateCalculus() {
    document.dispatchEvent(new Event('updateCalculus'));
}

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
