export function zeroFill( number:number, width:number ){
    width -= number.toString().length;
    if ( width > 0 )
    {
        return new Array( width + (/\./.test( number.toString() ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // siempre devuelve tipo cadena
}