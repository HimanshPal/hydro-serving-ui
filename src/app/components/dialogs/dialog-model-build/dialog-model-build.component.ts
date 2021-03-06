import { Component, OnInit, InjectionToken, HostListener, Inject } from '@angular/core';
import { MdlDialogReference, MdlDialogService } from '@angular-mdl/core';
import { MdlSnackbarService } from '@angular-mdl/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpRuntimeTypesService } from '@shared/_index';
import { BuildModelService } from '@shared/_index';
import { HttpModelsService } from '@shared/_index';
import { ModelStore } from '@shared/stores/_index';
import { ModelStatusPipe } from '../../../modules/shared/pipes/model-status.pipe';
import {
  ModelsService,
  GET_MODELS
} from '@shared/_index';

import { Store } from '@ngrx/store';
import { AppState } from '@shared/models/_index';
import * as Actions from '@shared/actions/_index';
import { ModelBuilder } from '@shared/builders/_index';
import 'rxjs/add/operator/mergeMap';

export let injectableModelOptions = new InjectionToken<object>('injectableModelOptions');

@Component({
  selector: 'hydro-dialog-model-build',
  templateUrl: './dialog-model-build.component.html',
  styleUrls: ['./dialog-model-build.component.scss'],
  providers: [MdlSnackbarService, FormBuilder, BuildModelService, HttpModelsService, ModelStatusPipe]
})
export class DialogModelBuildComponent implements OnInit {
  public buildModelForm: FormGroup;
  public currentModelRuntimeType;
  public runtimeTypes;
  public data;
  public model;
  public modelType: string;

  constructor(private fb: FormBuilder,
              public dialogRef: MdlDialogReference,
              private mdlSnackbarService: MdlSnackbarService,
              private httpRuntimeTypesService: HttpRuntimeTypesService,
              @Inject(injectableModelOptions) data,
              private buildModelService: BuildModelService,
              private modelStore: ModelStore,
              private modelStatusPipe: ModelStatusPipe,
              private store: Store<AppState>,
              private modelsService: ModelsService,
              private modelBuilder: ModelBuilder
              ) {
    this.model = data;
  }

  ngOnInit() {
    const self = this;
    this.createBuildModelForm();
    this.httpRuntimeTypesService.getAll().subscribe((runtimeType) => {
      this.runtimeTypes = runtimeType;
      self.currentModelRuntimeType = self.model.runtimeType.id;
    });
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialogRef.hide();
  }

  private createBuildModelForm() {
    const modelStatus = this.modelStatusPipe.transform(this.model);
    this.modelType = this.model.lastModelRuntime.runtimeType ? this.model.lastModelRuntime.runtimeType.tags : '';
    this.buildModelForm = this.fb.group({
      modelId: [this.model.id],
      name: [this.model.name],
      status: [modelStatus],
      runtimeType: [this.model.runtimeType, [Validators.required]],
      modelType: [this.modelType, []],
      source: [this.model.source, []],
      inputFields: [this.model.inputFields, []],
      outputFields: [this.model.outputFields, []],
    });
  }

  submitBuildModelForm(buildModelForm) {
    const controls = buildModelForm.controls;
    const modelOptions = {
      id: controls.modelId.value,
      name: controls.name.value,
      source: controls.source.value,
      status: controls.status.value,
      runtimeTypeId: +controls.runtimeType.value,
      modelType: controls.modelType.value,
      inputFields: controls.inputFields.value,
      outputFields: controls.outputFields.value
    };

    this.modelStore.updateModel(modelOptions)
      .flatMap((model) => {
        return this.buildModelService.build({modelVersion: null, modelId: modelOptions.id, runtimeTypeId: 1});
      })
      .finally(() => {
        this.modelStore.getAll();
      })
      .subscribe((model) => {
        this.dialogRef.hide();
        this.mdlSnackbarService.showSnackbar({
          message: `Model was successfully updated`,
          timeout: 5000
        });
        this.modelsService.getModels().first()
        .subscribe(models => {
            this.store.dispatch({ type: Actions.GET_MODELS, payload: models.map(this.modelBuilder.build, this.modelBuilder) });
        });
      }, (error) => {
        this.mdlSnackbarService.showSnackbar({
          message: `Error: ${error}`,
          timeout: 5000
        });
      });
  }

}
