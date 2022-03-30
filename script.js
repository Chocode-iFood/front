const btn = document.querySelector(".btnEntrar");
const form = document.querySelector(".formLogin");
const email = document.querySelector(".email");
const senha = document.querySelector(".senha");
const msglogin = document.querySelector(".msglogin")

function logar() {
    const dados = {
        "email": email.value,
        "senha": senha.value
    }
    fetch("https://chocode.herokuapp.com/entregador/login",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }).then((response) => {
            response.json()
            console.log(response)
            if (response.status != 200) {
                msglogin.textContent = "Dados inválidos";
            }
        }).then((responseData) => {
            console.log(responseData)
            if (responseData.token != null) {
                localStorage.setItem("token", responseData.token)
                localStorage.setItem("entregador", responseData.id)
                rodar();
            } else {
                msglogin.textContent = "Erro ao conectar";
            }
        }).catch(error => {
            console.log('Erro: ->', error)
        });
};

function rodar() {
    msglogin.textContent = "Login efetuado com Sucesso!";
    setTimeout(() => {
        window.location.href = "https://chocode-ifood.github.io/front/pedidos/pedidos.html"
    }, 1000);
};

function limpar() {
    email.value = "",
        senha.value = "";
};

form.addEventListener('submit', function (event) {
    event.preventDefault();
    logar();
    limpar();
});
