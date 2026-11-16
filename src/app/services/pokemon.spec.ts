import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PokeApiService } from './pokemon';

describe('PokeApiService', () => {
  let service: PokeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(PokeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
