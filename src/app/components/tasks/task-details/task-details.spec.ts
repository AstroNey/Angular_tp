import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskDetails} from './task-details';
import {beforeEach, describe, expect, it} from "vitest";
import {provideRouter} from '@angular/router';

describe('TaskDetails', () => {
  let component: TaskDetails;
  let fixture: ComponentFixture<TaskDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          TaskDetails
        ],
        providers: [
            provideRouter([]),
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
