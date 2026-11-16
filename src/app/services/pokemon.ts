import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Especie, NodoEvolucion, PokemonDetalle } from '../models/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Respuestas de PokéAPI (solo los campos que se usan)
interface PokemonApi {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
  species: { url: string };
}

interface EspecieApi {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  evolution_chain: { url: string };
}

interface NodoApi {
  species: { name: string };
  evolves_to: NodoApi[];
}

interface CadenaApi {
  chain: NodoApi;
}

function convertirNodo(nodo: NodoApi): NodoEvolucion {
  return {
    nombre: nodo.species.name,
    hijos: nodo.evolves_to.map(convertirNodo),
  };
}

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private http = inject(HttpClient);

  /** Endpoint /pokemon/{id|nombre} */
  async getPokemon(consulta: string): Promise<PokemonDetalle> {
    const clave = encodeURIComponent(consulta.trim().toLowerCase());
    const data = await this.pedir<PokemonApi>(
      `${BASE_URL}/pokemon/${clave}`,
      `No se encontró ningún Pokémon con "${consulta.trim()}"`,
    );

    return {
      id: data.id,
      nombre: data.name,
      tipos: data.types.map((t) => t.type.name),
      imagen: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
      altura: data.height / 10,
      peso: data.weight / 10,
      habilidades: data.abilities.map((a) => a.ability.name),
      especieUrl: data.species.url,
      estadisticas: data.stats.map((s) => ({ nombre: s.stat.name, valor: s.base_stat })),
    };
  }

  /** Endpoint /pokemon-species/{id} (se pasa la URL que entrega /pokemon) */
  async getEspecie(url: string): Promise<Especie> {
    const data = await this.pedir<EspecieApi>(url);
    const entrada =
      data.flavor_text_entries.find((e) => e.language.name === 'es') ??
      data.flavor_text_entries.find((e) => e.language.name === 'en');

    return {
      descripcion: entrada ? entrada.flavor_text.replace(/[\n\f]/g, ' ') : 'Sin descripción disponible.',
      evolucionUrl: data.evolution_chain.url,
    };
  }

  /** Endpoint /evolution-chain/{id} (se pasa la URL que entrega la especie) */
  async getCadena(url: string): Promise<NodoEvolucion> {
    const data = await this.pedir<CadenaApi>(url);
    return convertirNodo(data.chain);
  }

  private async pedir<T>(url: string, mensajeNoEncontrado?: string): Promise<T> {
    try {
      return await firstValueFrom(this.http.get<T>(url));
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 404 && mensajeNoEncontrado) {
        throw new Error(mensajeNoEncontrado);
      }
      throw new Error('No se pudo consultar PokéAPI. Revisa tu conexión e intenta de nuevo.');
    }
  }
}
