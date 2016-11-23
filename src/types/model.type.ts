import { Vec4 } from './linalg.type';

export interface ModelDesc {
    name: string;
    path: string;
}

export interface IndexedFace {
    v1: number;
    v2: number;
    v3: number;
}

export interface Model {
    vertices: Vec4[];
    faces: IndexedFace[];
}
