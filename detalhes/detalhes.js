function obterLocalizacao() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (posicao) {
            lat = posicao.coords.latitude;
            long = posicao.coords.longitude;
            initMap(lat, long);
            atualizarCoords(lat, long);
        }, function (error) {
            console.log(error);
        })
    }
};

async function enviarLocalizacao() {
    const dados = {
        latitude: lat,
        longitude: long,
        idEntregador: entregadorId,
        idPedido: pedidoId,
    }
    const response = await fetch("https://chocode.herokuapp.com/geolocalizacoes", {
        method: "POST",
        headers: {
            "Authorization": token,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
};

async function detalharPedido() {
    const response = await fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })

    if (response.ok) {
        pedido = await response.json();

        const divDados = document.createElement('div');
        divDados.classList.add('dados');

        const msgTitulo = document.createElement('h2');
        const pRes = document.createElement('p');
        const pCliente = document.createElement('p');
        const pEnd = document.createElement('p');
        const pStatus = document.createElement('p');
        const status = pedido.status === 'a_caminho' ? 'Indo até você' : + pedido.status;

        msgTitulo.textContent = 'Olá, ' + nomeEntregador;
        pRes.textContent = 'Restaurante: ' + pedido.nomeRestaurante;
        pCliente.textContent = 'Cliente: ' + pedido.cliente.nome;
        pEnd.textContent = 'Endereço: ' + pedido.cliente.endereco;
        pStatus.textContent = 'Status: ' + status;
        ptit.textContent = 'Coords:';

        clienteLat = parseFloat(pedido.cliente.latitude);
        clienteLong = parseFloat(pedido.cliente.longitude);

        divDados.append(pRes, pCliente, pEnd, pStatus);
        document.querySelector('.titulo').append(msgTitulo);
        document.querySelector('.pedidos').append(divDados);
    }
};

function carregarAvatar() {
    document.querySelector('.avatar').src = urlEntregador;
};

function atualizarCoords(lat, long) {
    plat.textContent = lat;
    plong.textContent = long;
};

// function contarSegundos() {
//     motor = setInterval(() => {
//         obterLocalizacao();
//         enviarLocalizacao();
//     }, 10000);
// };

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
        destination: { lat: clienteLat, lng: clienteLong },
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        directionsRenderer.setDirections(response);
    }).catch(erro => {
        console.log(erro);
    });
};

function cancelarPedido() {
    fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}/entregador/${entregadorId}/cancelado`, {
        method: "PUT",
        headers: {
            "Authorization": token
        }
    }).then(response => console.log(response.status));
};

function pedidoEntregue() {
    fetch(`https://chocode.herokuapp.com/pedidos/${pedidoId}/entregador/${entregadorId}/entregue`, {
        method: "PUT",
        headers: {
            "Authorization": token
        }
    }).then(response => console.log(response.status));
};

function proximaPagina() {
    setTimeout(() => {
        window.location.href = "https://chocode-ifood.github.io/front/pedidos/pedidos.html";
    }, 1500);
};

async function init() {
    await detalharPedido();
    obterLocalizacao();
    carregarAvatar();
    contarSegundos();
};

function pageLoad() {
    const btnConcluir = document.querySelector('.concluir');
    const btnCancelar = document.querySelector('.cancelar');

    btnConcluir.addEventListener('click', event => {
        clearInterval(motor);
        pedidoEntregue();
        proximaPagina();
        localStorage.removeItem('pedido');
    });

    btnCancelar.addEventListener('click', event => {
        clearInterval(motor);
        cancelarPedido();
        proximaPagina();
        localStorage.removeItem('pedido');
    });

    ptit = document.createElement('p');
    plat = document.createElement('p');
    plong = document.createElement('p');
    document.querySelector('.coords').append(ptit, plat, plong);

    init();
};

const pedidoId = localStorage.getItem('pedido');
const entregadorId = localStorage.getItem('entregador');
const token = localStorage.getItem('token');
const urlEntregador = localStorage.getItem("urlEntregador");
const nomeEntregador = localStorage.getItem("nomeEntregador");

let lat = -0.0;
let long = -0.0;
let motor;

let pedido;
let clienteLat;
let clienteLong;

let ptit = null;
let plat = null;
let plong = null;

window.onload = pageLoad;