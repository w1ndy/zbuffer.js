import { Component, OnInit, ViewChild, Directive, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ModelDesc } from '../types/model.type';
import { FileInputEvent, FileReaderEvent } from '../types/event.type';

import { LoaderService } from '../services/loader.service';

@Directive({
    selector: '[uploader]'
})
export class SidebarUploaderDirective implements AfterViewInit {
    private fileUploadedSource = new Subject<string>();
    fileUploaded$ = this.fileUploadedSource.asObservable();

    constructor(private elementRef: ElementRef, private renderer: Renderer) {}

    ngAfterViewInit() {
        const el: HTMLInputElement = this.elementRef.nativeElement;
        el.addEventListener('change', (evt: FileInputEvent) => {
            const f = evt.target.files[0];
            if (f) {
                const r = new FileReader();
                r.onload = (e: FileReaderEvent) => {
                    this.fileUploadedSource.next(e.target.result);
                };
                r.readAsText(f);
            }
        }, false);
    }
}

@Component({
    selector: 'sidebar',
    templateUrl: 'templates/sidebar.html',
    styleUrls: [
        'stylesheets/sidebar.css'
    ]
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @ViewChild(SidebarUploaderDirective) UploaderElement: SidebarUploaderDirective;

    selectedModel: ModelDesc = null;
    models: ModelDesc[] = null;
    loading: boolean = true;

    constructor(private loader: LoaderService) {}

    ngOnInit() {
        this.loader.getModelDescriptions()
            .subscribe(
                loadedModels => {
                    this.models = loadedModels;
                    this.loading = false;
                },
                err => console.error(err));
    }

    ngAfterViewInit() {
        this.UploaderElement.fileUploaded$
            .subscribe(obj => {
                this.selectedModel = null;
                this.loader.loadModelFromBuffer(obj);
            });
    }

    loadModel(m: ModelDesc) {
        this.loading = true;
        const prevModel = this.selectedModel;
        this.selectedModel = m;
        this.loader.loadModel(m)
            .subscribe(
                () => this.loading = false,
                err => {
                    this.loading = false;
                    this.selectedModel = prevModel;
                    console.log(err);
                    alert(err);
                });
    }
}
