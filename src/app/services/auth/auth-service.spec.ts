import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth-service';
import {beforeEach, describe, expect, it} from "vitest";
import {MessageService} from 'primeng/api';

describe('AuthService', () => {
  let service: AuthService;

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
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
