/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PostByIdComponent } from './post-by-id.component';

describe('PostByIdComponent', () => {
  let component: PostByIdComponent;
  let fixture: ComponentFixture<PostByIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostByIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
