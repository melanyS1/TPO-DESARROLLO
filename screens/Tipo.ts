// Agregar a Tipos.ts
export interface TareaLocal {
    id: number;         
    // INTEGER de SQLite

    task: string;
    completada: number; // 0 = pendiente, 1 = hecha
    // SQLite no tiene boolean nativo
}

export interface Tarea {
  id: string;
  task: string; // texto de la tarea
}