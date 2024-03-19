import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessBoardGameComponent } from './chess-board-game.component';

describe('ChessBoardGameComponent', () => {
  let component: ChessBoardGameComponent;
  let fixture: ComponentFixture<ChessBoardGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessBoardGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessBoardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
