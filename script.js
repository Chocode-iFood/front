const btn = document.querySelector(".btnEntrar");
const form = document.querySelector(".formLogin");
const email = document.querySelector(".email");
const senha = document.querySelector(".senha");
const msglogin = document.querySelector(".msglogin")

async function logar() {
    let response = await fetch("https://chocode.herokuapp.com/login",
        {
            headers: {
                "Accept": "aplication/json",
                "Content-Type": "aplication/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                senha: senha.value,
            })
        }).catch().finally()
    if (response.ok) {
        rodar()
    } else {
        msglogin.textContent = "Erro ao conectar";
    }
}

function rodar() {
    // msglogin.classList.remove("hidden");
    msglogin.textContent = "Sucesso!";
    setTimeout(() => {
        window.location.href = "https://chocode-ifood.github.io/front/pedidos.html"
    }, 3000);
}

function limpar() {
    email.value = "",
        senha.value = "";
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    logar();
    limpar();
});



