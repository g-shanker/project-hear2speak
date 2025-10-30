import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slicer } from './slicer';

describe('Slicer', () => {
  let component: Slicer;
  let fixture: ComponentFixture<Slicer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slicer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Slicer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
