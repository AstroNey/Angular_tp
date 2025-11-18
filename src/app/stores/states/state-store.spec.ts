import {TestBed} from '@angular/core/testing';

import {StateStore} from './state-store';

describe('StateStore', () => {
  let service: StateStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
