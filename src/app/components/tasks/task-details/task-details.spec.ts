import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskDetails} from './task-details';
import {beforeEach, describe, expect, it} from "vitest";
import {provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';

describe('TaskDetails', () => {
  let component: TaskDetails;
  let fixture: ComponentFixture<TaskDetails>;

  beforeEach(async () => {
      const messageServiceMock = {
          add: () => {},
          clear: () => {},
      } as unknown as MessageService;
    await TestBed.configureTestingModule({
        imports: [
          TaskDetails
        ],
        providers: [
            provideRouter([]),
            { provide: MessageService, useValue: messageServiceMock },
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
