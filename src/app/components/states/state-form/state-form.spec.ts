import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StateForm} from './state-form';
import { beforeEach, describe, expect, it, vi } from "vitest";
import {signal} from '@angular/core';
import {StateStore} from '../../../stores/states/state-store';
import {Router} from '@angular/router';

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

    await TestBed.configureTestingModule({
      imports: [StateForm],
        providers: [
            { provide: StateStore, useValue: stateStoreMock },
            { provide: Router, useValue: routerSpy },
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
