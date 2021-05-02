import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangCheckComponent } from './lang-check.component';

describe('LangCheckComponent', () => {
  let component: LangCheckComponent;
  let fixture: ComponentFixture<LangCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
