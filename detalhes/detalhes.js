const pedidoId = localStorage.getItem('pedido');
const entregadorId = localStorage.getItem('entregador');
const token = localStorage.getItem('token');
const body = document.querySelector('body');
const divPedidos = document.querySelector('.pedidos');
const btnConcluir = document.querySelector('.concluir');
const btnCancelar = document.querySelector('.cancelar');
const divCoords = document.querySelector('.coords');
const avatar = document.querySelector('.avatar');
const urlEntregador = localStorage.getItem("urlEntregador");
const nomeEntregador = localStorage.getItem("nomeEntregador");

let posicaoCliente = { lat: -23.5446941, lng: -46.3786544 };
let lat = 0;
let long = 0;
let motor;

function obterLocalizacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (posicao) {
            lat = posicao.coords.latitude;
            long = posicao.coords.longitude;
            initMap(lat, long, posicaoCliente);
            atualizarCoords(lat, long);
        }, function (error) {
            console.log(error)
        })
    }
};

obterLocalizacao();

async function enviarLocalizacao() {
    const dados = {
        latitude: lat,
        longitude: long,
        idEntregador: entregadorId,
        idPedido: pedidoId,
    }
    const response = await fetch("https://chocode.herokuapp.com/geolocalizacoes",
        {
            method: "POST",
            headers: {
                "Authorization": token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        })
    let data;
    if (response.ok) {
        data = await response.json();
        console.log('Retorno', data)
    }
};

atribuirEntregador();
carregarAvatar();
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
    const divDados = document.createElement('div');
    divDados.classList.add('dados');

    const pRes = document.createElement('p');
    const pCliente = document.createElement('p');
    const pEnd = document.createElement('p');
    const pStatus = document.createElement('p');

    pRes.textContent = 'Restaurante: ' + pedido.nomeRestaurante;
    pCliente.textContent = 'Cliente: ' + pedido.cliente.nome;
    pEnd.textContent = 'Endereço: ' + pedido.cliente.endereco;
    let status = pedido.status === 'a_caminho' ? 'Indo até você' : + pedido.status;
    pStatus.textContent = 'Status: ' + status;
    ptit.textContent = 'Coords:';

    divDados.append(pRes, pCliente, pEnd, pStatus);
    divPedidos.append(divDados)
};

function carregarAvatar() {
    avatar.src = urlEntregador;
}

const ptit = document.createElement('p');
let plat = document.createElement('p');
let plong = document.createElement('p');
divCoords.append(ptit, plat, plong)

function atualizarCoords(lat, long) {
    plat.textContent = lat;
    plong.textContent = long;
};

// function contarSegundos() {
//     motor = setInterval(() => {
//         obterLocalizacao();
//         enviarLocalizacao();
//     }, 10000);
// }

async function atribuirEntregador() {

    const promise = await fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}/entregador/${entregadorId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": token,
            }
        })
    if (promise.ok) {
        console.log('Atribuiu entregador/pedido', id, entregador)
    }
};

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
};

obterLocalizacao();
enviarLocalizacao();
contarSegundos();

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

function cancelarPedido() {
    fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}/entregador/${entregadorId}/cancelado`,
        {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        }).then(response => console.log(response.status))
};

function pedidoEntregue() {
    fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}/entregador/${entregadorId}/entregue`,
        {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        }).then(response => console.log(response.status))
};

// function proximaPagina() {
//     window.location.href = "https://chocode-ifood.github.io/front/pedidos/pedidos.html";
// };

