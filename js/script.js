function changeDisplay(element, display) {
    document.getElementById(element).style["display"] = display;
}

function precioImpuesto(precio, impuesto){

    let impuestos = {
        AFIP: 0.45,
        IVA: 0.21,
        PAIS: 0.08
    };

    return (impuestos[impuesto] * precio);
}

function conversor(precio){
    const VALOR_DOLAR = 154;

    return (precio * VALOR_DOLAR);
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
            return (parseFloat(precios[prop]).toFixed(2));
        }
    }
}

function displayValues (){
    let precio = parseFloat(document.getElementById("form_precio").value).toFixed(2);

    if (document.getElementById("radio_dolar").checked === true){
        precio = conversor(precio);
    }

    document.getElementById("monto_final").append(getValues(precio, "precio_final"));
    document.getElementById("monto_impuestos").append(getValues(precio, "precio_impuestos"));
    document.getElementById("monto_afip").append(getValues(precio, "precio_afip"));
    document.getElementById("monto_iva").append(getValues(precio, "precio_iva"));
    document.getElementById("monto_pais").append(getValues(precio, "precio_pais"));
}

function restartDisplayValues(){
    document.getElementById("monto_final").innerText = "Precio final: AR$";
    document.getElementById("monto_impuestos").innerText = "Total impuestos: AR$";
    document.getElementById("monto_afip").innerText = "Percepción impuesto RG AFIP 4815 (45%): AR$";
    document.getElementById("monto_iva").innerText = "IVA (21%): AR$";
    document.getElementById("monto_pais").innerText = "Impuesto país (8%): AR$";
}