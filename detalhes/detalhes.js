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
    })
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
            longitude.textContent = "Longitude: " + pedido.cliente.longitude;

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
localStorage.setItem('entregador', 'Daniel');

let posEntregador = { lat: -23.5581495, lng: -46.3313586 };
let posCliente = { lat: -23.549374, lng: -46.3912777 };

async function initMap() {
    const local = {}
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        disableDefaultUI: true
    });

    directionsRenderer.setMap(map);

    directionsService.route({
        origin: posEntregador,
        destination: posCliente,
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        console.log({ response });
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro)
    });
}
