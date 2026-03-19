import { TestBed } from '@angular/core/testing';
import { TmdbServiceTs } from './tmdb.service.js';

describe('TmdbServiceTs', () => {
  let service: TmdbServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
