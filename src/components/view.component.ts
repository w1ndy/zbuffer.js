import { Component, Directive, ViewChild, AfterViewInit, ElementRef, Renderer, HostListener } from '@angular/core';

@Directive({
    selector: '[view-canvas]'
})
export class ViewCanvasDirective {
    private canvas: HTMLCanvasElement = null;
    private ctx: CanvasRenderingContext2D = null;
    private width: number = 0;
    private height: number = 0;

    private zbuffer: Float32Array = null;

    constructor(private element: ElementRef, private renderer: Renderer) {
        this.canvas = element.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
    };

    @HostListener('window:resize')
    onResize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
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
