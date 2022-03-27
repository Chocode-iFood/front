const pedidoId = localStorage.getItem("pedido");
let nomeRest = document.querySelector('restaurante');

let dados = fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}`).then(function (response) {
    const promise = response.json()
    promise.then(function (pedido) {
        console.log(pedido)
        nomeRest.textContent = pedido.nomeRestaurante;
    })
})


