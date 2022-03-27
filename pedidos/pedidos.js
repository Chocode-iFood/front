const body = document.querySelector('body');
let btns;

fetch('https://chocode.herokuapp.com/pedido/findAll').then(function (response) {
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
                window.location.href = "http://127.0.0.1:5500/detalhes/detalhes.html"
            })
        })
    })
})









