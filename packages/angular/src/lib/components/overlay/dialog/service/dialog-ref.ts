import { Subject, Observable } from 'rxjs';

export class SolarisDialogRef<TResult = unknown> {
  readonly id: string;
  private readonly afterClosedSubject = new Subject<TResult | undefined>();
  private _componentInstance: unknown = null;

  constructor(id: string) {
    this.id = id;
  }

  get componentInstance(): unknown {
    return this._componentInstance;
  }

  set componentInstance(value: unknown) {
    this._componentInstance = value;
  }

  close(result?: TResult): void {
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  afterClosed(): Observable<TResult | undefined> {
    return this.afterClosedSubject.asObservable();
  }
}
