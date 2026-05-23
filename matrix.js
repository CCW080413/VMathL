class MatrixCalculator {
    constructor() {
        this.matrixA = { a11: 2, a12: 1, a21: 3, a22: 4 };
        this.matrixB = { b11: 1, b12: 2, b21: 2, b22: 1 };
        this.update();
    }

    update() {
        this.matrixA.a11 = parseFloat(document.getElementById('a11').value) || 0;
        this.matrixA.a12 = parseFloat(document.getElementById('a12').value) || 0;
        this.matrixA.a21 = parseFloat(document.getElementById('a21').value) || 0;
        this.matrixA.a22 = parseFloat(document.getElementById('a22').value) || 0;

        this.matrixB.b11 = parseFloat(document.getElementById('b11').value) || 0;
        this.matrixB.b12 = parseFloat(document.getElementById('b12').value) || 0;
        this.matrixB.b21 = parseFloat(document.getElementById('b21').value) || 0;
        this.matrixB.b22 = parseFloat(document.getElementById('b22').value) || 0;

        this.updateInfoPanel();
    }

    determinant(m) {
        return m.a11 * m.a22 - m.a12 * m.a21;
    }

    matrixAdd(a, b) {
        return {
            a11: a.a11 + b.b11,
            a12: a.a12 + b.b12,
            a21: a.a21 + b.b21,
            a22: a.a22 + b.b22
        };
    }

    matrixSubtract(a, b) {
        return {
            a11: a.a11 - b.b11,
            a12: a.a12 - b.b12,
            a21: a.a21 - b.b21,
            a22: a.a22 - b.b22
        };
    }

    matrixMultiply(a, b) {
        return {
            a11: a.a11 * b.b11 + a.a12 * b.b21,
            a12: a.a11 * b.b12 + a.a12 * b.b22,
            a21: a.a21 * b.b11 + a.a22 * b.b21,
            a22: a.a21 * b.b12 + a.a22 * b.b22
        };
    }

    trace(m) {
        return m.a11 + m.a22;
    }

    formatMatrix(m) {
        return `[${m.a11} ${m.a12}] [${m.a21} ${m.a22}]`;
    }

    updateInfoPanel() {
        const detA = this.determinant(this.matrixA);
        const detB = this.determinant(this.matrixB);

        document.getElementById('det-a').textContent = detA.toFixed(2);
        document.getElementById('det-b').textContent = detB.toFixed(2);

        const sum = this.matrixAdd(this.matrixA, this.matrixB);
        document.getElementById('sum-result').textContent =
            `[${sum.a11.toFixed(0)} ${sum.a12.toFixed(0)}] [${sum.a21.toFixed(0)} ${sum.a22.toFixed(0)}]`;

        const diff = this.matrixSubtract(this.matrixA, this.matrixB);
        document.getElementById('diff-result').textContent =
            `[${diff.a11.toFixed(0)} ${diff.a12.toFixed(0)}] [${diff.a21.toFixed(0)} ${diff.a22.toFixed(0)}]`;

        const prod = this.matrixMultiply(this.matrixA, this.matrixB);
        document.getElementById('product-result').textContent =
            `[${prod.a11.toFixed(0)} ${prod.a12.toFixed(0)}] [${prod.a21.toFixed(0)} ${prod.a22.toFixed(0)}]`;

        const detProduct = detA * detB;
        document.getElementById('det-product').textContent = detProduct.toFixed(2);

        const traceA = this.trace(this.matrixA);
        document.getElementById('trace-a').textContent = traceA.toFixed(2);
    }
}

window.addEventListener('load', () => {
    const calculator = new MatrixCalculator();
    window.updateMatrix = () => calculator.update();
});

function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}
