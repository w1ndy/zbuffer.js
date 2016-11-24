export class Vec4 {
    d: number[] = [0., 0., 0., 0.];

    constructor(x: number = 0., y: number = 0., z: number = 0., w: number = 0.) {
        this.d[0] = x; this.d[1] = y, this.d[2] = z; this.d[3] = w;
    }

    get x(): number { return this.d[0]; }
    get y(): number { return this.d[1]; }
    get z(): number { return this.d[2]; }
    get w(): number { return this.d[3]; }

    set x(x: number) { this.d[0] = x; }
    set y(y: number) { this.d[1] = y; }
    set z(z: number) { this.d[2] = z; }
    set w(w: number) { this.d[3] = w; }

    sub(v: Vec4): Vec4 {
        return new Vec4(
            this.d[0] - v.d[0],
            this.d[1] - v.d[1],
            this.d[2] - v.d[2],
            this.d[3] - v.d[3]);
    }

    norm(): number {
        return Math.sqrt(
            this.d[0] * this.d[0] +
            this.d[1] * this.d[1] +
            this.d[2] * this.d[2] +
            this.d[3] * this.d[3]);
    }

    normalize(): Vec4 {
        const len = this.norm();
        return new Vec4(
            this.d[0] / len,
            this.d[1] / len,
            this.d[2] / len,
            this.d[3] / len);
    }

    dot(v: Vec4): number {
        return this.d[0] * v.d[0] +
            this.d[1] * v.d[1] +
            this.d[2] * v.d[2] +
            this.d[3] * v.d[3];
    }

    cross(v: Vec4): Vec4 {
        return new Vec4(
            this.d[1] * v.d[2] - this.d[2] * v.d[1],
            this.d[2] * v.d[0] - this.d[0] * v.d[2],
            this.d[0] * v.d[1] - this.d[1] * v.d[0],
            0);
    }
}

export class Mat4 {
    d: number[][] = [
        [0., 0., 0., 0.],
        [0., 0., 0., 0.],
        [0., 0., 0., 0.],
        [0., 0., 0., 0.]
    ];

    constructor(
        m00: number = 0., m01: number = 0., m02: number = 0., m03: number = 0.,
        m10: number = 0., m11: number = 0., m12: number = 0., m13: number = 0.,
        m20: number = 0., m21: number = 0., m22: number = 0., m23: number = 0.,
        m30: number = 0., m31: number = 0., m32: number = 0., m33: number = 0.) {
        this.d[0][0] = m00; this.d[0][1] = m01; this.d[0][2] = m02; this.d[0][3] = m03;
        this.d[1][0] = m10; this.d[1][1] = m11; this.d[1][2] = m12; this.d[1][3] = m13;
        this.d[2][0] = m20; this.d[2][1] = m21; this.d[2][2] = m22; this.d[2][3] = m23;
        this.d[3][0] = m30; this.d[3][1] = m31; this.d[3][2] = m32; this.d[3][3] = m33;
    }

    apply(v: Vec4): Vec4 {
        let r = new Vec4();
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                r.d[i] += this.d[i][j] * v.d[j];
        if (Math.abs(r.d[3]) > 1e-6) {
            r.d[0] /= r.d[3];
            r.d[1] /= r.d[3];
            r.d[2] /= r.d[3];
            r.d[3] = 1.;
        }
        return r;
    }

    mul(m: Mat4): Mat4 {
        let r = new Mat4();
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    r.d[i][j] += this.d[i][k] * m.d[k][j];
        return r;
    }
}

export function buildProjectionMatrix(
        fovy: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1 / Math.tan(fovy / 180. * Math.PI * 0.5);
    return new Mat4(
        f / aspect, 0., 0., 0.,
        0., f, 0., 0.,
        0., 0., (far + near) / (near - far), 2. * far * near / (near - far),
        0., 0., -1., 0.);
}

export function buildViewMatrix(eye: Vec4, at: Vec4, up: Vec4): Mat4 {
    const _dir = at.sub(eye).normalize(),
          _right = _dir.cross(up.normalize()).normalize(),
          _up = _right.cross(_dir).normalize();
    return new Mat4(
        _right.d[0], _right.d[1], _right.d[2], -_right.dot(eye),
        _up.d[0], _up.d[1], _up.d[2], -_up.dot(eye),
        -_dir.d[0], -_dir.d[1], -_dir.d[2], _dir.dot(eye),
        0., 0., 0., 1.);
}

export function buildViewportMatrix(width: number, height: number): Mat4 {
    return new Mat4(
        0.5 * width, 0, 0, 0.5 * width,
        0, 0.5 * height, 0, 0.5 * height,
        0, 0, 1, 0
        0, 0, 0, 1);
}
