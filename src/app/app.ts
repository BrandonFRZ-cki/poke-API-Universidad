import { Component, signal } from '@angular/core';
import { MiPokemon } from './mi-pokemon/mi-pokemon';
import { Objetos } from './objetos/objetos';

@Component({
  imports: [MiPokemon, Objetos],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('poke-API');
}
