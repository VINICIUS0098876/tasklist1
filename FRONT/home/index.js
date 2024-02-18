'use strict'


const idPerfil = localStorage.getItem('idusuario')
if (!idPerfil) {
    window.location.href = './login/login.html'
}

const tarefaPage = document.getElementById('adicionarTarefaPage')
const botaoLogout = document.getElementById('logout')
const painelFiltro = document.getElementById('painelFiltro')
const closePanel = document.getElementById('botaoFecharPainel')
const mensagemWarning = document.getElementById('mensagemInfoWarning');


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
    const data = document.querySelector("#dataTarefa").value
    const inputs = document.querySelectorAll('#categoria input[type="radio"]');

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
function deletarTarefa(){
    alert("Função em desenvolvimento")
}
// async function deletarTarefa(id) {
//     try {
//         await fetch(`http://localhost:5080/tarefas/${id}`, {
//             method: 'DELETE',
//         });
//         console.log('Tarefa excluída com sucesso!');
//     } catch (error) {
//         console.error('Ocorreu um erro ao excluir a tarefa:', error);
//     }
// }
criarTarefas()

async function criarTarefas() {
    const infoTarefas = await validarTarefas()
    for (let cont = 0; cont < infoTarefas.length; cont++) {
        criarTarefa(infoTarefas[cont])
    }
}
botaoLogout.addEventListener('click', logout)
function logout() {
    localStorage.removeItem('idusuario')
    window.location.reload()
}

closePanel.addEventListener('click', fecharPainel)
function fecharPainel() {
    tarefaPage.style.visibility = "hidden"
}

function callAdicionarTarefaPage() {
    tarefaPage.style.visibility = "visible"
}


function criarTarefa(infoTarefas) {
    const listaTarefas = document.getElementById('tarefas')
   
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
    trashIcon.classList.add('trashIcon')
    trashIcon.src = "./img/trashIcon.png"
    
    const tarefaBottom = document.createElement('div')
    tarefaBottom.classList.add('tarefaBottom')
    tarefaBottom.classList.add(alterarCorBottomTarefa(infoTarefas.categoria))
    
    const tarefaDescricao = document.createElement('p')
    tarefaDescricao.classList.add('tarefaDescricao')
    tarefaDescricao.textContent = infoTarefas.descricao

    const tarefaCategoria = document.createElement('div')
    tarefaCategoria.classList.add('tarefaCategoria')

    const categoriaIcon = document.createElement('img')

    categoriaIcon.src = "./img/tarefasIcon/" + verificaCategoria(infoTarefas.categoria) + ".png"



    tarefaCategoria.appendChild(categoriaIcon)
    
    tarefaBottom.appendChild(tarefaDescricao)
    tarefa.appendChild(tarefaTop)

    if(!infoTarefas.descricao){
        if(infoTarefas.categoria){
            tarefaTopRight.appendChild(tarefaCategoria)
        }
        tarefaTop.style.height='100%'
        tarefa.style.height='13%'
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
    tarefaTopRight.appendChild(trashIcon)
    tarefaTop.appendChild(tituloTarefa)
    tarefaTop.appendChild(tarefaTopRight)
    listaTarefas.appendChild(tarefa)
    trashIcon.addEventListener('click',deletarTarefa)

}

let painelFiltroOn = false
filtroButton.addEventListener('click', () => {
    if(!painelFiltroOn){
        painelFiltro.style.display = 'block';
        painelFiltroOn = true
    } else {
        painelFiltro.style.display = 'none';
        painelFiltroOn = false
    }
});



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