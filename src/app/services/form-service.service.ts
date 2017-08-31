import { Injectable } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Injectable()
export class FormsService {

  private _VALIDATION_PATTERNS = {
    text: /[a-zA-Z]+/,
    number: /^[0-9]+$/,
    textAndNumber: /[a-zA-Z0-9]+/,
    name: /[a-zA-Z_0-9-]+/,
  };

  private _MESSAGES = {
    ERRORS: {
      forms: {
        weightedService: {
          serviceName: {
            'pattern': 'It is not correct format.',
            'required': 'Service name is required.'
          },
          serviceId: {
            'pattern': 'Service id must be a number.',
            'required': 'Service id is required.'
          },
          weight: {
            'pattern': 'Weight must be a number.',
            'required': 'Weight is required.'
          },
          weights: {
            'overflow': 'Error. Sum of weights can\'t be more than 100%'
          }
        }
      }
    }
  };

  constructor() { }

  get VALIDATION_PATTERNS () {
    return this._VALIDATION_PATTERNS;
  }

  get MESSAGES () {
    return this._MESSAGES;
  }

  public setErrors(form, formErrors: object, validationMessages: object) {
    if (!form) { return; }

    for (const field in formErrors) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control) {
        formErrors[field] = '';
      }

      if (control instanceof FormArray) {
        this.setErrors(control.controls[0], formErrors, validationMessages);
      }

      if (control && control.dirty && !control.valid) {
        const messages = validationMessages[field];
        for (const key in control.errors) {
          formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
