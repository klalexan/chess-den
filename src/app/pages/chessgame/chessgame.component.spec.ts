import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessgameComponent } from './chessgame.component';

describe('ChessgameComponent', () => {
  let component: ChessgameComponent;
  let fixture: ComponentFixture<ChessgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessgameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
