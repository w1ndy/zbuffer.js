import { Component, OnInit } from '@angular/core';

import { ModelDesc } from '../types/model.type';

@Component({
    selector: 'sidebar',
    templateUrl: 'templates/sidebar.html',
    styleUrls: [
        'stylesheets/sidebar.css'
    ]
})
export class SidebarComponent implements OnInit {
    selectedModel: ModelDesc = null;
    model: ModelDesc[] = null;

    ngOnInit() {

    }
}
