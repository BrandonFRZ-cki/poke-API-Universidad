import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ObjetoDetalle } from '../models/objeto';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Respuestas de PokéAPI (solo los campos que se usan)
interface ObjetoApi {
  id: number;
  name: string;
  cost: number;
  category: { name: string };
  sprites: { default: string | null };
  names: { name: string; language: { name: string } }[];
  effect_entries: { short_effect: string; language: { name: string } }[];
}

interface ListaApi {
  count: number;
  results: { name: string; url: string }[];
}

/** Precio simulado en "Brandon dólares": número al azar entre 10 y 500, generado cada vez que se carga el objeto */
function precioAleatorio(): number {
  return Math.floor(Math.random() * 491) + 10;
}

@Injectable({ providedIn: 'root' })
export class ObjetosService {
  private http = inject(HttpClient);

  /** Endpoint /item/{id|nombre} */
  async getObjeto(consulta: string): Promise<ObjetoDetalle> {
    const texto = consulta.trim();
    const clave = encodeURIComponent(texto.toLowerCase().replace(/\s+/g, '-'));
    const data = await this.pedir<ObjetoApi>(
      `${BASE_URL}/item/${clave}`,
      `No se encontró ningún objeto con "${texto}"`,
    );

    return {
      id: data.id,
      nombre: data.name,
      nombreEs: data.names.find((n) => n.language.name === 'es')?.name ?? data.name,
      imagen: data.sprites.default,
      costo: precioAleatorio(),
      categoria: data.category.name,
      efecto:
        data.effect_entries.find((e) => e.language.name === 'en')?.short_effect ??
        'Sin descripción disponible.',
    };
  }

  /** Endpoint /item con paginación (offset y limit) */
  async getListaObjetos(offset: number, limite: number): Promise<{ nombres: string[]; total: number }> {
    const data = await this.pedir<ListaApi>(`${BASE_URL}/item`, undefined, { offset, limit: limite });
    return { nombres: data.results.map((r) => r.name), total: data.count };
  }

  private async pedir<T>(
    url: string,
    mensajeNoEncontrado?: string,
    params?: Record<string, number>,
  ): Promise<T> {
    try {
      return await firstValueFrom(this.http.get<T>(url, { params }));
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 404 && mensajeNoEncontrado) {
        throw new Error(mensajeNoEncontrado);
      }
      throw new Error('No se pudo consultar PokéAPI. Revisa tu conexión e intenta de nuevo.');
    }
  }
}
