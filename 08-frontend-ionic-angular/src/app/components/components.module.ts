import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { ServerStatusComponent } from './server-status/server-status.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskCardComponent } from './task-card/task-card.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ServerStatusComponent,
    TaskFormComponent,
    TaskCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    ServerStatusComponent,
    TaskFormComponent,
    TaskCardComponent
  ]
})
export class ComponentsModule { }
