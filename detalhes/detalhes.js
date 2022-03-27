const pedidoId = localStorage.getItem("pedido");
const body = document.querySelector('body');

async function enviar() {
    let response = await fetch("https://chocode.herokuapp.com/login",
        {
            headers: {
                "Accept": "aplication/json",
                "Content-Type": "aplication/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                senha: senha.value,
            })
        }).catch().finally()
    if (response.ok) {
        rodar()
    } else {
        msglogin.textContent = "Erro ao conectar";
    }
}

fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}`)
    .then(function (response) {
        response.json().then(function (pedido) {
            const div = document.createElement('div');
            div.classList.add('pedido');

            const restaurante = document.createElement('p');
            restaurante.textContent = "Restaurante: " + pedido.nomeRestaurante;

            const produto = document.createElement('p');
            produto.textContent = "Produto: " + pedido.produto;

            const cliente = document.createElement('p');
            cliente.textContent = "Cliente: " + pedido.cliente.nome;

            const endereco = document.createElement('p');
            endereco.textContent = "Endereço: " + pedido.cliente.endereco;

            const latitude = document.createElement('p');
            latitude.textContent = "Latitude: " + pedido.cliente.latitude;

            const longitude = document.createElement('p');
            longitude.textContent = "Latitude: " + pedido.cliente.longitude;

            const status = document.createElement('p');
            status.textContent = "Status: " + pedido.status;

            console.log(pedido.cliente)

            div.append(cliente, endereco, restaurante, produto, latitude, longitude, status);
            body.append(div);
        });
    })
    .catch(function (error) {
        console.log('Erro: ' + error.message);
    });


