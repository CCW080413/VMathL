// 二次函数编辑器和几何计算工具
class QuadraticFunctionEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // 响应式Canvas大小
        this.resizeCanvas();

        // 三个控制点：左(p1)、中(p2)、右(p3)
        this.p1 = { x: this.width * 0.2, y: this.height * 0.4 };
        this.p2 = { x: this.width * 0.5, y: this.height * 0.2 };
        this.p3 = { x: this.width * 0.8, y: this.height * 0.4 };

        this.draggedPoint = null;
        this.pointRadius = 10;

        // 坐标系配置
        this.originX = this.width / 2;
        this.originY = this.height / 2;
        this.scale = 30; // 像素/单位

        // 绑定事件
        this.bindEvents();

        // 初始化
        this.update();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.update();
        });
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 检测点击了哪个控制点
        if (this.isPointInRadius(mouseX, mouseY, this.p1)) {
            this.draggedPoint = this.p1;
        } else if (this.isPointInRadius(mouseX, mouseY, this.p2)) {
            this.draggedPoint = this.p2;
        } else if (this.isPointInRadius(mouseX, mouseY, this.p3)) {
            this.draggedPoint = this.p3;
        }
    }

    onMouseMove(e) {
        if (!this.draggedPoint) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 自由拖拽（不限制范围）
        this.draggedPoint.x = mouseX;
        this.draggedPoint.y = mouseY;

        this.update();
    }

    onMouseUp() {
        this.draggedPoint = null;
    }

    isPointInRadius(x, y, point) {
        const dx = x - point.x;
        const dy = y - point.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.pointRadius + 5;
    }

    // 转换为数学坐标
    canvasToMath(canvasX, canvasY) {
        return {
            x: (canvasX - this.originX) / this.scale,
            y: (this.originY - canvasY) / this.scale
        };
    }

    // 根据控制点计算二次函数系数
    calculateCoefficients() {
        const m1 = this.canvasToMath(this.p1.x, this.p1.y);
        const m2 = this.canvasToMath(this.p2.x, this.p2.y);
        const m3 = this.canvasToMath(this.p3.x, this.p3.y);

        const x1 = m1.x, y1 = m1.y;
        const x2 = m2.x, y2 = m2.y;
        const x3 = m3.x, y3 = m3.y;

        const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);

        if (Math.abs(denom) < 1e-6) {
            return { a: 1, b: 0, c: 0 };
        }

        // 使用拉格朗日插值
        const a = (y1 / ((x1 - x2) * (x1 - x3))) +
            (y2 / ((x2 - x1) * (x2 - x3))) +
            (y3 / ((x3 - x1) * (x3 - x2)));

        const b = -(y1 * (x2 + x3) / ((x1 - x2) * (x1 - x3))) -
            (y2 * (x1 + x3) / ((x2 - x1) * (x2 - x3))) -
            (y3 * (x1 + x2) / ((x3 - x1) * (x3 - x2)));

        const c = (y1 * x2 * x3 / ((x1 - x2) * (x1 - x3))) +
            (y2 * x1 * x3 / ((x2 - x1) * (x2 - x3))) +
            (y3 * x1 * x2 / ((x3 - x1) * (x3 - x2)));

        return { a, b, c };
    }

    // 计算距离
    calculateDistance(p1, p2) {
        const m1 = this.canvasToMath(p1.x, p1.y);
        const m2 = this.canvasToMath(p2.x, p2.y);
        const dx = m2.x - m1.x;
        const dy = m2.y - m1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 计算中点
    calculateMidpoint(p1, p2) {
        const m1 = this.canvasToMath(p1.x, p1.y);
        const m2 = this.canvasToMath(p2.x, p2.y);
        return {
            x: (m1.x + m2.x) / 2,
            y: (m1.y + m2.y) / 2
        };
    }

    // 计算分点 (1:2分点)
    calculateDividePoint(p1, p2) {
        const m1 = this.canvasToMath(p1.x, p1.y);
        const m2 = this.canvasToMath(p2.x, p2.y);
        return {
            x: (m1.x + 2 * m2.x) / 3,
            y: (m1.y + 2 * m2.y) / 3
        };
    }

    // 计算斜率
    calculateSlope(p1, p2) {
        const m1 = this.canvasToMath(p1.x, p1.y);
        const m2 = this.canvasToMath(p2.x, p2.y);
        if (Math.abs(m2.x - m1.x) < 1e-6) return Infinity;
        return (m2.y - m1.y) / (m2.x - m1.x);
    }

    // 格式化数字
    formatNumber(num) {
        if (Math.abs(num) < 0.01) return '0';
        return (Math.round(num * 100) / 100).toString();
    }

    // 更新信息面板
    updateInfoPanel() {
        const m1 = this.canvasToMath(this.p1.x, this.p1.y);
        const m2 = this.canvasToMath(this.p2.x, this.p2.y);
        const m3 = this.canvasToMath(this.p3.x, this.p3.y);

        // 1. 点
        document.getElementById('point1').textContent =
            `P₁(${this.formatNumber(m1.x)}, ${this.formatNumber(m1.y)})`;
        document.getElementById('point2').textContent =
            `P₂(${this.formatNumber(m2.x)}, ${this.formatNumber(m2.y)})`;
        document.getElementById('point3').textContent =
            `P₃(${this.formatNumber(m3.x)}, ${this.formatNumber(m3.y)})`;

        // 2. 距离
        const d12 = this.calculateDistance(this.p1, this.p2);
        const d23 = this.calculateDistance(this.p2, this.p3);
        document.getElementById('distance').textContent =
            `d(P₁,P₂) = ${this.formatNumber(d12)}`;
        document.getElementById('distance2').textContent =
            `d(P₂,P₃) = ${this.formatNumber(d23)}`;

        // 3. 中点
        const mid12 = this.calculateMidpoint(this.p1, this.p2);
        const mid23 = this.calculateMidpoint(this.p2, this.p3);
        document.getElementById('midpoint1').textContent =
            `M(P₁,P₂) = (${this.formatNumber(mid12.x)}, ${this.formatNumber(mid12.y)})`;
        document.getElementById('midpoint2').textContent =
            `M(P₂,P₃) = (${this.formatNumber(mid23.x)}, ${this.formatNumber(mid23.y)})`;

        // 4. 分点
        const div12 = this.calculateDividePoint(this.p1, this.p2);
        const div23 = this.calculateDividePoint(this.p2, this.p3);
        document.getElementById('divide1').textContent =
            `D(P₁,P₂) = (${this.formatNumber(div12.x)}, ${this.formatNumber(div12.y)})`;
        document.getElementById('divide2').textContent =
            `D(P₂,P₃) = (${this.formatNumber(div23.x)}, ${this.formatNumber(div23.y)})`;

        // 5. 斜率
        const k12 = this.calculateSlope(this.p1, this.p2);
        const k23 = this.calculateSlope(this.p2, this.p3);
        document.getElementById('slope1').textContent =
            `k(P₁,P₂) = ${k12 === Infinity ? '∞' : this.formatNumber(k12)}`;
        document.getElementById('slope2').textContent =
            `k(P₂,P₃) = ${k23 === Infinity ? '∞' : this.formatNumber(k23)}`;

        // 6. X截距和Y截距
        const { a, b, c } = this.calculateCoefficients();

        // X截距 (y=0时的x值)
        if (Math.abs(a) < 1e-6) {
            // 一次方程
            if (Math.abs(b) > 1e-6) {
                const xInt = -c / b;
                document.getElementById('x-intercept').textContent = `x = ${this.formatNumber(xInt)}`;
            } else {
                document.getElementById('x-intercept').textContent = '无解或无穷多解';
            }
        } else {
            // 二次方程，使用求根公式
            const discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                document.getElementById('x-intercept').textContent = '无实数解';
            } else if (discriminant === 0) {
                const x = -b / (2 * a);
                document.getElementById('x-intercept').textContent = `x = ${this.formatNumber(x)}`;
            } else {
                const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
                const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
                document.getElementById('x-intercept').textContent =
                    `x₁ = ${this.formatNumber(x1)}, x₂ = ${this.formatNumber(x2)}`;
            }
        }

        // Y截距 (x=0时的y值)
        document.getElementById('y-intercept').textContent = `y = ${this.formatNumber(c)}`;
    }

    // 绘制
    update() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制网格
        this.drawGrid();

        // 绘制坐标轴
        this.drawAxes();

        // 绘制二次函数曲线
        this.drawQuadraticCurve();

        // 绘制控制点连接线
        this.drawControlLine();

        // 绘制控制点
        this.drawControlPoints();

        // 更新信息面板
        this.updateInfoPanel();
    }

    drawGrid() {
        const gridSpacing = this.scale;
        const opacity = 0.05;

        this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        this.ctx.lineWidth = 1;

        // 竖线
        for (let x = this.originX % gridSpacing; x < this.width; x += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // 横线
        for (let y = this.originY % gridSpacing; y < this.height; y += gridSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';

        // X轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.originY);
        this.ctx.lineTo(this.width, this.originY);
        this.ctx.stroke();

        // Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.originX, 0);
        this.ctx.lineTo(this.originX, this.height);
        this.ctx.stroke();

        // 原点标记
        this.ctx.fillRect(this.originX - 2, this.originY - 2, 4, 4);

        // 刻度标记
        this.ctx.font = '12px system-ui';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;
            const x = this.originX + i * this.scale;
            this.ctx.fillText(i.toString(), x, this.originY + 15);
        }
    }

    drawQuadraticCurve() {
        const { a, b, c } = this.calculateCoefficients();

        this.ctx.strokeStyle = '#0071e3';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        let firstPoint = true;
        for (let canvasX = 0; canvasX < this.width; canvasX += 2) {
            const x = (canvasX - this.originX) / this.scale;
            const y = a * x * x + b * x + c;
            const canvasY = this.originY - y * this.scale;

            if (canvasY >= 0 && canvasY <= this.height) {
                if (firstPoint) {
                    this.ctx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    this.ctx.lineTo(canvasX, canvasY);
                }
            }
        }

        this.ctx.stroke();
    }

    drawControlLine() {
        this.ctx.strokeStyle = 'rgba(0, 113, 227, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y);
        this.ctx.lineTo(this.p2.x, this.p2.y);
        this.ctx.lineTo(this.p3.x, this.p3.y);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }

    drawControlPoints() {
        const points = [this.p1, this.p2, this.p3];

        points.forEach((point, index) => {
            // 外圆
            this.ctx.fillStyle = '#0071e3';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.pointRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // 内白圆
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.pointRadius - 3, 0, Math.PI * 2);
            this.ctx.fill();

            // 标签
            const labels = ['P1', 'P2', 'P3'];
            this.ctx.fillStyle = '#0071e3';
            this.ctx.font = 'bold 12px system-ui';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(labels[index], point.x, point.y);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const editor = new QuadraticFunctionEditor('graphCanvas');

    // 页面进入动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease';
    }, 100);
});

// 返回主页
function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        window.location.href = 'main.html';
    }, 500);
}
