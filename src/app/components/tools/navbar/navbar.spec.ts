import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Navbar} from './navbar';
import { beforeEach, describe, expect, it } from "vitest";
import {MessageService} from 'primeng/api';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
        const messageServiceMock = {
            add: () => {},
            clear: () => {},
        } as unknown as MessageService;
    await TestBed.configureTestingModule({
      imports: [Navbar],
        providers: [
            { provide: MessageService, useValue: messageServiceMock },
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
