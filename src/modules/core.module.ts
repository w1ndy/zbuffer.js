import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule, JsonpModule } from '@angular/http';

import { NavbarComponent } from '../components/navbar.component';
import { AppComponent } from '../components/app.component';
import { SidebarComponent, SidebarUploaderDirective } from '../components/sidebar.component';
import { ViewComponent, ViewCanvasDirective } from '../components/view.component';

import { LoaderService } from '../services/loader.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        NgbModule.forRoot()
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        SidebarComponent,
        SidebarUploaderDirective,
        ViewComponent,
        ViewCanvasDirective
    ],
    bootstrap: [
        AppComponent
    ]
})
export class CoreModule {}
