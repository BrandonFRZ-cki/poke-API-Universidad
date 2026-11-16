import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-personaje',
  styleUrl: './personaje.css',
  templateUrl: './personaje.html',
})
export class Personaje {
  nombre: string;
  energia: number;
  nivel: number;
  mensaje: string;

  constructor() {
    this.nombre = 'Mewtwo';
    this.energia = 100;
    this.nivel = 1;
    this.mensaje = 'Super diper mensaje';
  }

  entrenar() {
    if (this.energia >= 10) {
      this.energia -= 10;
      this.nivel++;
      this.mensaje = `${this.nombre} entrenó y subió al nivel ${this.nivel}`;
    } else {
      this.mensaje = `No hay energía suficiente para entrenar (energía: ${this.energia})`;
    }
  } 

  descansar() {
    this.energia = Math.min(this.energia + 20, 100); // nunca pasa de 100
    this.mensaje = `${this.nombre} descansó y recuperó energía`;
  }

  saludar() {
    this.mensaje = `¡Hola! Soy ${this.nombre} y estoy en el nivel ${this.nivel}`;
  }

  reiniciar() {
    this.energia = 50;
    this.nivel = 1;
    this.mensaje = 'El personaje está listo';
  }

}
