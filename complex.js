class ComplexVisualizer {
    constructor() {
        this.canvas = document.getElementById('complexCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 60;
        this.centerX = 0;
        this.centerY = 0;
        this.z1 = { real: 3, imag: 2 };
        this.z2 = { real: 1, imag: 2 };

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
        this.z1.real = parseFloat(document.getElementById('real1').value) || 0;
        this.z1.imag = parseFloat(document.getElementById('imag1').value) || 0;
        this.z2.real = parseFloat(document.getElementById('real2').value) || 0;
        this.z2.imag = parseFloat(document.getElementById('imag2').value) || 0;

        this.updateInfoPanel();
        this.draw();
    }

    updateInfoPanel() {
        // 极坐标 Z1
        const r1 = Math.sqrt(this.z1.real ** 2 + this.z1.imag ** 2).toFixed(2);
        const theta1 = (Math.atan2(this.z1.imag, this.z1.real) * 180 / Math.PI).toFixed(1);
        document.getElementById('polar1').textContent = `r = ${r1}, θ = ${theta1}°`;

        // 极坐标 Z2
        const r2 = Math.sqrt(this.z2.real ** 2 + this.z2.imag ** 2).toFixed(2);
        const theta2 = (Math.atan2(this.z2.imag, this.z2.real) * 180 / Math.PI).toFixed(1);
        document.getElementById('polar2').textContent = `r = ${r2}, θ = ${theta2}°`;

        // 加法
        const sumR = (this.z1.real + this.z2.real).toFixed(2);
        const sumI = (this.z1.imag + this.z2.imag).toFixed(2);
        document.getElementById('sum').textContent = `${sumR} + ${sumI}i`;

        // 减法
        const diffR = (this.z1.real - this.z2.real).toFixed(2);
        const diffI = (this.z1.imag - this.z2.imag).toFixed(2);
        document.getElementById('diff').textContent = `${diffR} + ${diffI}i`;

        // 乘法
        const prodR = (this.z1.real * this.z2.real - this.z1.imag * this.z2.imag).toFixed(2);
        const prodI = (this.z1.real * this.z2.imag + this.z1.imag * this.z2.real).toFixed(2);
        document.getElementById('product').textContent = `${prodR} + ${prodI}i`;

        // 除法
        const denominator = this.z2.real ** 2 + this.z2.imag ** 2;
        if (denominator !== 0) {
            const quoR = (this.z1.real * this.z2.real + this.z1.imag * this.z2.imag) / denominator;
            const quoI = (this.z1.imag * this.z2.real - this.z1.real * this.z2.imag) / denominator;
            document.getElementById('quotient').textContent = `${quoR.toFixed(2)} + ${quoI.toFixed(2)}i`;
        }

        // 共轭
        const conjI = this.z1.imag >= 0 ? `-${this.z1.imag.toFixed(2)}` : `${this.z1.imag.toFixed(2)}`;
        document.getElementById('conjugate').textContent = `${this.z1.real.toFixed(2)} ${conjI}i`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawComplexNumbers();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;

        for (let i = -8; i <= 8; i++) {
            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + i * this.scale, 0);
            this.ctx.lineTo(this.centerX + i * this.scale, this.canvas.height);
            this.ctx.stroke();

            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.centerY - i * this.scale);
            this.ctx.lineTo(this.canvas.width, this.centerY - i * this.scale);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;

        // 实轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();

        // 虚轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();

        // 标签
        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('实', this.canvas.width - 30, this.centerY - 10);
        this.ctx.fillText('虚', this.centerX + 10, 20);
    }

    drawComplexNumbers() {
        // 绘制 Z1
        const x1 = this.centerX + this.z1.real * this.scale;
        const y1 = this.centerY - this.z1.imag * this.scale;

        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();

        this.ctx.fillStyle = '#0071e3';
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('Z₁', x1 + 10, y1 - 10);

        // 绘制 Z2
        const x2 = this.centerX + this.z2.real * this.scale;
        const y2 = this.centerY - this.z2.imag * this.scale;

        this.ctx.strokeStyle = '#34c759';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#34c759';
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#34c759';
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('Z₂', x2 + 10, y2 - 10);
    }
}

window.addEventListener('load', () => {
    const visualizer = new ComplexVisualizer();
    window.updateComplex = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
