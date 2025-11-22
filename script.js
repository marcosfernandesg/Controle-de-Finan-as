document.addEventListener('DOMContentLoaded', function() {
    
    const btnReceita = document.getElementById('btn-receita');
    const btnDespesa = document.getElementById('btn-despesa');
    const inputDescricao = document.getElementById('descricao');
    const inputValor = document.getElementById('valor');
    const selectCategoria = document.getElementById('categoria');
    const valorSaldo = document.getElementById('valor-saldo');
    const listaTransacoes = document.getElementById('lista-transacoes');

    let transacoes = [];

    console.log('JavaScript carregado!');

    function adicionarTransacao(tipo) {
    
        const descricao = inputDescricao.value;
        const valor = parseFloat(inputValor.value);
        const categoria = selectCategoria.value;

        if (!descricao || !valor || !categoria) {
            alert('Preencha todos os campos!');
            return;
        }

        const transacao = {
            id: Date.now(), 
            descricao: descricao,
            valor: valor,
            categoria: categoria,
            tipo: tipo, 
            data: new Date().toLocaleDateString('pt-BR')
        };

        transacoes.push(transacao);

        salvarNoLocalStorage();

        calcularSaldo();
        atualizarLista();

        inputDescricao.value = '';
        inputValor.value = '';
        selectCategoria.value = '';
    }

    function calcularSaldo() {
        let total = 0;

        transacoes.forEach(function(transacao) {
            if (transacao.tipo === 'receita') {
                total += transacao.valor; 
            } else {
                total -= transacao.valor; 
            }
        });

        valorSaldo.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }

    function atualizarLista() {

        listaTransacoes.innerHTML = '';

        if (transacoes.length === 0) {
            listaTransacoes.innerHTML = '<li style="text-align: center; color: var(--text-color-secundary); padding: 20px;">Nenhuma transação ainda 💰</li>';
            return;
        }

        transacoes.forEach(function(transacao) {
            const li = document.createElement('li');
            
            li.innerHTML = `
                <div>
                    <strong>${transacao.descricao}</strong>
                    <small style="display: block; color: var(--text-color-secundary);">
                        ${transacao.categoria} • ${transacao.data}
                    </small>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-weight: bold; color: ${transacao.tipo === 'receita' ? '#10B981' : '#EF4444'}">
                        ${transacao.tipo === 'receita' ? '+' : '-'} R$ ${transacao.valor.toFixed(2).replace('.', ',')}
                    </span>
                    <button onclick="deletarTransacao(${transacao.id})" style="background: #EF4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                        🗑️
                    </button>
                </div>
            `;

            listaTransacoes.appendChild(li);
        });
    }

    window.deletarTransacao = function(id) {
        if (confirm('Deseja realmente excluir esta transação?')) {

            transacoes = transacoes.filter(t => t.id !== id);

            salvarNoLocalStorage();
            
            calcularSaldo();
            atualizarLista();
        }
    }

    function salvarNoLocalStorage() {
        localStorage.setItem('transacoes', JSON.stringify(transacoes));
    }

    function carregarDoLocalStorage() {
        const dados = localStorage.getItem('transacoes');
        
        if (dados) {
            transacoes = JSON.parse(dados);
            calcularSaldo();
            atualizarLista();
        }
    }

    btnReceita.addEventListener('click', function() {
        adicionarTransacao('receita');
    });

    btnDespesa.addEventListener('click', function() {
        adicionarTransacao('despesa');
    });

    carregarDoLocalStorage();

});