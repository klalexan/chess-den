import { TestBed } from '@angular/core/testing';

import { ChessgameService } from './chessgame.service';

describe('ChessgameService', () => {
  let service: ChessgameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessgameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
