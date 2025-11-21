import {TestBed} from '@angular/core/testing';

import {StateService} from './state-service';
import { beforeEach, describe, expect, it } from "vitest";
import {MessageService} from 'primeng/api';

describe('StateService', () => {
  let service: StateService;

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
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
