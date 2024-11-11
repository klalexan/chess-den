import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessSettingsComponent } from './chess-settings.component';

describe('ChessSettingsComponent', () => {
  let component: ChessSettingsComponent;
  let fixture: ComponentFixture<ChessSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
