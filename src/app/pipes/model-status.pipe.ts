import { Pipe, PipeTransform } from '@angular/core';
import { Model } from '@models/model';

@Pipe({
  name: 'modelStatus'
})
export class ModelStatusPipe implements PipeTransform {

  transform(model: Model, args?: any): any {
    const modelStatuses = {
      deployed: 'DEPLOYED',
      created: 'CREATED',
      stopped: 'STOPPED',
      failed: 'FAILED'
    };

    if (model.currentServices && model.currentServices.length) {
      status = modelStatuses['deployed'];
    } else if (model.lastModelRuntime) {
      status = modelStatuses['stopped'];
    } else if (model.lastModelBuild.status == 'ERROR' || model.lastModelBuild.status == 'FAILED') {
      status = modelStatuses['failed'];
    } else {
      status = modelStatuses['created'];
    }

    return status;
  }

}
