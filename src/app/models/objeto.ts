export interface ObjetoDetalle {
  id: number;
  nombre: string; // nombre técnico de PokéAPI (ej: "master-ball")
  nombreEs: string;
  imagen: string | null;
  costo: number; // en Brandon dólares (precio aleatorio)
  categoria: string;
  efecto: string;
}
