// suma los valores de una array de objetos
// donde:
// * key .- es el valor del objeto que se sumara, va como string

// interface SumaArrayObjRepetidos {
//     array:Array<any>;
//     nombreRepetido:string;
//     nombreAcumulado:string;
// }

export const sumaArrayObj = (array:Array<any>, key:any) => {
    return array.reduce((a, b) => {
        return Number(a) + Number((b[key] || 0))
    }, 0);
}


export const sumaArrayObjRepetidos = (array:Array<any>, nombreRepetido:string, nombreAcumulado:string) => { 
    return array.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento[nombreRepetido] === valorActual[nombreRepetido]);
        if (elementoYaExiste) {
            return acumulador.map((elemento) => {
                if (elemento[nombreRepetido] === valorActual[nombreRepetido]) {
                    return {
                        ...elemento,
                        [nombreAcumulado]: Number(elemento[nombreAcumulado]) + Number(valorActual[nombreAcumulado])
                    }
                }
            
                return elemento;
            });
        }
        
        return [...acumulador, valorActual];
    }, []);
}