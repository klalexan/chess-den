import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichesswrapperComponent } from './lichesswrapper.component';

describe('LichesswrapperComponent', () => {
  let component: LichesswrapperComponent;
  let fixture: ComponentFixture<LichesswrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LichesswrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LichesswrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
