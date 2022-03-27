const body = document.querySelector('body');

fetch('https://chocode.herokuapp.com/pedido/aguardando').then(function (response) {
    const promise = response.json()
    promise.then(function (lista) {
        lista.forEach(function (pedido) {
            const div = document.createElement('div');
            div.classList.add('center');

            const nome = document.createElement('button');
            nome.setAttribute("id", pedido.id);
            nome.textContent = pedido.nomeRestaurante;
            console.log(pedido)
            div.append(nome);
            body.append(div);

            pedido = document.querySelector('button');
            nome.addEventListener('click', event => {
                localStorage.setItem('pedido', nome.id);
                window.location.href = "https://chocode-ifood.github.io/front/detalhes/detalhes.html"
            })
        })
    })
})









