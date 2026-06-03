
const bebidas = document.querySelectorAll(".contenedor__bebidas-articulo");
const monedas = document.querySelectorAll(".contenedor__informacion-monedas-valor");
const billetes = document.querySelectorAll(".contenedor__informacion-billetes-valor");
const saldo = document.querySelector(".contenedor__informacion-saldo-precio");
const productoSel = document.querySelector(".contenedor__informacion-seleccion-bebido");
const comprar = document.querySelector(".contenedor__informacion-acciones-comprar");
const cancelar = document.querySelector(".contenedor__informacion-acciones-cancelar");
const sonidoMoneda = document.getElementById("sonidoMoneda");
const sonidoBebida = document.getElementById("sonidoLata");
const inOutDatos = document.querySelectorAll(".contenedor__bebidas-acciones-btn");

const dinero = [20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];

let datosMaquina = [
    {"bebidasPrecio": [
        {bebida: "Coca-Cola", precio: 1.20, stock: 1},
        {bebida: "Fanta", precio: 1, stock: 5},
        {bebida: "Cerveza", precio: 1.55, stock: 10},
        {bebida: "Red-Bull", precio: 2, stock: 2},
        {bebida: "Agua Mineral", precio: 0.60, stock: 7},
        {bebida: "Agua con Gas", precio: 0.95, stock: 5}
    ]}
    ,
    {"ventas": 0},
    {"recaudacion": 0}
];
let bebidasPrecio = [];
let ventas;
let recaudacion;
let valorMoneda = 0;
let productoSeleccionado = "";


let datosGuardados = localStorage.getItem("datosMaquina");
    if (datosGuardados) {
        let datos = JSON.parse(datosGuardados);
        datosMaquina[0] = datos[0];
        datosMaquina[1] = datos[1];
        datosMaquina[2] = datos[2];
        actualizarStockUI();
    } else {

        datosMaquina = [
            {"bebidasPrecio": [
                {bebida: "Coca-Cola", precio: 1.20, stock: 1},
                {bebida: "Fanta", precio: 1, stock: 5},
                {bebida: "Cerveza", precio: 1.55, stock: 10},
                {bebida: "Red-Bull", precio: 2, stock: 2},
                {bebida: "Agua Mineral", precio: 0.60, stock: 7},
                {bebida: "Agua con Gas", precio: 0.95, stock: 5}
            ]},
            {"ventas": 0},
            {"recaudacion": 0}
            ];
    
        guardarLocalStorage();
    }



monedas.forEach(boton => {

    boton.addEventListener("click", (e) => {
        valorMoneda += Number(e.target.value);
        saldo.textContent = `SALDO: ${valorMoneda.toFixed(2)} €`;
        sonidoMoneda.play();
    });

});

billetes.forEach(boton => {

    boton.addEventListener("click", (e) => {
        valorMoneda += Number(e.target.value);
        saldo.textContent = `SALDO: ${valorMoneda.toFixed(2)} €`;
        sonidoMoneda.play();
    });

});

bebidas.forEach(boton => {

    boton.addEventListener("click", (e) => {
        const tarjetaClicada = e.currentTarget;
        const titulo = tarjetaClicada.querySelector(".contenedor__bebidas-articulo-titulo").textContent;
        const objetoBebida = datosMaquina[0].bebidasPrecio.find(bebidaTemp => bebidaTemp.bebida === titulo);

        if (objetoBebida && objetoBebida.stock === 0) {
            window.alert("No hay stock disponible");
            return;
        }

        productoSeleccionado = titulo;
        productoSel.textContent = productoSeleccionado;
    });
});

inOutDatos.forEach(boton => {

    boton.addEventListener("click", (e) => {

        if (boton.value === "Export"){

            const datosTexto = JSON.stringify(datosMaquina);
            const archivo = new Blob([datosTexto], { type: "application/json" });
            const enlace = document.createElement("a");
            enlace.href = URL.createObjectURL(archivo);
            enlace.download = "datos.json";
            enlace.click();
            URL.revokeObjectURL(enlace.href);

        } else if (boton.value === "Import"){

            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.addEventListener("change", (e) => {
                const archivo = e.target.files[0];
                const lector = new FileReader();
                lector.onload = (e) => {
                    const datos = JSON.parse(e.target.result);
                    datosMaquina[0] = datos[0];
                    datosMaquina[1] = datos[1];
                    datosMaquina[2] = datos[2];
                    guardarLocalStorage();
                    actualizarStockUI();
                };
                lector.readAsText(archivo);
            });
            input.click();

        } else if (boton.value === "Reset"){

            datosMaquina = [
            {"bebidasPrecio": [
                {bebida: "Coca-Cola", precio: 1.20, stock: 1},
                {bebida: "Fanta", precio: 1, stock: 5},
                {bebida: "Cerveza", precio: 1.55, stock: 10},
                {bebida: "Red-Bull", precio: 2, stock: 2},
                {bebida: "Agua Mineral", precio: 0.60, stock: 7},
                {bebida: "Agua con Gas", precio: 0.95, stock: 5}
            ]},
            {"ventas": 0},
            {"recaudacion": 0}
            ];

            guardarLocalStorage();
            actualizarStockUI();
            window.alert("Datos reseteados");
        }
    });

});


comprar.addEventListener("click", () => {

    comprarBebida();


    /*if (valorMoneda >= 1 && productoSel.textContent !== "No hay producto seleccionado"){
        valorMoneda -= 1;
        saldo.textContent = `SALDO: ${valorMoneda.toFixed(2)} €`;
        productoSel.textContent = "No hay producto seleccionado";
        sonidoBebida.play();
        window.alert("Gracias por su compra!")

    }*/
});

cancelar.addEventListener("click", () => {
    // Si no hay saldo ni bebida seleccionada, no hay nada que cancelar
    if (valorMoneda === 0 && productoSeleccionado === "") {
        window.alert("No hay nada que cancelar");
        return;
    }

    // Si se ha ingresado saldo, se devuelve la totalidad
    if (valorMoneda > 0) {
        const cambioDetalle = calcularCambio(valorMoneda);
        window.alert(`Compra cancelada \n Aquí tiene su dinero de ${valorMoneda.toFixed(2)} € : ${cambioDetalle}`);
        valorMoneda = 0;
        saldo.textContent = `SALDO: 0.00 €`;
    }

    // Se limpia la selección en cualquier caso
    productoSel.textContent = "No hay producto seleccionado";
    productoSeleccionado = "";
});

function comprarBebida() {

    if (productoSeleccionado === ""){
        window.alert("No hay producto seleccionado");
        return;
    }

    const objetoBebida = datosMaquina[0].bebidasPrecio.find(bebidaTemp => bebidaTemp.bebida === productoSeleccionado);

    if (objetoBebida.stock === 0){
        window.alert("No hay stock disponible");
        return;
    }

    if (valorMoneda >= objetoBebida.precio){
        const saldoRestante = valorMoneda - objetoBebida.precio;
        objetoBebida.stock--;
        actualizarStockUI();
        
        const cambioDetalle = calcularCambio(saldoRestante);
        
        productoSel.textContent = "No hay producto seleccionado";
        sonidoBebida.play();
        window.alert(`Gracias por comprar ${productoSeleccionado} \nAqui su cambio de ${saldoRestante.toFixed(2)} € : ${cambioDetalle}`);
        
        productoSeleccionado = "";
        valorMoneda = 0;
        saldo.textContent = `SALDO: 0.00 €`;
        
        datosMaquina[1].ventas++;
        datosMaquina[2].recaudacion += objetoBebida.precio;
        
        guardarLocalStorage();

    } else{
        window.alert("No tienes suficiente dinero");
    }

}

function guardarLocalStorage() {

    localStorage.setItem("datosMaquina", JSON.stringify(datosMaquina));

}

function calcularCambio(importeMonetario) {
    let detalle = "";
    let importeCentimos = Math.round(importeMonetario * 100);
    if (importeCentimos > 0) {
        const dineroCentimos = [2000, 1000, 500, 200, 100, 50, 20, 10, 5];
        for (let i = 0; i < dineroCentimos.length; i++){
            if (importeCentimos >= dineroCentimos[i]){
                let veces = Math.floor(importeCentimos / dineroCentimos[i]);
                importeCentimos = importeCentimos % dineroCentimos[i];
                detalle += ` \n${veces} de ${dinero[i]} €`;
            }
        }
    }
    return detalle;
}

function actualizarStockUI() {
    bebidas.forEach(card => {
        const titulo = card.querySelector(".contenedor__bebidas-articulo-titulo").textContent;
        const objetoBebida = datosMaquina[0].bebidasPrecio.find(b => b.bebida === titulo);
        if (objetoBebida) {
            const stockSpan = card.querySelector(".stock-cantidad");
            if (stockSpan) {
                stockSpan.textContent = objetoBebida.stock;
            }
            if (objetoBebida.stock === 0) {
                card.classList.add("contenedor__bebidas-articulo--sin-stock");
                const stockText = card.querySelector(".contenedor__bebidas-articulo-stock");
                if (stockText) {
                    stockText.innerHTML = "Agotado";
                }
            } else {
                card.classList.remove("contenedor__bebidas-articulo--sin-stock");
                const stockText = card.querySelector(".contenedor__bebidas-articulo-stock");
                if (stockText) {
                    stockText.innerHTML = `Stock: <span class="stock-cantidad">${objetoBebida.stock}</span>`;
                }
            }
        }
    });
}

// Inicialización de la interfaz
actualizarStockUI();