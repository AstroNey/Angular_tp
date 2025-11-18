import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskCard} from './task-card';
import {beforeEach, describe, expect, it, vi} from "vitest";
import {Task} from '../../../../models/task/Task';
import {ActivatedRoute, provideRouter, Router, RouterLink} from '@angular/router';
import {By} from '@angular/platform-browser';
import {TaskForm} from '../../task-form/task-form';
import {TaskDetails} from '../../task-details/task-details';
import {Location} from '@angular/common';
import {TaskStore} from '../../../../stores/tasks/task-store';
import {Kanban} from '../../../pages/kanban/kanban';

describe('TaskCard', () => {
    let component: TaskCard;
    let fixture: ComponentFixture<TaskCard>;
    let nativeElement: HTMLElement;
    let router: Router;
    let location: Location;
    let taskStore: any;
    let mockTask: Task;

    beforeEach(async () => {
        const taskStoreMock = {
            deleteTaskById: vi.fn().mockResolvedValue(undefined),
        };
        await TestBed.configureTestingModule({
            imports: [
                TaskCard,
                RouterLink
            ],
            providers: [
                provideRouter([
                    { path: '', component: Kanban },
                    { path: 'details/:id', component: TaskDetails },
                    { path: 'update/:id', component: TaskForm }
                ]),
                { provide: TaskStore, useValue: taskStoreMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskCard);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        taskStore = TestBed.inject(TaskStore);

        mockTask = {
            id: 1,
            title: 'Tâche de test',
            description: 'Ceci est une description de test',
            state: {id: 1, state: 'TODO', color: '#FFFFFF'},
            order: 0
        } as Task;

        fixture.componentRef.setInput('task', mockTask);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render', () => {
        const titleElement = nativeElement.querySelector('#taskTitle');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain(fixture.componentRef.instance.task()?.title);
        const descriptionElement = nativeElement.querySelector('#taskDescription');
        expect(descriptionElement).toBeTruthy();
        expect(descriptionElement?.textContent).toContain(fixture.componentRef.instance.task()?.description);
    });

    it('should render actions buttons', () => {
        const editButton = fixture.debugElement.query(
            By.css('#updateTaskButton')
        );
        const deleteButton = fixture.debugElement.query(
            By.css('#deleteTaskButton')
        );

        expect(editButton).toBeTruthy();
        expect(deleteButton).toBeTruthy();
    });

    it('should navigate to update page when edit button is clicked', async () => {
        const navigateSpy = vi.spyOn(router, 'navigate');
        const editButton = fixture.nativeElement.querySelector('#updateTaskButton');
        const activatedRoute = TestBed.inject(ActivatedRoute);

        editButton.click();
        await fixture.whenStable();

        expect(navigateSpy).toHaveBeenCalledWith(['update', 1], { relativeTo: activatedRoute });
    });

    it('should navigate to details when card is clicked', async () => {
        const cardContainer = fixture.debugElement.query(
            By.css('.card-container')
        );

        cardContainer.nativeElement.click();
        await fixture.whenStable();

        expect(location.path()).toBe('/details/1');
    });

    it('should not navigate to details when edit button is clicked', async () => {
        const navigateSpy = vi.spyOn(router, 'navigate');
        const editButton = fixture.nativeElement.querySelector('#updateTaskButton');
        const activatedRoute = TestBed.inject(ActivatedRoute);

        editButton.click();
        await fixture.whenStable();

        // Should navigate to update, not details
        expect(navigateSpy).not.toHaveBeenCalledWith(['details', 1], expect.anything());
        expect(navigateSpy).toHaveBeenCalledWith(['update', 1], { relativeTo: activatedRoute });
    });

    it('should call taskStore.deleteTaskById when delete button is clicked', async () => {
        const deleteButton = fixture.nativeElement.querySelector('#deleteTaskButton');

        deleteButton.click();
        await fixture.whenStable();

        expect(taskStore.deleteTaskById).toHaveBeenCalledWith(1);
        expect(taskStore.deleteTaskById).toHaveBeenCalledTimes(1);
    });
});
