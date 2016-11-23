import { Component } from '@angular/core';

import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
    providers: [
        LoaderService
    ]
})
export class AppComponent {}
