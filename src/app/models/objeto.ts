export interface ObjetoDetalle {
  id: number;
  nombre: string; // nombre técnico de PokéAPI (ej: "master-ball")
  nombreEs: string;
  imagen: string | null;
  costo: number; // en Pokédólares
  categoria: string;
  efecto: string;
}
