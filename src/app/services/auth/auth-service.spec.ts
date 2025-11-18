import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth-service';
import { beforeEach, describe, expect, it } from "vitest";

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
