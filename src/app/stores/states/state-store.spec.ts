import {TestBed} from '@angular/core/testing';

import {StateStore} from './state-store';
import {beforeEach, describe, expect, it} from "vitest";
import {MessageService} from 'primeng/api';

describe('StateStore', () => {
  let service: InstanceType<typeof StateStore>;

  beforeEach(() => {
      const messageServiceMock = {
          add: () => {},
          clear: () => {},
      } as unknown as MessageService;
    TestBed.configureTestingModule({
        providers: [
            { provide: MessageService, useValue: messageServiceMock },
        ],
    });
    service = TestBed.inject(StateStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
