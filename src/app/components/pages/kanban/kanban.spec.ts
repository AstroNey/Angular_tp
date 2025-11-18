import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Kanban} from './kanban';
import {beforeEach, describe, expect, it} from "vitest";
import {StateStore} from '../../../stores/states/state-store';
import {ActivatedRoute} from '@angular/router';

describe('Kanban', () => {
  let component: Kanban;
  let fixture: ComponentFixture<Kanban>;

  beforeEach(async () => {
    const mockStateStore = {
        stateColumns: () => 3,
        states: () => [],
        updateStatesOrder: () => {},
    };
    const mockActivatedRoute = {};
    await TestBed.configureTestingModule({
      imports: [Kanban],
        providers: [
            { provide: StateStore, useValue: mockStateStore },
            { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kanban);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
