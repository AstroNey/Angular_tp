import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StateForm} from './state-form';
import { beforeEach, describe, expect, it, vi } from "vitest";
import {signal} from '@angular/core';
import {StateStore} from '../../../stores/states/state-store';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';

describe('StateForm', () => {
  let component: StateForm;
  let fixture: ComponentFixture<StateForm>;
  let routerSpy: any;
  let stateStoreMock: any;

  beforeEach(async () => {
      stateStoreMock = {
          states: signal([]),
          addState: vi.fn(),
      };
      routerSpy = {
          navigate: vi.fn(),
      };
      const mockActivatedRoute = {
          snapshot: {
              paramMap: {
                  get: (key: string) => {
                      if (key === 'order') return '1';
                      return null;
                  }
              }
          }
      };
      const messageServiceMock = {
          add: () => {},
          clear: () => {},
      } as unknown as MessageService;

    await TestBed.configureTestingModule({
      imports: [StateForm],
        providers: [
            { provide: StateStore, useValue: stateStoreMock },
            { provide: MessageService, useValue: messageServiceMock },
            { provide: Router, useValue: routerSpy },
            { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
