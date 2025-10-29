import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUpdate } from './task-update';

describe('TaskUpdate', () => {
  let component: TaskUpdate;
  let fixture: ComponentFixture<TaskUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
