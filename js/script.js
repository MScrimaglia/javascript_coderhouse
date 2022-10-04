function changeDisplay(element, display) {
    document.getElementById(element).style["display"] = display;
}

function precioImpuesto(precio, impuesto){

    let impuestos = {
        AFIP: 0.45,
        IVA: 0.21,
        PAIS: 0.08
    };

    return precio * impuestos[impuesto];
}

function printValues(precio, porcentaje){
    let precios = {
        precio_afip: precioImpuesto(precio, 'AFIP'),
        precio_iva: precioImpuesto(precio, 'IVA'),
        precio_pais: precioImpuesto(precio, 'PAIS'),
        precio_final: precio + precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS'),
        precio_impuestos: precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS')
    }

    for (let prop in precios){
        if (prop == porcentaje) {
            return precios[prop];
        }
    }
}