import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Login} from './login';
import {beforeEach, describe, expect, it, vi} from "vitest";
import {provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {

      const messageServiceMock = {
          add: vi.fn(),
          clear: vi.fn(),
      } as unknown as MessageService;
    await TestBed.configureTestingModule({
      imports: [Login],
        providers: [
            provideRouter([]),
            { provide: MessageService, useValue: messageServiceMock },
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
