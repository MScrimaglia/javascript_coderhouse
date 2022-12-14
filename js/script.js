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

function getValues(precio, porcentaje){

    // Se transforma al dato de entrada en float
    precio = parseFloat(precio);

    // Se guarda cada precio conseguido con la función precioImpuesto
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
    if (document.getElementById("radio_dolar").checked){
        precio = conversor(precio);
    }

    let categorias = ["final", "impuestos", "afip", "iva", "pais"];

    // Se añaden al texto los valores, calculados por la función getValues
    let valueDisplayGen = (texto, categoria) => document.getElementById(texto).append(parseFloat(getValues(precio, categoria)).toLocaleString('en', {minimumFractionDigits: 2}));

    // Se crea el objeto compra, donde se registran los datos de la compra actual para luego guardar en SessionStorage
    let compra = {};

    // Se ejecuta la funcion valueDisplayGen para cada texto a cambiar
    for (let categ of categorias) {
        let monto_categ = "monto_" + categ;
        let precio_categ = "precio_" + categ;

        valueDisplayGen(monto_categ, precio_categ);

        // Se agrega al objeto compra una key por cada categoria y su valor correspondiente
        compra[categ] = getValues(precio, precio_categ);
    }

    // Se agrega el objeto compra al sessionStorage
    sessionStorage.setItem(sessionStorage.length, JSON.stringify(compra));

    completeTable();

}

function changeDisplayValues(textIDs, textValues){
    // Recibe dos arrays como argumentos, asignando los valores del segundo arg a los textos con los IDs del primer arg

    function changeText(id, text) {
        document.getElementById(id).innerText = text;
    }

    // Se ejecuta la funcion por cada texto a cambiar
    for (let textID of textIDs) {
        let current_index = textIDs.findIndex(x => x == textID);
        let text_value = textValues[current_index];

        changeText(textID, text_value);
    }

}



function completeTable(){

    let tb = document.getElementById("compras_tb_body");
    let tb_total = document.getElementById("compras_tb_total_body");
    tb.innerHTML = "<tr><th></th><th>Precio inicial</th><th>Total impuestos</th><th>Precio final</th></tr>";

    let inicial_total = 0;
    let impuestos_total = 0;
    let final_total = 0;

    for (let i = 0; i < sessionStorage.length; i++) {
        //obtiene los valores de las compras del sessionStorage y los inserta en la tabla
        let compra = JSON.parse(sessionStorage.getItem(i));
        tb.innerHTML += "<tr><td>" + 'Compra ' + (i + 1) + "</td><td>" + "$" + ((parseInt(compra.final) - parseInt(compra.impuestos)).toLocaleString('en', {minimumFractionDigits: 2})) + "</td><td>" + "$" + (compra.impuestos).toLocaleString('en', {minimumFractionDigits: 2}) + "</td><td>" + "$" + (compra.final).toLocaleString('en', {minimumFractionDigits: 2}) + "</td></tr>";

        //suma los valores obtenidos para calcular el total
        inicial_total += (parseInt(compra.final) - parseInt(compra.impuestos));
        impuestos_total += parseInt(compra.impuestos);
        final_total += parseInt(compra.final);
    }

    tb_total.innerHTML = "<tr><td>" + 'Total: ' + "</td><td>" + "$" + (inicial_total).toLocaleString('en', {minimumFractionDigits: 2}) + "</td><td>" + "$" + (impuestos_total).toLocaleString('en', {minimumFractionDigits: 2}) + "</td><td id='final_total'>" + "$" + (final_total).toLocaleString('en', {minimumFractionDigits: 2}) + "</td></tr>";

}

function formSubmit(){
    //Si se supera el maximo de 10 compras en el sessionStorage no se ejecutan las funcinoes
    if (sessionStorage.length >= 10) {
        Toastify({
            text: "Máximo de compras alcanzado",
            duration: 3000
        }).showToast();
        return;
    }
    changeDisplay('form_container', 'none'); 
    displayValues();
    changeDisplay('results_container', 'flex');
    changeDisplay('lista_container', 'flex');
}

document.getElementById("btn_return").addEventListener("click", () => {
    changeDisplay('results_container', 'none'); 
    changeDisplay('form_container', 'flex');
    let textIDs = ["monto_final", "monto_impuestos", "monto_afip", "monto_iva", "monto_pais"]
    let textValues = ["Precio final: AR$", "Total impuestos: AR$", "-Percepción impuesto RG AFIP 4815 (45%): AR$", "-IVA (21%): AR$", "-Impuesto país (8%): AR$"]
    changeDisplayValues(textIDs, textValues);
});

document.getElementById("btn_restablecer").addEventListener("click", () => {
    changeDisplay('lista_container', 'none'); 
    sessionStorage.clear();
});

window.addEventListener("load", (event) => {
    sessionStorage.length == 0 ? changeDisplay('lista_container', 'none') : changeDisplay('lista_container', 'flex'); completeTable();
});

// Se consigue el valor actual de dolar en pesos mediante una api, y se transforma el string obtenido a float
const conseguirValorDolar = async () =>{
    const resp = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
    const data = await resp.json();
    let valor_dolar = data[0].casa.venta;
    valor_dolar = parseFloat(valor_dolar.replace(',','.'));
    return valor_dolar;
}

// Se asigna el valor obtenido con conseguirValorDolar a la variable global valor_dolar, usada en la funcion conversor
let valor_dolar;
setTimeout(async ()=>{valor_dolar = await conseguirValorDolar();},0);

function conversor(precio){
    // Devuelve el valor del precio en AR$
    return (precio * valor_dolar);
}
