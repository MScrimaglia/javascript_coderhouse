function changeDisplay(element, display) {
    document.getElementById(element).style["display"] = display;
}

function precioImpuesto(precio, impuesto){

    let impuestos = {
        AFIP: 0.45,
        IVA: 0.21,
        PAIS: 0.08
    };

    return impuestos[impuesto] * precio;
}

function getValues(precio, porcentaje){
    let precios = {
        precio_afip: precioImpuesto(precio, 'AFIP'),
        precio_iva: precioImpuesto(precio, 'IVA'),
        precio_pais: precioImpuesto(precio, 'PAIS'),
        precio_final: precio + precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS'),
        precio_impuestos: precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS')
    }

    for (let prop in precios){
        if (prop == porcentaje) {
            return parseInt(precios[prop]);
        }
    }
}

function displayValues (){
    let precio = parseInt(document.getElementById("form_precio").value);
    document.getElementById("monto_final").append(getValues(precio, "precio_final"));
    document.getElementById("monto_impuestos").append(getValues(precio, "precio_impuestos"));
    document.getElementById("monto_afip").append(getValues(precio, "precio_afip"));
    document.getElementById("monto_iva").append(getValues(precio, "precio_iva"));
    document.getElementById("monto_pais").append(getValues(precio, "precio_pais"));
}