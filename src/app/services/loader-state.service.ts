import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LoaderState } from './loader';

@Injectable()
export class LoaderStateService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  showLoader() {
    this.loaderSubject.next(<LoaderState>{show: true});
  }

  hideLoader() {
    this.loaderSubject.next(<LoaderState>{show: false});
  }

}
