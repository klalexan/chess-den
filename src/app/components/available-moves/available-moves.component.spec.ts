import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMovesComponent } from './available-moves.component';

describe('AvailableMovesComponent', () => {
  let component: AvailableMovesComponent;
  let fixture: ComponentFixture<AvailableMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableMovesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
