
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
    {bebida: "Coca-Cola", precio: 1.20},
    {bebida: "Fanta", precio: 1},
    {bebida: "Cerveza", precio: 1.55},
    {bebida: "Red-Bull", precio: 2},
    {bebida: "Agua Mineral", precio: 0.60},
    {bebida: "Agua con Gas", precio: 0.95}
];


let valorMoneda = 0;
let productoSeleccionado = "";


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
        productoSeleccionado = tarjetaClicada.querySelector(".contenedor__bebidas-articulo-titulo").textContent;
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
    productoSel.textContent = "No hay producto seleccionado";
    productoSeleccionado = "";
    valorMoneda = 0;
    saldo.textContent = `SALDO: 0.00 €`;
});

function comprarBebida() {

    if (productoSeleccionado === ""){
        window.alert("No hay producto seleccionado");
        return;
    }
    const precioBebida = bebidasPrecio.find(bebidaTemp => bebidaTemp.bebida === productoSeleccionado);
    if (valorMoneda >= precioBebida.precio){
        valorMoneda -= precioBebida.precio
        saldo.textContent = `SALDO: ${valorMoneda.toFixed(2)} €`;
        productoSel.textContent = "No hay producto seleccionado";
        sonidoBebida.play();
        window.alert(`Gracias por comprar ${productoSeleccionado}`);
        productoSeleccionado = "";
    } else{
        window.alert("No tienes suficiente dinero");
    }

}