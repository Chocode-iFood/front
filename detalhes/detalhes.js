const pedidoId = localStorage.getItem("pedido");
const body = document.querySelector('body');
const box = document.querySelector('.box');

let lat;
let long;
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (posicao) {
        lat = posicao.coords.latitude;
        long = posicao.coords.longitude;
        time = posicao.timestamp;
        initMap();
    }, function (error) {
        console.log(error)
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 })
}

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

            div.append(cliente, endereco, restaurante, produto, latitude, longitude, status);
            box.append(div)
            body.append(box);
        });
    })
    .catch(function (error) {
        console.log('Erro: ' + error.message);
    });

function initMap() {
    const local = { lat: lat, lng: long };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: local,
        zoom: 17,
    });
    const marker = new google.maps.Marker({
        position: local,
        map: map,
    });
}

