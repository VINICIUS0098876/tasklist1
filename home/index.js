'use strict'

let filtro = 0;
const idPerfil = localStorage.getItem('idusuario')
if (!idPerfil) {
    window.location.href = './login/login.html'
}

const tarefaPage = document.getElementById('adicionarTarefaPage')
const tarefaEditPage = document.getElementById('editarTarefaPage')
const botaoLogout = document.getElementById('logout')
const filtroButton = document.getElementById('filtroButton')
const painelFiltro = document.getElementById('painelFiltro')
const closePanelNovaTarefa = document.getElementById('botaoFecharPainelNovaTarefa')
const closePanelEditarTarefa = document.getElementById('botaoFecharPainelEditarTarefa')
const mensagemWarning = document.getElementById('mensagemInfoWarning');
const listaTarefas = document.getElementById('tarefas')



let painelFiltroOn = false

filtroButton.addEventListener('click',filtrar) 
function filtrar(){
    filtro++
    if(filtro==5){
        filtro=0
    }
    // console.log(filtro)
    while (listaTarefas.firstChild) {
        let child = listaTarefas.firstChild
        listaTarefas.removeChild(child);
    }
    criarTarefas(filtro)
}

// filtroButton.addEventListener('click', () => {
//     if(!painelFiltroOn){
//         painelFiltro.style.display = 'block';
//         painelFiltroOn = true
//     } else {
//         painelFiltro.style.display = 'none';
//         painelFiltroOn = false
//     }
// });
async function validarTarefas() {
    const responseApi = await fetch('http://localhost:5080/tarefas')
    const listTasks = await responseApi.json()

    let listaDeTarefasUsuario = []
    listTasks.forEach((task) => {
        if (idPerfil == task.idUsuario) {
            listaDeTarefasUsuario.push(task)
        }
    })
    return (listaDeTarefasUsuario)

}
async function cadastroTarefa() {

    const titulo = document.getElementById('tituloTarefaNova').value
    const descricao = document.getElementById('descricaoTarefaNova').value
    const data = document.querySelector("#dataTarefaNova").value
    const inputs = document.querySelectorAll('#categoriaTarefaNova input[type="radio"]');

    let categoria = '';
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            categoria = inputs[i].value;
            break; // Interrompe o loop quando encontrar o selecionado
        }
    }

    let [ano] = data.split("-");


    if (titulo == "" || ano > 9999) {
        alert("Preencha os campos devidamente!")
    } else {
        try {
            const novaTarefa = {
                titulo: titulo,
                descricao: descricao,
                data: data,
                categoria: categoria,
                idUsuario: idPerfil
            }


            await fetch('http://localhost:5080/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaTarefa)
            })
            fecharPainel()
        } catch (error) {
            console.log(error)
        }
    }
}
async function abrirPainelEdicao(idTarefa){
    const titulo = document.getElementById('tituloTarefaEditada')
    const descricao = document.getElementById('descricaoTarefaEditada')
    const data = document.querySelector("#dataTarefaEditada")
    const inputs = document.querySelectorAll('#categoriaTarefaEditada input[type="radio"]');

    const tarefas = await validarTarefas()
    for(let cont = 0;cont<tarefas.length;cont++){
        if(idTarefa===tarefas[cont].id){
            titulo.value = tarefas[cont].titulo
            descricao.value = tarefas[cont].descricao
            let dataAtual = tarefas[cont].data
            data.value = dataAtual
            console.log(dataAtual)
            if(inputs[(tarefas[cont].categoria)-1])
            inputs[(tarefas[cont].categoria)-1].checked = true
        }
    }
    tarefaEditPage.style.visibility = 'visible'

    const botaoEditar = document.getElementById('finalizarEdicao')
    botaoEditar.addEventListener('click', () => editarTarefa(idTarefa));
}

async function editarTarefa(id) {
    
    const titulo = document.getElementById('tituloTarefaEditada').value
    const descricao = document.getElementById('descricaoTarefaEditada').value
    const data = document.querySelector("#dataTarefaEditada").value
    const inputs = document.querySelectorAll('#categoriaTarefaEditada input[type="radio"]');
    let categoria = '';
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            categoria = inputs[i].value;
            break; // Interrompe o loop quando encontrar o selecionado
        }
    }

    const tarefaAtualizada = {
        titulo: titulo,
        descricao: descricao,
        data: data,
        categoria: categoria,
        idUsuario: idPerfil
    };

    try {
        await fetch(`http://localhost:5080/tarefas/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarefaAtualizada)
        });
        console.log('Tarefa substituída com sucesso!');
    } catch (error) {
        console.error('Ocorreu um erro ao substituir a tarefa: ', error);
    }
} 

async function deletarTarefa(id) {
    try {
        await fetch(`http://localhost:5080/tarefas/${id}`, {
            method: 'DELETE',
        });
        console.log('Tarefa excluída com sucesso!');
        window.location.reload()
    } catch (error) {
        console.error('Ocorreu um erro ao excluir a tarefa:', error);
    }
}
criarTarefas()
async function criarTarefas(filtro) {
    const infoTarefas = await validarTarefas()
    if(filtro>0){
        for (let cont = 0; cont < infoTarefas.length; cont++) {
            if(infoTarefas[cont].categoria===filtro)
            criarTarefa(infoTarefas[cont])
        }
    } else {
        for (let cont = 0; cont < infoTarefas.length; cont++) {
            criarTarefa(infoTarefas[cont])
        }
    }

}
botaoLogout.addEventListener('click', logout)
function logout() {
    localStorage.removeItem('idusuario')
    window.location.reload()
}

closePanelNovaTarefa.addEventListener('click', fecharPainelNovaTarefa)
function fecharPainelNovaTarefa() {
    tarefaPage.style.visibility = "hidden"
}
closePanelEditarTarefa.addEventListener('click', fecharPainelEditarTarefa)
function fecharPainelEditarTarefa() {
    tarefaEditPage.style.visibility = "hidden"
}

function callAdicionarTarefaPage() {
    tarefaPage.style.visibility = "visible"
}


function criarTarefa(infoTarefas) {
   
    const tarefa = document.createElement('div')
    tarefa.classList.add('tarefa')
   
    const tarefaTop = document.createElement('div')
    tarefaTop.classList.add('tarefaTop')
    tarefaTop.classList.add(alterarCorTopTarefa(infoTarefas.categoria))

    const tituloTarefa = document.createElement('p')
    tituloTarefa.classList.add('tituloTarefa')
    tituloTarefa.textContent = infoTarefas.titulo

    const tarefaTopRight = document.createElement('div')
    tarefaTopRight.classList.add('tarefaTopRight')

    const warningIcon = document.createElement('img')
    warningIcon.src = "./img/warning.png"
    warningIcon.classList.add('warningIcon')
    warningIcon.addEventListener('mouseover', () => {
        mensagemWarning.style.display = 'block';
    });
    warningIcon.addEventListener('mouseout', () => {
        mensagemWarning.style.display = 'none';
    });


    const date = document.createElement('p')
    const dateSplits = infoTarefas.data.split('-');
    date.textContent = dateSplits[2] + '/' + dateSplits[1];
    date.classList.add('date')

    const trashIcon = document.createElement('img')
    trashIcon.src = "./img/trashIcon.png"
    trashIcon.classList.add('imgIcon')
    
    const editIcon = document.createElement('img')
    editIcon.src = "./img/editIcon.png"
    editIcon.classList.add('imgIcon')

    const tarefaBottom = document.createElement('div')
    tarefaBottom.classList.add('tarefaBottom')
    tarefaBottom.classList.add(alterarCorBottomTarefa(infoTarefas.categoria))
    
    const tarefaDescricao = document.createElement('p')
    tarefaDescricao.classList.add('tarefaDescricao')
    tarefaDescricao.textContent = infoTarefas.descricao

    const tarefaCategoria = document.createElement('div')
    tarefaCategoria.classList.add('tarefaCategoria')

    const categoriaIcon = document.createElement('img')


    if(infoTarefas.categoria)
    categoriaIcon.src = "./img/tarefasIcon/" + verificaCategoria(infoTarefas.categoria) + ".png"


    tarefaCategoria.appendChild(categoriaIcon)
    
    tarefaBottom.appendChild(tarefaDescricao)
    tarefa.appendChild(tarefaTop)

    if(!infoTarefas.descricao){
        if(infoTarefas.categoria){
            tarefaTopRight.appendChild(tarefaCategoria)

        }
        tarefaTop.style.borderRadius = "26px";
    } else {
        tarefa.appendChild(tarefaBottom)
        if(infoTarefas.categoria){
            tarefaBottom.appendChild(tarefaCategoria)
        }
    }

    if(infoTarefas.data){
        if (verificarData(dateSplits[0] + dateSplits[1] + dateSplits[2])) {
            tarefaTopRight.appendChild(warningIcon)
            date.style.color='orange'
        }
        tarefaTopRight.appendChild(date)
    }
    tarefaTopRight.appendChild(editIcon)
    tarefaTopRight.appendChild(trashIcon)
    tarefaTop.appendChild(tituloTarefa)
    tarefaTop.appendChild(tarefaTopRight)
    listaTarefas.appendChild(tarefa)
    editIcon.addEventListener('click', () => abrirPainelEdicao(infoTarefas.id));
    trashIcon.addEventListener('click', () => deletarTarefa(infoTarefas.id));
}

function verificaCategoria(categoria) {
    let imgCategoria
    if (categoria == 1) {
        imgCategoria = "pessoal"
    }
    if (categoria == 2) {
        imgCategoria = "trabalho"
    }
    if (categoria == 3) {
        imgCategoria = "casa"
    }
    if (categoria == 4) {
        imgCategoria = "saude"
    }
    return imgCategoria
}
function alterarCorTopTarefa(cat) {
    if (cat == 1) {
        return 'blueTop'
    }
    if (cat == 2) {
        return 'redTop'
    }
    if (cat == 3) {
        return 'brownTop'
    }
    if (cat == 4) {
        return 'greenTop'
    }
}
function alterarCorBottomTarefa(cat) {
    if (cat == 1) {
        return 'blueBottom'
    }
    if (cat == 2) {
        return 'redBottom'
    }
    if (cat == 3) {
        return 'brownBottom'
    }
    if (cat == 4) {
        return 'greenBottom'
    }
}
function verificarData(dataTarefa) {
    //Verifica se a data já foi ultrapassada
    const DATE = new Date();
    let dia = DATE.getDate().toString();
    if (dia < 10) { mes = '0' + dia }
    let mes = (DATE.getMonth() + 1).toString();
    if (mes < 10) { mes = '0' + mes }
    const dataAtual = DATE.getFullYear().toString() + mes + dia;
    if (dataTarefa < dataAtual) {
        return true
    } else return false
}