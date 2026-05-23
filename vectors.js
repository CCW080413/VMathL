class VectorVisualizer {
    constructor() {
        this.canvas = document.getElementById('vectorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.vecA = { x: 3, y: 2 };
        this.vecB = { x: 1, y: 3 };

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
        this.vecA.x = parseFloat(document.getElementById('vec-ax').value) || 0;
        this.vecA.y = parseFloat(document.getElementById('vec-ay').value) || 0;
        this.vecB.x = parseFloat(document.getElementById('vec-bx').value) || 0;
        this.vecB.y = parseFloat(document.getElementById('vec-by').value) || 0;

        this.updateInfoPanel();
        this.draw();
    }

    getMagnitude(vec) {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2);
    }

    getDotProduct() {
        return this.vecA.x * this.vecB.x + this.vecA.y * this.vecB.y;
    }

    updateInfoPanel() {
        const magA = this.getMagnitude(this.vecA);
        const magB = this.getMagnitude(this.vecB);
        const dotProd = this.getDotProduct();

        document.getElementById('vec-a-magnitude').textContent =
            `|A| = ${magA.toFixed(2)}`;
        document.getElementById('vec-b-magnitude').textContent =
            `|B| = ${magB.toFixed(2)}`;
        document.getElementById('dot-product').textContent =
            `A·B = ${dotProd.toFixed(2)}`;

        const sumX = (this.vecA.x + this.vecB.x).toFixed(2);
        const sumY = (this.vecA.y + this.vecB.y).toFixed(2);
        document.getElementById('vec-sum').textContent =
            `(${sumX}, ${sumY})`;

        const diffX = (this.vecA.x - this.vecB.x).toFixed(2);
        const diffY = (this.vecA.y - this.vecB.y).toFixed(2);
        document.getElementById('vec-diff').textContent =
            `(${diffX}, ${diffY})`;

        const cosTheta = dotProd / (magA * magB);
        const angle = Math.acos(Math.min(1, Math.max(-1, cosTheta))) * 180 / Math.PI;
        document.getElementById('angle-between').textContent =
            `θ ≈ ${angle.toFixed(2)}°`;

        const cross = this.vecA.x * this.vecB.y - this.vecB.x * this.vecA.y;
        document.getElementById('parallel-check').textContent =
            `x₁y₂ - x₂y₁ = ${cross.toFixed(2)}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawVectorA();
        this.drawVectorB();
        this.drawSum();
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

    drawVector(vec, color, label) {
        const endX = this.centerX + vec.x * this.scale;
        const endY = this.centerY - vec.y * this.scale;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // 箭头
        const angle = Math.atan2(-vec.y, vec.x);
        const arrowSize = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY + arrowSize * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY + arrowSize * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();

        // 标签
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText(label, endX + 10, endY - 10);
    }

    drawVectorA() {
        this.drawVector(this.vecA, '#0071e3', 'A');
    }

    drawVectorB() {
        this.drawVector(this.vecB, '#34c759', 'B');
    }

    drawSum() {
        const sum = { x: this.vecA.x + this.vecB.x, y: this.vecA.y + this.vecB.y };

        // 绘制平行四边形
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        const ax = this.centerX + this.vecA.x * this.scale;
        const ay = this.centerY - this.vecA.y * this.scale;
        const bx = this.centerX + this.vecB.x * this.scale;
        const by = this.centerY - this.vecB.y * this.scale;

        this.ctx.beginPath();
        this.ctx.moveTo(ax, ay);
        this.ctx.lineTo(ax + this.vecB.x * this.scale, ay - this.vecB.y * this.scale);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(bx, by);
        this.ctx.lineTo(bx + this.vecA.x * this.scale, by - this.vecA.y * this.scale);
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        this.drawVector(sum, '#ff3b30', 'A+B');
    }
}

window.addEventListener('load', () => {
    const visualizer = new VectorVisualizer();
    window.updateVector = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
