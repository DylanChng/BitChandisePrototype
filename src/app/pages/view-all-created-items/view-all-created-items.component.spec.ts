import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCreatedItemsComponent } from './view-all-created-items.component';

describe('ViewAllCreatedItemsComponent', () => {
  let component: ViewAllCreatedItemsComponent;
  let fixture: ComponentFixture<ViewAllCreatedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllCreatedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCreatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
