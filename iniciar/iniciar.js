const pedidoId = localStorage.getItem('pedido');
const entregadorId = localStorage.getItem('entregador');
const token = localStorage.getItem('token');
const body = document.querySelector('body');
const divPedidos = document.querySelector('.pedidos');
const btnIniciar = document.querySelector('.iniciar');
const btnVoltar = document.querySelector('.voltar');

let lat = 0;
let long = 0;
let clienteLat;
let clienteLong;

detalharPedido();
let pedido;
async function detalharPedido() {
    const response = await fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}`,
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        })
    if (response.ok) {
        pedido = await response.json();
    }
    if (response.status !== 200) {
        console.log('Erro ao buscar pedido')
    }
    const divDados = document.createElement('div');
    divDados.classList.add('dados');

    const pRes = document.createElement('p');
    const pCliente = document.createElement('p');
    const pEnd = document.createElement('p');
    const pLat = document.createElement('p');
    const pLong = document.createElement('p');
    const pStatus = document.createElement('p');

    clienteLat = pedido.cliente.latitude;
    clienteLong = pedido.cliente.longitude;
    console.log(clienteLat, clienteLong)

    pRes.textContent = 'Restaurante: ' + pedido.nomeRestaurante;
    pCliente.textContent = 'Cliente: ' + pedido.cliente.nome;
    pEnd.textContent = 'Endereço: ' + pedido.cliente.endereco;
    pStatus.textContent = 'Status: ' + pedido.status;
    divDados.append(pRes, pCliente, pEnd, pStatus);
    divPedidos.append(divDados)
}

obterLocalizacao();
function obterLocalizacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (posicao) {
            lat = posicao.coords.latitude;
            long = posicao.coords.longitude;
            initMap(lat, long);
        }, function (error) {
            console.log(error);
        })
    }
};

async function initMap(a, b) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "transit",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#f20707" }]
            }
        ],
        disableDefaultUI: true
    });
    directionsRenderer.setMap(map);
    directionsService.route({
        origin: { lat: a, lng: b },
        destination: { lat: parseInt(clienteLat), lng: parseInt(clienteLong) },
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro);
    });
};

btnIniciar.addEventListener('click', event => {
    window.location.href = "https://chocode-ifood.github.io/front/detalhes/detalhes.html";
});

btnVoltar.addEventListener('click', event => {
    window.location.href = "https://chocode-ifood.github.io/front/pedidos/pedidos.html";
});

obterLocalizacao();