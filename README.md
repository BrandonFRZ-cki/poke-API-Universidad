# Pokédex con Angular y PokéAPI

Aplicación web interactiva desarrollada con Angular 22 para la Práctica 02.1 de *Programación y Plataformas Web*.

**Propósito:** buscar Pokémon por nombre o número, consultar su información general y su cadena evolutiva, y explorar objetos (pociones, Poké Balls, etc.) desde la misma interfaz.

**Sitio desplegado:** https://poke-api-universidad.vercel.app

**Repositorio:** https://github.com/BrandonFRZ-cki/poke-API-Universidad

## Funcionalidades

- Búsqueda por nombre o número con la tecla Enter o con el botón *Buscar*.
- Botón *Pokémon aleatorio* que consulta un Pokémon entre los 1025 disponibles.
- Ficha con imagen oficial, número, tipos, altura, peso y habilidades.
- Descripción de la especie en español (con respaldo en inglés).
- Barras de estadísticas base.
- Cadena evolutiva: al pulsar una etapa se carga ese Pokémon.
- Mensajes de carga, error de conexión y Pokémon no encontrado.
- Si se hacen varias búsquedas seguidas, solo se muestra la última.
- Sección **Tienda de objetos**: buscar un objeto por nombre (ej. `potion`, `master-ball`) con su imagen, categoría, precio y efecto.
- Explorar la tienda de 6 en 6 objetos; al seleccionar uno se muestra su ficha ampliada.

## Endpoints de PokéAPI utilizados

| Endpoint | Uso en la aplicación |
|---|---|
| `GET /api/v2/pokemon/{nombre o id}` | Imagen, tipos, altura, peso, habilidades, estadísticas y URL de la especie. |
| `GET /api/v2/pokemon-species/{id}` (URL entregada por `/pokemon`) | Descripción en español y URL de la cadena evolutiva. |
| `GET /api/v2/evolution-chain/{id}` (URL entregada por la especie) | Árbol de evoluciones, mostrado como botones navegables. |
| `GET /api/v2/item/{nombre o id}` | Objeto buscado: imagen, categoría, precio y efecto. |
| `GET /api/v2/item?offset=&limit=` | Lista paginada de objetos para explorar. |

La aplicación no tiene backend ni base de datos: todas las consultas se hacen desde el navegador con `HttpClient`.

## Estructura principal

```
src/app/
├── models/pokemon.ts     # Interfaces de Pokémon (PokemonDetalle, Especie, NodoEvolucion)
├── models/objeto.ts      # Interfaz de objeto (ObjetoDetalle)
├── services/pokemon.ts   # PokeApiService: endpoints de /pokemon, /pokemon-species y /evolution-chain
├── services/objetos.ts   # ObjetosService: endpoints de /item
├── mi-pokemon/           # Componente Pokédex (búsqueda, ficha, evoluciones)
└── objetos/              # Componente Objetos (búsqueda y lista paginada)
```

## Instalación y ejecución local

Requisitos: Node.js y npm.

```bash
npm install
npm start
```

Abrir `http://localhost:4200/` en el navegador.

Otros comandos:

```bash
npm run build   # compila la aplicación
npm test        # ejecuta las pruebas con Vitest
```

## Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. En Vercel, elegir *Add New → Project* e importar el repositorio.
3. Configurar el proyecto como Angular, con el comando de compilación `npm run build` y el directorio de salida indicado en `angular.json`.
4. Verificar que las búsquedas funcionen desde la URL pública.
