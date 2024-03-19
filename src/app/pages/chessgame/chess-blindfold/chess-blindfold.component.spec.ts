import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessBlindfoldComponent } from './chess-blindfold.component';

describe('ChessBlindfoldComponent', () => {
  let component: ChessBlindfoldComponent;
  let fixture: ComponentFixture<ChessBlindfoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessBlindfoldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessBlindfoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
