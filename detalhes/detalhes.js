const pedidoId = localStorage.getItem('pedido');
const entregadorId = localStorage.getItem('endereco');
const token = localStorage.getItem('token');
const body = document.querySelector('body');
const divPedidos = document.querySelector('.pedidos');
const btnConcluir = document.querySelector('.concluir');
const btnCancelar = document.querySelector('.cancelar');

let lat = 0;
let long = 0;
let motor;

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (posicao) {
        console.log(posicao.coords.latitude)
        console.log(posicao.coords.longitude)
        lat = posicao.coords.latitude;
        long = posicao.coords.longitude;
        initMap();
    }, function (error) {
        console.log(error)
    })
}

fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}`,
    {
        method: "GET",
        headers: {
            "Authorization": token
        }
    }).then(function (response) {
        response.json().then(function (pedido) {
            console.log('pedidos -> ', pedido)

            const divDados = document.createElement('div');
            divDados.classList.add('dados');

            const pRes = document.createElement('p');
            const pCliente = document.createElement('p');
            const pEnd = document.createElement('p');
            const pLat = document.createElement('p');
            const pLong = document.createElement('p');
            const pStatus = document.createElement('p');

            pRes.textContent = 'Restaurante: ' + pedido.nomeRestaurante;
            pCliente.textContent = 'Cliente: ' + pedido.cliente.nome;
            pEnd.textContent = 'Endereço: ' + pedido.cliente.endereco;
            pLat.textContent = 'Latitude: ' + pedido.cliente.latitude;
            pLong.textContent = 'Longitude: ' + pedido.cliente.longitude;
            pStatus.textContent = 'Status: ' + pedido.status;

            divDados.append(pRes, pCliente, pEnd, pLat, pLong, pStatus);
            divPedidos.append(divDados)
        });
    })
    .catch(function (error) {
        console.log('Erro: ' + error.message);
    });

let posEntregador = { lat: lat, lng: long };
let posCliente = { lat: -23.5446941, lng: -46.3786544 };

async function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#f20707" }
                ]
            }
        ],
        disableDefaultUI: true
    });

    directionsRenderer.setMap(map);

    directionsService.route({
        origin: posEntregador,
        destination: posCliente,
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro)
    });
}
btnConcluir.addEventListener('click', event => {
    console.log('Clicou em Concluir')
    contarSegundos();
});

btnCancelar.addEventListener('click', event => {
    console.log('Clicou em cancelar')
    clearInterval(motor);
});

async function enviarLocalizacao() {
    const dados = {
        latitude: lat,
        longitude: long,
        idEntregador: 1,
        idPedido: 1
    }
    await fetch("https://chocode.herokuapp.com/geolocalizacao",
        {
            method: "POST",
            headers: {
                "Authorization": token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }).then(response => console.log(response))
}

function contarSegundos() {
    motor = setInterval(() => {
        enviarLocalizacao();
        console.log('Mandei aí Suzano')
    }, 30000);
}

// 'https://chocode.herokuapp.com/pedido/3/entregador/1/cancelado'

// 'https://chocode.herokuapp.com/pedido/3/entregador/1/entregue'







