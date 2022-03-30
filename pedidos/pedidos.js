const body = document.querySelector('body');
const token = localStorage.getItem('token');

fetch('https://chocode.herokuapp.com/pedido/status/aguardando_entregador').then(function (response) {
    const promise = response.json()
    promise.then(function (lista) {
        lista.forEach(function (pedido) {
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

                fetch(`https://chocode.herokuapp.com/pedido/${nome.id}/entregador/${entregadorId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": token,
                        }
                    }).catch().finally()
                if (response.ok) {
                    proximaPagina();
                } else {
                    console.log("Erro no PUT", response.status);
                }
            })
        })
    })
})

function proximaPagina() {
    window.location.href = "https://chocode-ifood.github.io/front/detalhes/detalhes.html";
}







