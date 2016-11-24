import { Component, Directive, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer, HostListener, Input } from '@angular/core';

import { LoaderService } from '../services/loader.service';

import { Vec4, Mat4, buildProjectionMatrix, buildViewMatrix } from '../types/linalg.type';
import { Model } from '../types/model.type';
import { Camera } from '../types/view.type';

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
    private scaleX: number = 0;
    private scaleY: number = 0;

    private inputMesh: Model = null;
    private mesh: Model = null;

    private pMatrix: Mat4 = null;
    private pvMatrix: Mat4 = null;

    private camera: Camera = {
        eye: new Vec4(10, 10, 10),
        at: new Vec4(0., 0., 0),
        up: new Vec4(0., 1, 0)
    };

    private zbuffer: Float32Array = null;

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
        const fovy = 60., near = 1, far = 5.,
              aspect = this.height ? this.width / this.height : this.width,
              halfH = Math.tan(fovy / 180. * Math.PI * 0.5) * near,
              scale = this.height * 0.5 / halfH;
        this.pMatrix = buildProjectionMatrix(
            fovy, aspect, near, far);
        console.log(scale);
        this.scaleX = scale * aspect;
        this.scaleY = scale;
        this.pvMatrix = this.pMatrix.mul(buildViewMatrix(
            this.camera.eye, this.camera.at, this.camera.up));
        this.onModelUpdated(this.inputMesh);
    }

    x(_x: number): number {
        return (this.scaleX * _x + 0.5 * this.width);
    }

    y(_y: number): number {
        return (this.scaleY * _y + 0.5 * this.height);
    }

    onModelUpdated(m: Model): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (m === null) {
            this.mesh = null;
            return;
        }
        this.mesh = { vertices: [], faces: m.faces, desc: m.desc };
        this.ctx.fillStyle = 'white';
        for (let v of m.vertices)
            this.mesh.vertices.push(this.pvMatrix.apply(v));
        for (let f of m.faces) {
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.x(this.mesh.vertices[f.v1].x),
                this.y(this.mesh.vertices[f.v1].y));
            this.ctx.lineTo(
                this.x(this.mesh.vertices[f.v2].x),
                this.y(this.mesh.vertices[f.v2].y));
            this.ctx.lineTo(
                this.x(this.mesh.vertices[f.v3].x),
                this.y(this.mesh.vertices[f.v3].y));
            this.ctx.closePath();
            this.ctx.fill();
        }
        console.log('mesh updated');
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
