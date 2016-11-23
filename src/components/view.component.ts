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

    private inputMesh: Model = null;
    private mesh: Model = null;

    private pMatrix: Mat4 = null;
    private pvMatrix: Mat4 = null;

    private camera: Camera = {
        eye: new Vec4(18, 18, 6),
        at: new Vec4(0., 0., 6),
        up: new Vec4(0., 0., -1.)
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
        console.log('aspect',this.height ? this.width / this.height : this.width);
        this.pMatrix = buildProjectionMatrix(
            70.,
            this.height ? this.width / this.height : this.width,
            1., 1000.);
        this.pvMatrix = this.pMatrix.mul(buildViewMatrix(
            this.camera.eye, this.camera.at, this.camera.up));
        this.onModelUpdated(this.inputMesh);
    }
    x(_x: number): number {
        // console.log('x', _x + 0.5 * this.width);
        return (this.width * _x + 0.5 * this.width);
    }
    _x(_x: number): number {
        return _x + 0.5 * this.width;
    }

    y(_y: number): number {
        // console.log('y', _y + 0.5 * this.height);
        return (this.height * _y + 0.5 * this.height);
    }
    _y(_y: number): number {
        return _y + 0.5 * this.height;
    }

    onModelUpdated(m: Model): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (m === null) {
            this.mesh = null;
            return;
        }
        this.mesh = { vertices: [], faces: m.faces };
        this.ctx.fillStyle = 'white';
        let maxx = -Infinity, minx = Infinity, maxy = -Infinity, miny = Infinity;
        for (let v of m.vertices) {
            let pv = this.pvMatrix.apply(v);
            maxx = Math.max(maxx, pv.x());
            minx = Math.min(minx, pv.x());
            maxy = Math.max(maxy, pv.y());
            miny = Math.min(miny, pv.y());
            this.mesh.vertices.push(this.pvMatrix.apply(v));
        }
        console.log(maxx, minx, maxy, miny);
        for (let f of m.faces) {
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.x(this.mesh.vertices[f.v1].x()),
                this.y(this.mesh.vertices[f.v1].y()));
            this.ctx.lineTo(
                this.x(this.mesh.vertices[f.v2].x()),
                this.y(this.mesh.vertices[f.v2].y()));
            this.ctx.lineTo(
                this.x(this.mesh.vertices[f.v3].x()),
                this.y(this.mesh.vertices[f.v3].y()));
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.beginPath();
        console.log(
                this.x(this.mesh.vertices[0].x()),
                this.y(this.mesh.vertices[0].y()));
        console.log(
                this.x(this.mesh.vertices[1].x()),
                this.y(this.mesh.vertices[1].y()));
        console.log(
                this.x(this.mesh.vertices[2].x()),
                this.y(this.mesh.vertices[2].y()));
        console.log('mesh updated');
        console.dir(this.mesh.vertices);
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
