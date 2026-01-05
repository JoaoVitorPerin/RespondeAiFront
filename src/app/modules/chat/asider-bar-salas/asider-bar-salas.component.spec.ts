/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AsiderBarSalasComponent } from './asider-bar-salas.component';

describe('AsiderBarSalasComponent', () => {
  let component: AsiderBarSalasComponent;
  let fixture: ComponentFixture<AsiderBarSalasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsiderBarSalasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsiderBarSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
