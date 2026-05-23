class SequenceVisualizer {
    constructor() {
        this.canvas = document.getElementById('sequenceCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 30;
        this.centerX = 0;
        this.centerY = 0;
        this.apFirst = 1;
        this.apDiff = 2;
        this.gpFirst = 1;
        this.gpRatio = 2;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.update();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.centerX = 50;
        this.centerY = this.canvas.height - 50;
        this.draw();
    }

    update() {
        this.apFirst = parseFloat(document.getElementById('ap-first').value) || 0;
        this.apDiff = parseFloat(document.getElementById('ap-diff').value) || 1;
        this.gpFirst = parseFloat(document.getElementById('gp-first').value) || 1;
        this.gpRatio = parseFloat(document.getElementById('gp-ratio').value) || 1;

        this.updateInfoPanel();
        this.draw();
    }

    getAPTerm(n) {
        return this.apFirst + (n - 1) * this.apDiff;
    }

    getGPTerm(n) {
        return this.gpFirst * Math.pow(this.gpRatio, n - 1);
    }

    updateInfoPanel() {
        document.getElementById('ap-general').textContent =
            `aₙ = ${this.apFirst} + (n-1)·${this.apDiff}`;
        document.getElementById('gp-general').textContent =
            `aₙ = ${this.gpFirst}·${this.gpRatio}ⁿ⁻¹`;

        const apSum10 = (10 * (2 * this.apFirst + 9 * this.apDiff)) / 2;
        document.getElementById('ap-sum').textContent =
            `S₁₀ = ${apSum10.toFixed(0)}`;

        let gpSum10 = 0;
        if (Math.abs(this.gpRatio - 1) < 0.0001) {
            gpSum10 = this.gpFirst * 10;
        } else {
            gpSum10 = this.gpFirst * (1 - Math.pow(this.gpRatio, 10)) / (1 - this.gpRatio);
        }
        document.getElementById('gp-sum').textContent =
            `S₁₀ = ${gpSum10.toFixed(2)}`;

        let apTerms = [];
        let gpTerms = [];
        for (let i = 1; i <= 10; i++) {
            apTerms.push(this.getAPTerm(i).toFixed(0));
            gpTerms.push(this.getGPTerm(i).toFixed(1));
        }
        document.getElementById('first-ten').textContent =
            `AP: ${apTerms.slice(0, 5).join(', ')}...`;

        const a5 = this.getAPTerm(5);
        document.getElementById('nth-term').textContent =
            `a₅ = ${a5.toFixed(0)}`;

        let limitText = '';
        if (this.apDiff > 0) limitText = '递增，趋向 +∞';
        else if (this.apDiff < 0) limitText = '递减，趋向 -∞';
        else limitText = '常数列';

        if (this.gpRatio > 1) limitText += ' | 等比：递增，趋向 +∞';
        else if (Math.abs(this.gpRatio) < 1) limitText += ' | 等比：趋向 0';
        else if (this.gpRatio === 1) limitText += ' | 等比：常数';

        document.getElementById('limit-behavior').textContent = limitText;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAxes();
        this.drawAPSequence();
        this.drawGPSequence();
    }

    drawAxes() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;

        // X 轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(this.canvas.width - 20, this.centerY);
        this.ctx.stroke();

        // Y 轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.centerY);
        this.ctx.stroke();

        this.ctx.fillStyle = '#0071e3';
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont';
        this.ctx.fillText('n', this.canvas.width - 30, this.centerY - 10);
        this.ctx.fillText('aₙ', this.centerX + 10, 20);
    }

    drawAPSequence() {
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let n = 1; n <= 10; n++) {
            const term = this.getAPTerm(n);
            const x = this.centerX + n * this.scale;
            const y = this.centerY - term * this.scale / 2;

            if (n === 1) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();

        // 绘制点
        for (let n = 1; n <= 10; n++) {
            const term = this.getAPTerm(n);
            const x = this.centerX + n * this.scale;
            const y = this.centerY - term * this.scale / 2;

            this.ctx.fillStyle = '#0071e3';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawGPSequence() {
        this.ctx.strokeStyle = '#34c759';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let n = 1; n <= 10; n++) {
            const term = this.getGPTerm(n);
            const x = this.centerX + n * this.scale;
            const y = this.centerY - Math.min(term, 200) * this.scale / 4;

            if (n === 1) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();

        // 绘制点
        for (let n = 1; n <= 10; n++) {
            const term = this.getGPTerm(n);
            const x = this.centerX + n * this.scale;
            const y = this.centerY - Math.min(term, 200) * this.scale / 4;

            this.ctx.fillStyle = '#34c759';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

window.addEventListener('load', () => {
    const visualizer = new SequenceVisualizer();
    window.updateSequence = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
