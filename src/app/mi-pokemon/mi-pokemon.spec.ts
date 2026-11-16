import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MiPokemon } from './mi-pokemon';

describe('MiPokemon', () => {
  let component: MiPokemon;
  let fixture: ComponentFixture<MiPokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPokemon],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MiPokemon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
