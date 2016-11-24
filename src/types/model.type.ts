import { Vec4 } from './linalg.type';

export interface NativeCamera {
    eye: number[],
    at: number[],
    up: number[]
}

export interface ModelDesc {
    name: string;
    path: string;
    defaultCamera: NativeCamera;
}

export interface IndexedFace {
    v1: number;
    v2: number;
    v3: number;
}

export interface Model {
    vertices: Vec4[];
    faces: IndexedFace[];
    desc: ModelDesc;
}
