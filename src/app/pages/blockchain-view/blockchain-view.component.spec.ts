import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainViewComponent } from './blockchain-view.component';

describe('BlockchainViewComponent', () => {
  let component: BlockchainViewComponent;
  let fixture: ComponentFixture<BlockchainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockchainViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
