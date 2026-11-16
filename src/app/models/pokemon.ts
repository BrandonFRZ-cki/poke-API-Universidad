export interface Estadistica {
  nombre: string;
  valor: number;
}

export interface PokemonDetalle {
  id: number;
  nombre: string;
  tipos: string[];
  imagen: string | null;
  altura: number; // metros
  peso: number; // kilogramos
  habilidades: string[];
  especieUrl: string;
  estadisticas: Estadistica[];
}

export interface Especie {
  descripcion: string;
  evolucionUrl: string;
}

export interface NodoEvolucion {
  nombre: string;
  hijos: NodoEvolucion[];
}
