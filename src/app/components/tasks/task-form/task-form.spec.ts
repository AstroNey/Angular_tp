import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskForm} from './task-form';
import {beforeEach, describe, expect, it} from "vitest";
import {provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  beforeEach(async () => {
      const messageServiceMock = {
      add: () => {},
      clear: () => {},
    } as unknown as MessageService;
    await TestBed.configureTestingModule({
        imports: [TaskForm],
        providers: [
          provideRouter([]),
            { provide: MessageService, useValue: messageServiceMock },
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
