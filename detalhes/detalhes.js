const pedidoId = localStorage.getItem('pedido');
const entregadorId = localStorage.getItem('entregador');
const token = localStorage.getItem('token');
const body = document.querySelector('body');
const divPedidos = document.querySelector('.pedidos');
const btnConcluir = document.querySelector('.concluir');
const btnCancelar = document.querySelector('.cancelar');

let lat = 0;
let long = 0;
let motor;

let posicaoCliente = { lat: -23.5446941, lng: -46.3786544 };

function obterLocalizacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (posicao) {
            lat = posicao.coords.latitude;
            long = posicao.coords.longitude;
            initMap(lat, long, posicaoCliente);
        }, function (error) {
            console.log(error)
        })
    }
}

fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}`,
    {
        method: "GET",
        headers: {
            "Authorization": token
        }
    }).then(function (response) {
        response.json().then(function (pedido) {

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
        console.log('Erro: ' + error);
    });

btnConcluir.addEventListener('click', event => {
    clearInterval(motor);
    pedidoEntregue();
    proximaPagina();
});

btnCancelar.addEventListener('click', event => {
    clearInterval(motor);
    cancelarPedido();
    proximaPagina();
});

function contarSegundos() {
    motor = setInterval(() => {
        obterLocalizacao()
        enviarLocalizacao();
    }, 120000);
}

function cancelarPedido() {
    fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}/entregador/${entregadorId}/cancelado`,
        {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        }).then(response => console.log(response))
}

function pedidoEntregue() {
    fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}/entregador/${entregadorId}/entregue`,
        {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        }).then(response => console.log(response))
}

function proximaPagina() {
    window.location.href = "https://chocode-ifood.github.io/front/pedidos/pedidos.html";
}

async function initMap(a, b, posCliente) {
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
        destination: posCliente,
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro)
    });
}

function enviarLocalizacao() {
    const dados = {
        latitude: lat,
        longitude: long,
        idEntregador: entregadorId,
        idPedido: pedidoId,
    }
    fetch("https://chocode.herokuapp.com/geolocalizacao",
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
obterLocalizacao();
contarSegundos();
