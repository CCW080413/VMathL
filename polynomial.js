class PolynomialVisualizer {
    constructor() {
        this.canvas = document.getElementById('polyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 50;
        this.centerX = 0;
        this.centerY = 0;
        this.coefficients = { a: 1, b: 0, c: -5, d: 6 };

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
        this.coefficients.a = parseFloat(document.getElementById('coeff-a').value) || 0;
        this.coefficients.b = parseFloat(document.getElementById('coeff-b').value) || 0;
        this.coefficients.c = parseFloat(document.getElementById('coeff-c').value) || 0;
        this.coefficients.d = parseFloat(document.getElementById('coeff-d').value) || 0;

        this.updateInfoPanel();
        this.draw();
    }

    evaluatePolynomial(x) {
        const { a, b, c, d } = this.coefficients;
        return a * x ** 3 + b * x ** 2 + c * x + d;
    }

    findRoots() {
        const roots = [];
        for (let x = -10; x <= 10; x += 0.1) {
            const y = this.evaluatePolynomial(x);
            const yNext = this.evaluatePolynomial(x + 0.1);
            if (y * yNext < 0) {
                roots.push(x.toFixed(2));
            }
        }
        return [...new Set(roots)];
    }

    findExtrema() {
        const { a, b, c } = this.coefficients;
        const discriminant = 4 * b ** 2 - 12 * a * c;
        const extrema = [];

        if (discriminant >= 0) {
            const x1 = (-2 * b + Math.sqrt(discriminant)) / (6 * a);
            const x2 = (-2 * b - Math.sqrt(discriminant)) / (6 * a);
            extrema.push(x1.toFixed(2), x2.toFixed(2));
        }
        return extrema;
    }

    updateInfoPanel() {
        const { a, b, c, d } = this.coefficients;

        document.getElementById('poly-expr').textContent =
            `P(x) = ${a}x³ ${b >= 0 ? '+' : ''} ${b}x² ${c >= 0 ? '+' : ''} ${c}x ${d >= 0 ? '+' : ''} ${d}`;

        const roots = this.findRoots();
        document.getElementById('poly-roots').textContent =
            roots.length > 0 ? `x = ${roots.join(', ')}` : '无实根';

        document.getElementById('poly-derivative').textContent =
            `P'(x) = ${3 * a}x² ${2 * b >= 0 ? '+' : ''} ${2 * b}x ${c >= 0 ? '+' : ''} ${c}`;

        const extrema = this.findExtrema();
        document.getElementById('poly-extrema').textContent =
            extrema.length > 0 ? `x = ${extrema.join(', ')}` : '无极值点';

        document.getElementById('poly-intercept').textContent = `d = ${d}`;
        document.getElementById('poly-info').textContent = '3 次多项式';
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawCurve();
        this.drawRoots();
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

    drawCurve() {
        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let first = true;
        for (let x = -10; x <= 10; x += 0.1) {
            const y = this.evaluatePolynomial(x);
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

    drawRoots() {
        const roots = this.findRoots();
        this.ctx.fillStyle = '#ff3b30';
        roots.forEach(root => {
            const x = parseFloat(root);
            const canvasX = this.centerX + x * this.scale;
            this.ctx.beginPath();
            this.ctx.arc(canvasX, this.centerY, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}

window.addEventListener('load', () => {
    const visualizer = new PolynomialVisualizer();
    window.updatePolynomial = () => visualizer.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
