import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskList} from './task-list';
import {beforeEach, describe, expect, it} from "vitest";
import {provideRouter} from '@angular/router';
import {State} from '../../../models/state/State';
import {MessageService} from 'primeng/api';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  beforeEach(async () => {
      const messageServiceMock = {
      add: () => {},
      clear: () => {},
    } as unknown as MessageService;
    await TestBed.configureTestingModule({
        imports: [TaskList],
        providers: [
            provideRouter([]),
            { provide: MessageService, useValue: messageServiceMock },
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;

    const mockState: State = { id: 1, state: 'TODO', color: "#FFFFFF", order: 0 };
    fixture.componentRef.setInput('state', mockState);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
