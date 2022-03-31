const body = document.querySelector('body');
const token = localStorage.getItem('token');

listarPedidos();
let lista;
async function listarPedidos() {
    const promise = await fetch('https://chocode.herokuapp.com/pedido/status/aguardando_entregador',
        {
            method: "GET",
            headers: {
                "Authorization": token,
            }
        })
    lista = await promise.json();
    lista.forEach(pedido => {
        const div = document.createElement('div');
        div.classList.add('center');

        const nome = document.createElement('button');
        nome.setAttribute("id", pedido.id);
        nome.textContent = pedido.nomeRestaurante;
        div.append(nome);
        body.append(div);

        pedido = document.querySelector('button');
        nome.addEventListener('click', event => {
            localStorage.setItem('pedido', nome.id);
            const entregadorId = localStorage.getItem('entregador')
            proximaPagina();
        })
    })
};

function proximaPagina() {
    window.location.href = "https://chocode-ifood.github.io/front/iniciar/iniciar.html";
}







