import { Component, Directive, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer, HostListener, Input } from '@angular/core';

import { LoaderService } from '../services/loader.service';

import { Vec4, Mat4, buildProjectionMatrix, buildViewMatrix, buildViewportMatrix } from '../types/linalg.type';
import { Model, IndexedFace, NativeCamera } from '../types/model.type';
import { Camera, BoundingRect } from '../types/view.type';

@Directive({
    selector: '[view-canvas]'
})
export class ViewCanvasDirective {
    @Input() set model(m: Model) {
        this.inputMesh = m;
        this.onModelUpdated(m);
    };

    private canvas: HTMLCanvasElement = null;
    private ctx: CanvasRenderingContext2D = null;
    private width: number = 0;
    private height: number = 0;

    private inputMesh: Model = null;
    private mesh: Model = null;

    private vpMatrix: Mat4 = null;

    private camera: Camera = {
        eye: new Vec4(),
        at: new Vec4(),
        up: new Vec4()
    };

    private zbuffer: Float32Array[] = null;

    constructor(private element: ElementRef, private renderer: Renderer) {
        this.canvas = element.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.resetMatrices();
    };

    resetMatrices(): void {
        const fovy = 70., near = 0.5, far = 100.,
              aspect = this.height ? this.width / this.height : this.width;
        this.vpMatrix = buildViewportMatrix(this.width, this.height)
            .mul(buildProjectionMatrix(fovy, aspect, near, far));
        this.onModelUpdated(this.inputMesh);
    }

    setCameraFromNativeCamera(nc: NativeCamera) {
        this.camera.eye = new Vec4(nc.eye[0], nc.eye[1], nc.eye[2]);
        this.camera.at = new Vec4(nc.at[0], nc.at[1], nc.at[2]);
        this.camera.up = new Vec4(nc.up[0], nc.up[1], nc.up[2]);
        console.log(this.camera);
    }

    onModelUpdated(m: Model): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (m === null) {
            this.mesh = null;
            return;
        }

        this.mesh = { vertices: [], faces: m.faces, desc: m.desc };
        this.setCameraFromNativeCamera(this.mesh.desc.defaultCamera);

        const projection = this.vpMatrix.mul(
            buildViewMatrix(this.camera.eye, this.camera.at, this.camera.up))
        for (let v of m.vertices)
            this.mesh.vertices.push(projection.apply(v));

        this.calculateZbuffer();
        this.drawZbuffer();

        console.log('mesh updated');
    }

    getFaceBoundingRect(f: IndexedFace): BoundingRect {
        const p1 = this.mesh.vertices[f.v1],
              p2 = this.mesh.vertices[f.v2],
              p3 = this.mesh.vertices[f.v3];
        return {
            left: Math.max(0, Math.floor(Math.min(p1.x, p2.x, p3.x))),
            right: Math.min(this.width - 1, Math.ceil(Math.max(p1.x, p2.x, p3.x))),
            top: Math.max(0, Math.floor(Math.min(p1.y, p2.y, p3.y))),
            bottom: Math.min(this.height - 1, Math.ceil(Math.max(p1.y, p2.y, p3.y)))
        };
    }

    interpolateZ(x: number, y: number, f: IndexedFace): number {
        const p1 = this.mesh.vertices[f.v1],
              p2 = this.mesh.vertices[f.v2],
              p3 = this.mesh.vertices[f.v3],
              area = 0.5 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y),
              s = 1 / (2 * area) * (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * x + (p1.x - p3.x) * y),
              t = 1 / (2 * area) * (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * x + (p2.x - p1.x) * y);
        if (s >= 0 && t >= 0 && 1 - s - t >= 0) {
            return (1 - s - t) * p1.z + s * p2.z + t * p3.z;
        } else {
            return NaN;
        }
    }

    calculateZbuffer() {
        this.zbuffer = [];
        for (let h = 0; h < this.height; h++)
            this.zbuffer.push((new Float32Array(this.width)).fill(1.0));

        for (let f of this.mesh.faces) {
            const rect = this.getFaceBoundingRect(f);
            for (let h = rect.top; h <= rect.bottom; h++) {
                for (let w = rect.left; w <= rect.right; w++) {
                    const z = this.interpolateZ(w, h, f);
                    if (z >= 0 && z < this.zbuffer[h][w]) {
                        this.zbuffer[h][w] = z;
                    }
                }
            }
        }
    }

    drawZbuffer() {
        const image = this.ctx.getImageData(0, 0, this.width, this.height),
              data = image.data,
              stride = this.width * 4;
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const offset = y * stride + x * 4,
                      color = (1 - this.zbuffer[y][x]) * 255;
                data[offset] = color;
                data[offset + 1] = color;
                data[offset + 2] = color;
                data[offset + 3] = 255;
            }
        }
        this.ctx.putImageData(image, 0, 0);
    }

    private resizeTimeout: number;
    @HostListener('window:resize')
    onResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.width = this.canvas.clientWidth;
            this.height = this.canvas.clientHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.resetMatrices();
        }, 100);
    }
}

@Component({
    selector: 'view',
    template: '<canvas view-canvas [model]="m"></canvas>',
    styles: [
        'canvas { width: 100%; height: 100%; }'
    ]
})
export class ViewComponent implements OnInit, AfterViewInit {
    @ViewChild(ViewCanvasDirective) canvas: ViewCanvasDirective;

    m: Model = null;

    constructor(private loader: LoaderService) {}

    ngOnInit() {
        this.loader.modelLoaded$.subscribe(model => this.m = model);
    }

    ngAfterViewInit() {
        console.log('view init');
        console.dir(this.canvas);
    }
}
