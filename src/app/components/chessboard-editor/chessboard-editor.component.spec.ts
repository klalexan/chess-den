import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessboardEditorComponent } from './chessboard-editor.component';

describe('ChessboardEditorComponent', () => {
  let component: ChessboardEditorComponent;
  let fixture: ComponentFixture<ChessboardEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessboardEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessboardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
