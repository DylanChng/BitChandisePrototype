import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitchandiseLandingComponent } from './bitchandise-landing.component';

describe('BitchandiseLandingComponent', () => {
  let component: BitchandiseLandingComponent;
  let fixture: ComponentFixture<BitchandiseLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitchandiseLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitchandiseLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
