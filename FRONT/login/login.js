async function validarLogin(){
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    let logado = false
    try{
        const responseApi = await fetch('http://localhost:5080/usuario')
        const listUsers = await responseApi.json()
        listUsers.forEach((user) => {
            if(email === user.email && senha === user.senha){
                logado = true
                localStorage.setItem("idusuario", user.id)
                window.location.href = '../index.html'
            }
            console.log(user.email)
            console.log(user.senha)
            console.log(user.id)
        })
        if(!logado)
        alert("Login inválido!")
    } catch(error){
        console.log(error)
    }
}