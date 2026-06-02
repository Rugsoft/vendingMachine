
const bebidas = document.querySelectorAll(".contenedor__bebidas-articulo");
const monedas = document.querySelectorAll(".contenedor__informacion-monedas-valor");
const billetes = document.querySelectorAll(".contenedor__informacion-billetes-valor");
const saldo = document.querySelector(".contenedor__informacion-saldo-precio");
const productoSel = document.querySelector(".contenedor__informacion-seleccion-bebido");
const comprar = document.querySelector(".contenedor__informacion-acciones-comprar");
const cancelar = document.querySelector(".contenedor__informacion-acciones-cancelar");
const sonidoMoneda = document.getElementById("sonidoMoneda");
const sonidoBebida = document.getElementById("sonidoLata");
const bebidasPrecio = [
    {bebida: "Coca-Cola", precio: 1.20, stock: 1},
    {bebida: "Fanta", precio: 1, stock: 5},
    {bebida: "Cerveza", precio: 1.55, stock: 10},
    {bebida: "Red-Bull", precio: 2, stock: 2},
    {bebida: "Agua Mineral", precio: 0.60, stock: 7},
    {bebida: "Agua con Gas", precio: 0.95, stock: 5}
];
const dinero = [20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];


let valorMoneda = 0;
let productoSeleccionado = "";
let acumulacion = "";
let cambio = 0;



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
        const objetoBebida = bebidasPrecio.find(bebidaTemp => bebidaTemp.bebida === titulo);

        if (objetoBebida && objetoBebida.stock === 0) {
            window.alert("No hay stock disponible");
            return;
        }

        productoSeleccionado = titulo;
        productoSel.textContent = productoSeleccionado;
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
    calcularCambio(valorMoneda);
    window.alert(`Compra cancelada \n Aqui tiene su dinero de ${valorMoneda.toFixed(2)} € : ${acumulacion}`);
    productoSel.textContent = "No hay producto seleccionado";
    productoSeleccionado = "";
    valorMoneda = 0;
    acumulacion = "";
    cambio = 0;
    saldo.textContent = `SALDO: 0.00 €`;
});

function comprarBebida() {

    if (productoSeleccionado === ""){
        window.alert("No hay producto seleccionado");
        return;
    }

    const objetoBebida = bebidasPrecio.find(bebidaTemp => bebidaTemp.bebida === productoSeleccionado);

    if (objetoBebida.stock === 0){
        window.alert("No hay stock disponible");
        return;
    }

    if (valorMoneda >= objetoBebida.precio){
        valorMoneda -= objetoBebida.precio
        //saldo.textContent = `SALDO: ${valorMoneda.toFixed(2)} €`;
        cambio = valorMoneda;
        objetoBebida.stock--;
        actualizarStockUI();
        calcularCambio(cambio);
        productoSel.textContent = "No hay producto seleccionado";
        sonidoBebida.play();
        window.alert(`Gracias por comprar ${productoSeleccionado} \nAqui su cambio de ${cambio.toFixed(2)} € : ${acumulacion}`);
        productoSeleccionado = "";
        acumulacion = "";
        valorMoneda = 0;
        saldo.textContent = `SALDO: 0.00 €`;
        cambio = 0;
    } else{
        window.alert("No tienes suficiente dinero");
    }

}

function calcularCambio(importeMonetario) {
    let importeCentimos = Math.round(importeMonetario * 100);
    if (importeCentimos > 0) {
        const dineroCentimos = [2000, 1000, 500, 200, 100, 50, 20, 10, 5];
        for (let i = 0; i < dineroCentimos.length; i++){
            if (importeCentimos >= dineroCentimos[i]){
                let veces = Math.floor(importeCentimos / dineroCentimos[i]);
                importeCentimos = importeCentimos % dineroCentimos[i];
                acumulacion += ` \n${veces} de ${dinero[i]} €`;
            }
        }
    }
}

function actualizarStockUI() {
    bebidas.forEach(card => {
        const titulo = card.querySelector(".contenedor__bebidas-articulo-titulo").textContent;
        const objetoBebida = bebidasPrecio.find(b => b.bebida === titulo);
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