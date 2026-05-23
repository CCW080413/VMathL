class CoordinatesVisualizer {
    constructor() {
        this.canvas = document.getElementById('coordCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.pointA = { x: 2, y: 1 };
        this.pointB = { x: 4, y: 5 };
        this.lineSlope = 1;

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
        this.pointA.x = parseFloat(document.getElementById('point-ax').value) || 0;
        this.pointA.y = parseFloat(document.getElementById('point-ay').value) || 0;
        this.pointB.x = parseFloat(document.getElementById('point-bx').value) || 0;
        this.pointB.y = parseFloat(document.getElementById('point-by').value) || 0;
        this.lineSlope = parseFloat(document.getElementById('line-slope').value) || 1;

        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        const dx = this.pointB.x - this.pointA.x;
        const dy = this.pointB.y - this.pointA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        document.getElementById('distance').textContent =
            `d = ${distance.toFixed(2)}`;

        const midX = (this.pointA.x + this.pointB.x) / 2;
        const midY = (this.pointA.y + this.pointB.y) / 2;
        document.getElementById('midpoint').textContent =
            `M = (${midX.toFixed(2)}, ${midY.toFixed(2)})`;

        let slope;
        if (Math.abs(dx) < 0.0001) {
            slope = Infinity;
        } else {
            slope = dy / dx;
        }
        document.getElementById('slope').textContent =
            slope === Infinity ? `m = ∞ (竖直)` : `m = ${slope.toFixed(2)}`;

        document.getElementById('line-equation').textContent =
            `y - ${this.pointA.y} = ${this.lineSlope}(x - ${this.pointA.x})`;

        const b = this.pointA.y - this.lineSlope * this.pointA.x;
        document.getElementById('line-intercept').textContent =
            `y = ${this.lineSlope}x ${b >= 0 ? '+' : ''} ${b.toFixed(2)}`;

        if (Math.abs(this.lineSlope) < 0.0001) {
            document.getElementById('x-intercept').textContent = `x = 任意值`;
        } else {
            const xInt = -b / this.lineSlope;
            document.getElementById('x-intercept').textContent =
                `x = ${xInt.toFixed(2)}`;
        }

        document.getElementById('y-intercept').textContent =
            `y = ${b.toFixed(2)}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawPoints();
        this.drawLineAB();
        this.drawCustomLine();
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

    drawPoints() {
        const axCanvas = this.centerX + this.pointA.x * this.scale;
        const ayCanvas = this.centerY - this.pointA.y * this.scale;
        const bxCanvas = this.centerX + this.pointB.x * this.scale;
        const byCanvas = this.centerY - this.pointB.y * this.scale;

        this.ctx.fillStyle = '#0071e3';
        this.ctx.beginPath();
        this.ctx.arc(axCanvas, ayCanvas, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('A', axCanvas + 10, ayCanvas - 10);

        this.ctx.fillStyle = '#34c759';
        this.ctx.beginPath();
        this.ctx.arc(bxCanvas, byCanvas, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#34c759';
        this.ctx.fillText('B', bxCanvas + 10, byCanvas - 10);
    }

    drawLineAB() {
        const axCanvas = this.centerX + this.pointA.x * this.scale;
        const ayCanvas = this.centerY - this.pointA.y * this.scale;
        const bxCanvas = this.centerX + this.pointB.x * this.scale;
        const byCanvas = this.centerY - this.pointB.y * this.scale;

        this.ctx.strokeStyle = '#dddddd';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(axCanvas, ayCanvas);
        this.ctx.lineTo(bxCanvas, byCanvas);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawCustomLine() {
        const b = this.pointA.y - this.lineSlope * this.pointA.x;

        this.ctx.strokeStyle = '#ff3b30';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        const x1 = -8;
        const y1 = this.lineSlope * x1 + b;
        const x2 = 8;
        const y2 = this.lineSlope * x2 + b;

        this.ctx.moveTo(this.centerX + x1 * this.scale, this.centerY - y1 * this.scale);
        this.ctx.lineTo(this.centerX + x2 * this.scale, this.centerY - y2 * this.scale);
        this.ctx.stroke();
    }
}

window.addEventListener('load', () => {
    const visualizer = new CoordinatesVisualizer();
    window.updateCoord = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
