const pedidoId = localStorage.getItem("pedido");
let restaurante = document.querySelector('.restaurante');
let produto = document.querySelector('.produto');
let cliente = document.querySelector('.cliente');
let endereco = document.querySelector('.endereco');
let latitude = document.querySelector('.latitude');
let longitude = document.querySelector('.longitude');
let status = document.querySelector('.status');
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

            restaurante.textContent = pedido.nomeRestaurante;
            produto.textContent = pedido.produto;
            cliente.textContent = pedido.cliente.nome;
            endereco.textContent = pedido.cliente.endereco;
            latitude.textContent = pedido.cliente.latitude;
            longitude.textContent = pedido.cliente.longitude;
            status.textContent = pedido.status;
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
        styles: [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f20707"
                    }
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
        console.log({ response });
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro)
    });
}


