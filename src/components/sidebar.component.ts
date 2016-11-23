import { Component, OnInit } from '@angular/core';

import { ModelDesc } from '../types/model.type';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'sidebar',
    templateUrl: 'templates/sidebar.html',
    styleUrls: [
        'stylesheets/sidebar.css'
    ]
})
export class SidebarComponent implements OnInit {
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
