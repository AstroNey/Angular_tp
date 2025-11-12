import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskForm} from './task-form';
import { beforeEach, describe, expect, it } from "vitest";
import {provideRouter} from '@angular/router';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [TaskForm],
        providers: [
          provideRouter([]),
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
