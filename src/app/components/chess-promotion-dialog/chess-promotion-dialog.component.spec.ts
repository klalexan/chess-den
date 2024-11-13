import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessPromotionDialogComponent } from './chess-promotion-dialog.component';

describe('ChessPromotionDialogComponent', () => {
  let component: ChessPromotionDialogComponent;
  let fixture: ComponentFixture<ChessPromotionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessPromotionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessPromotionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
