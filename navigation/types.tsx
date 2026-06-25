// Cada clave = nombre de una pantalla
// El valor = parametros que recibe
export type RootStackParamList = {
    Home: undefined;       
    // no recibe nada
    Detalle: {             
    nombre: string;
    nota: number;
    };
    Crud: undefined;
    Tareas: undefined;
    Ajustes: undefined;
    // recibe nombre y nota
    TareasLocal:  undefined;
};
// TypeScript usara este tipo para verificar
// que pases los parametros correctos al navegar