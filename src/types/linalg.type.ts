export class Vec4 {
    d: number[] = [0., 0., 0., 0.];

    constructor(x: number, y: number, z: number, w: number = 0.) {
        this.d[0] = x; this.d[1] = y, this.d[2] = z; this.d[3] = w;
    }

    x(): number { return this.d[0]; }
    y(): number { return this.d[1]; }
    z(): number { return this.d[2]; }
    w(): number { return this.d[3]; }

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
            this.d[1] * v.d[2] + this.d[2] * v.d[1],
            this.d[2] * v.d[0] + this.d[0] * v.d[2],
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
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number) {
        this.d[0][0] = m00; this.d[0][1] = m01; this.d[0][2] = m02; this.d[0][3] = m03;
        this.d[1][0] = m10; this.d[1][1] = m11; this.d[1][2] = m12; this.d[1][3] = m13;
        this.d[2][0] = m20; this.d[2][1] = m21; this.d[2][2] = m22; this.d[2][3] = m23;
        this.d[3][0] = m30; this.d[3][1] = m31; this.d[3][2] = m32; this.d[3][3] = m33;
    }
}

export function buildProjectionMatrix(
        fovy: number, aspect: number, near: number, far: number): Mat4 {
    const halfH = Math.tan(fovy / 180. * Math.PI * 0.5) * near,
          halfW = aspect * halfH
    return new Mat4(
        near / halfW, 0., 0., 0.,
        0., near / halfH, 0., 0.,
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
