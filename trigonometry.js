class TrigonometryVisualizer {
    constructor() {
        this.canvas = document.getElementById('trigoCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.radius = 100;
        this.centerX = 0;
        this.centerY = 0;
        this.angle = 45;

        const slider = document.getElementById('angle-slider');
        slider.addEventListener('input', (e) => {
            document.getElementById('angle-input').value = e.target.value;
            this.update();
        });

        document.getElementById('angle-input').addEventListener('change', (e) => {
            document.getElementById('angle-slider').value = e.target.value;
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
        this.radius = Math.min(this.centerX, this.centerY) - 40;
        this.draw();
    }

    update() {
        this.angle = parseFloat(document.getElementById('angle-input').value) || 0;
        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        const radians = this.angle * Math.PI / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const tan = Math.tan(radians);

        document.getElementById('angle-value').textContent =
            `${this.angle}° / ${(radians).toFixed(3)} rad`;
        document.getElementById('sine-value').textContent =
            `sin(${this.angle}°) = ${sin.toFixed(4)}`;
        document.getElementById('cosine-value').textContent =
            `cos(${this.angle}°) = ${cos.toFixed(4)}`;
        document.getElementById('tangent-value').textContent =
            `tan(${this.angle}°) = ${tan.toFixed(4)}`;

        const pythag = (sin ** 2 + cos ** 2).toFixed(6);
        document.getElementById('pythagorean-value').textContent =
            `${sin.toFixed(4)}² + ${cos.toFixed(4)}² = ${pythag}`;

        let quadrant = 'I';
        if (this.angle > 90 && this.angle <= 180) quadrant = 'II';
        else if (this.angle > 180 && this.angle <= 270) quadrant = 'III';
        else if (this.angle > 270 && this.angle < 360) quadrant = 'IV';
        document.getElementById('quadrant-value').textContent =
            `象限 ${quadrant} (${this.angle}°)`;

        const refAngle = this.angle % 90;
        document.getElementById('reference-angle').textContent =
            `${refAngle.toFixed(1)}°`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawUnitCircle();
        this.drawAngle();
        this.drawTriangle();
        this.drawLabels();
    }

    drawUnitCircle() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#dddddd';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - this.radius - 40, this.centerY);
        this.ctx.lineTo(this.centerX + this.radius + 40, this.centerY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - this.radius - 40);
        this.ctx.lineTo(this.centerX, this.centerY + this.radius + 40);
        this.ctx.stroke();
    }

    drawAngle() {
        const radians = this.angle * Math.PI / 180;

        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(
            this.centerX + this.radius * Math.cos(radians),
            this.centerY - this.radius * Math.sin(radians)
        );
        this.ctx.stroke();

        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 30, -Math.PI / 2, -Math.PI / 2 + radians, false);
        this.ctx.stroke();

        const pointX = this.centerX + this.radius * Math.cos(radians);
        const pointY = this.centerY - this.radius * Math.sin(radians);
        this.ctx.fillStyle = '#0071e3';
        this.ctx.beginPath();
        this.ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawTriangle() {
        const radians = this.angle * Math.PI / 180;
        const x = this.radius * Math.cos(radians);
        const y = this.radius * Math.sin(radians);

        const pointX = this.centerX + x;
        const pointY = this.centerY - y;

        // 绘制正弦（垂直线）
        this.ctx.strokeStyle = '#ff3b30';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(pointX, pointY);
        this.ctx.lineTo(pointX, this.centerY);
        this.ctx.stroke();

        // 绘制余弦（水平线）
        this.ctx.strokeStyle = '#34c759';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(pointX, this.centerY);
        this.ctx.stroke();

        // 绘制标签
        this.ctx.fillStyle = '#ff3b30';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('sin', pointX + 5, this.centerY - 5);

        this.ctx.fillStyle = '#34c759';
        this.ctx.fillText('cos', this.centerX + x / 2, this.centerY + 15);
    }

    drawLabels() {
        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('x (cos)', this.centerX + this.radius + 50, this.centerY - 5);
        this.ctx.fillText('y (sin)', this.centerX - 40, 20);
    }
}

window.addEventListener('load', () => {
    new TrigonometryVisualizer();
});

function updateTrigo() {
    document.dispatchEvent(new Event('updateTrigo'));
}

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
