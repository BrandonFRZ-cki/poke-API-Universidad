import { Component, inject, signal } from '@angular/core';
import { PokeApiService } from '../services/pokemon';
import { Especie, NodoEvolucion, PokemonDetalle } from '../models/pokemon';

const TOTAL_POKEMON = 1025; // Pokémon disponibles en PokéAPI hasta la generación 9

/** Convierte el árbol de evoluciones en niveles: [[base], [etapa 2], [etapa 3]...] */
function aNiveles(raiz: NodoEvolucion): string[][] {
  const niveles: string[][] = [];
  let actual = [raiz];
  while (actual.length) {
    niveles.push(actual.map((n) => n.nombre));
    actual = actual.flatMap((n) => n.hijos);
  }
  return niveles;
}

@Component({
  selector: 'app-mi-pokemon',
  templateUrl: './mi-pokemon.html',
  styleUrl: './mi-pokemon.css',
})
export class MiPokemon {
  private api = inject(PokeApiService);
  private ultimaBusqueda = 0; // evita que una respuesta vieja pise una más reciente

  protected pokemon = signal<PokemonDetalle | null>(null);
  protected especie = signal<Especie | null>(null);
  protected etapas = signal<string[][]>([]);
  protected error = signal<string | null>(null);
  protected cargando = signal(false);

  async buscar(entrada: string) {
    const consulta = entrada.trim();
    if (!consulta) {
      this.error.set('Escribe un nombre o número de Pokémon');
      return;
    }

    const id = ++this.ultimaBusqueda;
    this.cargando.set(true);
    this.error.set(null);

    try {
      const pokemon = await this.api.getPokemon(consulta);
      const especie = await this.api.getEspecie(pokemon.especieUrl);
      const cadena = await this.api.getCadena(especie.evolucionUrl);
      if (id !== this.ultimaBusqueda) return;

      this.pokemon.set(pokemon);
      this.especie.set(especie);
      this.etapas.set(aNiveles(cadena));
    } catch (e) {
      if (id !== this.ultimaBusqueda) return;
      this.limpiar();
      this.error.set((e as Error).message);
    } finally {
      if (id === this.ultimaBusqueda) this.cargando.set(false);
    }
  }

  protected aleatorio() {
    const numero = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    this.buscar(String(numero));
  }

  private limpiar() {
    this.pokemon.set(null);
    this.especie.set(null);
    this.etapas.set([]);
  }
}
