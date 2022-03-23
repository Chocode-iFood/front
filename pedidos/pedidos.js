const btn = document.querySelector(".btnEntrar");
const form = document.querySelector(".formLogin");
const email = document.querySelector(".email");
const senha = document.querySelector(".senha");

function logar() {
    fetch("http://localhost:8080/login",
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
        })
        .then(function (res) { console.log(res) })
        .catch(function (res) { console.log(res) })
    console.log(email.value, senha.value)
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

