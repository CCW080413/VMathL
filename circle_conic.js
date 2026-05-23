class ConicVisualizer {
    constructor() {
        this.canvas = document.getElementById('conicCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.circleCx = 0;
        this.circleCy = 0;
        this.circleR = 2;
        this.ellipseA = 3;
        this.ellipseB = 2;

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
        this.circleCx = parseFloat(document.getElementById('circle-cx').value) || 0;
        this.circleCy = parseFloat(document.getElementById('circle-cy').value) || 0;
        this.circleR = parseFloat(document.getElementById('circle-radius').value) || 1;
        this.ellipseA = parseFloat(document.getElementById('ellipse-a').value) || 1;
        this.ellipseB = parseFloat(document.getElementById('ellipse-b').value) || 1;

        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        if (this.circleCx === 0 && this.circleCy === 0) {
            document.getElementById('circle-eq').textContent =
                `x² + y² = ${(this.circleR ** 2).toFixed(1)}`;
        } else {
            document.getElementById('circle-eq').textContent =
                `(x - ${this.circleCx})² + (y - ${this.circleCy})² = ${(this.circleR ** 2).toFixed(1)}`;
        }

        const circumference = 2 * Math.PI * this.circleR;
        document.getElementById('circle-circumference').textContent =
            `C ≈ ${circumference.toFixed(2)}`;

        const circleArea = Math.PI * this.circleR ** 2;
        document.getElementById('circle-area').textContent =
            `A ≈ ${circleArea.toFixed(2)}`;

        document.getElementById('ellipse-eq').textContent =
            `x²/${(this.ellipseA ** 2).toFixed(1)} + y²/${(this.ellipseB ** 2).toFixed(1)} = 1`;

        const c = Math.sqrt(Math.abs(this.ellipseA ** 2 - this.ellipseB ** 2));
        document.getElementById('ellipse-focal').textContent =
            `c ≈ ${c.toFixed(2)}`;

        const e = c / this.ellipseA;
        document.getElementById('ellipse-eccentricity').textContent =
            `e ≈ ${e.toFixed(3)}`;

        const ellipseArea = Math.PI * this.ellipseA * this.ellipseB;
        document.getElementById('ellipse-area').textContent =
            `A ≈ ${ellipseArea.toFixed(2)}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawCircle();
        this.drawEllipse();
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

    drawCircle() {
        const cx = this.centerX + this.circleCx * this.scale;
        const cy = this.centerY - this.circleCy * this.scale;
        const r = this.circleR * this.scale;

        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 圆心
        this.ctx.fillStyle = '#0071e3';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 半径线
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx + r, cy);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('圆', cx + 10, cy - 10);
    }

    drawEllipse() {
        const cx = this.centerX;
        const cy = this.centerY;
        const a = this.ellipseA * this.scale;
        const b = this.ellipseB * this.scale;

        this.ctx.strokeStyle = '#34c759';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
            const x = cx + a * Math.cos(angle);
            const y = cy - b * Math.sin(angle);

            if (angle === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();

        // 焦点
        const c = Math.sqrt(Math.abs(this.ellipseA ** 2 - this.ellipseB ** 2)) * this.scale;
        if (this.ellipseA > this.ellipseB) {
            this.ctx.fillStyle = '#ff3b30';
            this.ctx.beginPath();
            this.ctx.arc(cx + c, cy, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cx - c, cy, 3, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.fillStyle = '#ff3b30';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy + c, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cx, cy - c, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = '#34c759';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('椭圆', cx + a + 10, cy);
    }
}

window.addEventListener('load', () => {
    const visualizer = new ConicVisualizer();
    window.updateConic = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
