import { TestBed } from '@angular/core/testing';

import { ChessGameService } from './chessgame.service';

describe('ChessService', () => {
  let service: ChessGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
