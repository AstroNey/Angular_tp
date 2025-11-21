import {TestBed} from '@angular/core/testing';

import {StateStore} from './state-store';
import {beforeEach, describe, expect, it} from "vitest";

describe('StateStore', () => {
  let service: InstanceType<typeof StateStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
