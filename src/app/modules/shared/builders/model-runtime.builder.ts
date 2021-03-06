import { Injectable } from '@angular/core';
import { RuntimeTypeBuilder } from './runtime-type.builder';
import { RuntimeType, ModelRuntime } from '@shared/models/_index';

@Injectable()
export class ModelRuntimeBuilder {

  constructor(private runtimeTypeBuilder: RuntimeTypeBuilder) { }

  public build(props): ModelRuntime {
    return this.toModelRuntime(props);
  }

  private toModelRuntime(props) {
    let runtimeType: RuntimeType;
    if (props['runtimeType']) {
      runtimeType = this.runtimeTypeBuilder.build(props['runtimeType']);
    }

    const modelRuntime = new ModelRuntime({
      id: props['id'],
      modelVersion: props['modelVersion'],
      modelName: props['modelName'],
      imageName: props['imageName'],
      imageTag: props['imageTag'],
      imageMD5Tag: props['imageMD5Tag'],
      runtimeType: runtimeType,
      outputFields: props['outputFields'],
      inputFields: props['inputFields'],
      created: props['created'],
      modelId: props['modelId']
    });

    return modelRuntime;
  }

}
