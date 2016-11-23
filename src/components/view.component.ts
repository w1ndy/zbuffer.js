import { Component, Directive, ViewChild, AfterViewInit, ElementRef, Renderer, HostListener } from '@angular/core';

import { Vec4, Mat4, buildProjectionMatrix, buildViewMatrix } from '../types/linalg.type';
import { Camera } from '../types/view.type';

@Directive({
    selector: '[view-canvas]'
})
export class ViewCanvasDirective {
    private canvas: HTMLCanvasElement = null;
    private ctx: CanvasRenderingContext2D = null;
    private width: number = 0;
    private height: number = 0;

    private pMatrix: Mat4 = null;
    private pvMatrix: Mat4 = null;

    private camera: Camera = {
        eye: new Vec4(-1.8, -1.8, 0.6),
        at: new Vec4(0., 0., 0.6),
        up: new Vec4(0., 0., 1.)
    };

    private zbuffer: Float32Array = null;

    constructor(private element: ElementRef, private renderer: Renderer) {
        this.canvas = element.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.resetMatrices();
    };

    resetMatrices(): void {
        this.pMatrix = buildProjectionMatrix(
            70.,
            this.height ? this.width / this.height : this.width,
            1., 1000.);
        let v = buildViewMatrix(
            this.camera.eye, this.camera.at, this.camera.up);
        this.pvMatrix = this.pMatrix.mul(buildViewMatrix(
            this.camera.eye, this.camera.at, this.camera.up));
        console.dir(this.pMatrix);
        console.dir(v);
        console.dir(this.pvMatrix);
    }

    private resizeTimeout: number;
    @HostListener('window:resize')
    onResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.width = this.canvas.clientWidth;
            this.height = this.canvas.clientHeight;
            this.resetMatrices();
        }, 100);
    }
}

@Component({
    selector: 'view',
    template: '<canvas view-canvas></canvas>',
    styles: [
        'canvas { width: 100%; height: 100%; }'
    ]
})
export class ViewComponent implements AfterViewInit {
    @ViewChild(ViewCanvasDirective) canvas: ViewCanvasDirective;

    ngAfterViewInit() {
        console.log('view init');
        console.dir(this.canvas);
    }
}
