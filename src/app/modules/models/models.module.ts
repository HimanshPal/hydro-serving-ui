import { NgModule } from '@angular/core';
import { ModelsRoutingModule } from './models.router';
import { SharedModule } from '@shared/shared.module';
import { CommonModule, Location } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { ModelsWrapperComponent } from './_index';
import { ModelsListComponent } from './_index';
import { SingleModelComponent } from './_index';
import { ModelDetailsComponent } from './_index';
import { ModelsSidebarComponent } from './_index';
import { StoreModule } from '@ngrx/store';
import { ModelsReducer, ModelServiceReducer, ModelRuntimeReducer, ServicesReducer } from '@shared/reducers/_index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


@NgModule({
    imports: [
        ModelsRoutingModule,
        CommonModule,
        SharedModule,
        MomentModule,
        MdlModule,
        MdlSelectModule,
        FlexLayoutModule,
        FormsModule,
        StoreModule.forRoot({
          models: ModelsReducer,
          modelService: ModelServiceReducer,
          modelRuntimes: ModelRuntimeReducer,
          services: ServicesReducer }),
          StoreDevtoolsModule.instrument({
            maxAge: 25
          })
    ],
    declarations: [
        ModelsWrapperComponent,
        ModelsListComponent,
        SingleModelComponent,
        ModelDetailsComponent,
        ModelsSidebarComponent
    ]
})
export class ModelsModule { }
