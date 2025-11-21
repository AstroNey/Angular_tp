import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Kanban} from './kanban';
import {beforeEach, describe, expect, it, vi} from "vitest";
import {StateStore} from '../../../stores/states/state-store';
import {ActivatedRoute} from '@angular/router';
import {TaskStore} from '../../../stores/tasks/task-store';
import {MessageService} from 'primeng/api';

describe('Kanban', () => {
  let component: Kanban;
  let fixture: ComponentFixture<Kanban>;

  beforeEach(async () => {
    const mockStateStore = {
        stateColumns: () => 3,
        states: () => [],
        loadStore: () => {},
    };
    const mockTaskStore = {
          loadStore: () => {},
    };
    const mockActivatedRoute = {};
      const messageServiceMock = {
          add: vi.fn(),
          clear: vi.fn(),
      } as unknown as MessageService;


    await TestBed.configureTestingModule({
      imports: [Kanban],
        providers: [
            { provide: StateStore, useValue: mockStateStore },
            { provide: TaskStore, useValue: mockTaskStore },
            { provide: MessageService, useValue: messageServiceMock },
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
