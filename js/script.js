function changeDisplay(element, display) {
    // Se cambia la propiedad display del elemento elegido por el valor elegido
    document.getElementById(element).style["display"] = display;
}

function precioImpuesto(precio, impuesto){

    // Se establece el valor de cada impuesto
    let impuestos = {
        AFIP: 0.45,
        IVA: 0.21,
        PAIS: 0.08
    };

    // Devuelve el precio introducido tras aplicarle el impuesto elegido como argumento
    return (impuestos[impuesto] * precio);
}

function conversor(precio){
    // Se establece manualmente el tipo de cambio actual
    const VALOR_DOLAR = 155;

    // // Devuelve el valor en AR$
    return (precio * VALOR_DOLAR);
}

function getValues(precio, porcentaje){

    // Se transforma al dato de entrada en float
    precio = parseFloat(precio);

    // Objeto donde se guarda cada precio conseguido con la función precioImpuesto
    let precios = {
        precio_afip: precioImpuesto(precio, 'AFIP'),
        precio_iva: precioImpuesto(precio, 'IVA'),
        precio_pais: precioImpuesto(precio, 'PAIS'),
        precio_final: precio + precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS'),
        precio_impuestos: precioImpuesto(precio, 'AFIP') + precioImpuesto(precio, 'IVA') + precioImpuesto(precio, 'PAIS')
    }

    // Se busca en el objeto precios la propiedad introducida como argumento y devuelve su valor
    for (let prop in precios){
        if (prop == porcentaje) {
            return (parseFloat(precios[prop]).toFixed(2));
        }
    }
}

function displayValues (){

    // Transforma valor introducido a float
    let precio = parseFloat(document.getElementById("form_precio").value).toFixed(2);
    
    // Si en el campo no se introduce un número el valor se establece en 0
    if (isNaN(precio)){
        precio = 0.00;
    }

    // Si se seleccionó el dólar como divisa se ejecuta la función conversor 
    if (document.getElementById("radio_dolar").checked === true){
        precio = conversor(precio);
    }

    let valueDisplayGen = (texto, categoria) => document.getElementById(texto).append(parseFloat(getValues(precio, categoria)).toFixed(2).toLocaleString('en'));

    // Se añaden al texto los valores, calculados por la función getValues
    valueDisplayGen("monto_final", "precio_final");
    valueDisplayGen("monto_impuestos", "precio_impuestos");
    valueDisplayGen("monto_afip", "precio_afip");
    valueDisplayGen("monto_iva", "precio_iva");
    valueDisplayGen("monto_pais", "precio_pais");
}

function restartDisplayValues(){
    // Reemplaza los textos por el texto inicial
    document.getElementById("monto_final").innerText = "Precio final: AR$";
    document.getElementById("monto_impuestos").innerText = "Total impuestos: AR$";
    document.getElementById("monto_afip").innerText = "Percepción impuesto RG AFIP 4815 (45%): AR$";
    document.getElementById("monto_iva").innerText = "IVA (21%): AR$";
    document.getElementById("monto_pais").innerText = "Impuesto país (8%): AR$";
}

function formSubmit(){
    changeDisplay('form_container', 'none'); 
    displayValues();
    changeDisplay('results_container', 'flex'); 
}