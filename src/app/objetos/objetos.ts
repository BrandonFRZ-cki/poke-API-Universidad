import { Component, computed, inject, signal } from '@angular/core';
import { ObjetosService } from '../services/objetos';
import { ObjetoDetalle } from '../models/objeto';

const TAMANO_PAGINA = 6;

@Component({
  selector: 'app-objetos',
  templateUrl: './objetos.html',
  styleUrl: './objetos.css',
})
export class Objetos {
  private api = inject(ObjetosService);
  private ultimaBusqueda = 0; // evita que una respuesta vieja pise una más reciente

  protected objeto = signal<ObjetoDetalle | null>(null);
  protected lista = signal<string[]>([]);
  protected pagina = signal(0);
  protected total = signal(0);
  protected paginas = computed(() => Math.max(1, Math.ceil(this.total() / TAMANO_PAGINA)));
  protected error = signal<string | null>(null);
  protected cargando = signal(false);

  async buscar(entrada: string) {
    const consulta = entrada.trim();
    if (!consulta) {
      this.error.set('Escribe el nombre de un objeto, por ejemplo: potion');
      return;
    }
    await this.ejecutar(async (vigente) => {
      const objeto = await this.api.getObjeto(consulta);
      if (vigente()) this.objeto.set(objeto);
    });
  }

  async cargarLista(pagina: number) {
    await this.ejecutar(async (vigente) => {
      const { nombres, total } = await this.api.getListaObjetos(pagina * TAMANO_PAGINA, TAMANO_PAGINA);
      if (vigente()) {
        this.lista.set(nombres);
        this.total.set(total);
        this.pagina.set(pagina);
      }
    });
  }

  protected formatear(nombre: string): string {
    return nombre.replace(/-/g, ' ');
  }

  private async ejecutar(tarea: (vigente: () => boolean) => Promise<void>) {
    const id = ++this.ultimaBusqueda;
    const vigente = () => id === this.ultimaBusqueda;

    this.cargando.set(true);
    this.error.set(null);
    try {
      await tarea(vigente);
    } catch (e) {
      if (vigente()) {
        this.objeto.set(null);
        this.error.set((e as Error).message);
      }
    } finally {
      if (vigente()) this.cargando.set(false);
    }
  }
}
