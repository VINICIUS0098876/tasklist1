async function cadastroUsuario() {
    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    if (nome == "" || email == "" || senha == "") {
        alert("Preencha os campos devidamente!")
    } else {
        try {
            const novoUsuario = {
                nome: nome,
                email: email,
                senha: senha
            }
            await fetch('http://localhost:5080/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoUsuario)
            })
            window.location.href = '../login/login.html'
        } catch (error) {
            console.log(error)
        }
    }
}

