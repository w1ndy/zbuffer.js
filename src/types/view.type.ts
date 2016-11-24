import { Vec4 } from './linalg.type';

export interface Camera {
    eye: Vec4,
    at: Vec4,
    up: Vec4
}

export interface BoundingRect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
