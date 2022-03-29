const pedidoId = localStorage.getItem('pedido');
const token = localStorage.getItem('token');
const body = document.querySelector('body');
const divPedidos = document.querySelector('.pedidos');
const btnConcluir = document.querySelector('.concluir');
const btnCancelar = document.querySelector('.cancelar');

let lat;
let long;
let motor;

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
console.log(token)
fetch(`https://chocode.herokuapp.com/pedido/${pedidoId}`,
    {
        method: "GET",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWFpbEBjb20iLCJpc3MiOiJDaG9jb2RlIiwiZXhwIjoxNjQ4NjUyMzk0fQ.4zmklCqzv-55zvyYBy5quCmDQDmg2w05L1Sp_zbqvqM"
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

localStorage.setItem('entregador', 'Daniel');

const listaPosEntregador = [
    { lat: -23.5581495, lng: -46.3313586 },
    { lat: -23.5581495, lng: -46.3313586 },
    { lat: -23.5581495, lng: -46.3313586 }
]

let posEntregador = { lat: -23.5581495, lng: -46.3313586 };
let posCliente = { lat: -23.549374, lng: -46.3912777 };

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
        latitude: "-23.547500",
        longitude: "-46.63611",
        idEntregador: 1,
        idPedido: 1
    }
    await fetch("https://chocode.herokuapp.com/geolocalizacao",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWFpbEBjb20iLCJpc3MiOiJDaG9jb2RlIiwiZXhwIjoxNjQ4NjUyMzk0fQ.4zmklCqzv-55zvyYBy5quCmDQDmg2w05L1Sp_zbqvqM",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }).then(response => {
            console.log(response)
        })

}

function contarSegundos() {
    motor = setInterval(() => {
        enviarLocalizacao();
        console.log('Mandei aí Suzano')
    }, 3000);
}


'https://chocode.herokuapp.com/pedido/3/entregador/1/cancelado'

'https://chocode.herokuapp.com/pedido/3/entregador/1/entregue'

'https://chocode.herokuapp.com/geolocalizacao'

"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWFpbEBjb20iLCJpc3MiOiJDaG9jb2RlIiwiZXhwIjoxNjQ4NjUyMzk0fQ.4zmklCqzv-55zvyYBy5quCmDQDmg2w05L1Sp_zbqvqM"




