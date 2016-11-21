import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from '../components/navbar.component';
import { AppComponent } from '../components/app.component';
import { SidebarComponent } from '../components/sidebar.component';
import { ViewComponent } from '../components/view.component';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule.forRoot()
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        SidebarComponent,
        ViewComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class CoreModule {}
