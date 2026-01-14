# Mudanças Necessárias no Backend e Planilha

## 📊 Mudanças na Planilha do Google Sheets

### 1. Nova Coluna na Planilha "itens"

Adicione uma nova coluna chamada `localizacao` na planilha de itens:

```
Colunas existentes: id | nome | categoria_id | tipo | unidade | controlado | estoque
Nova coluna: localizacao (após estoque)
```

**Estrutura final:**

- `id` - Identificador único
- `nome` - Nome do item
- `categoria_id` - ID da categoria
- `tipo` - Tipo do item
- `unidade` - Unidade de medida
- `controlado` - Se tem controle de estoque
- `estoque` - Quantidade em estoque
- **`localizacao`** - Localização física do item (Ex: "Prateleira A3", "Gaveta 2", etc.) - **OPCIONAL**

### 2. Nova Planilha "movimentacoes_estoque" (opcional)

Para histórico de devoluções ao estoque:

```
Colunas:
- id (auto incremento)
- item_id
- usuario_id
- quantidade
- localizacao_origem
- localizacao_destino
- tipo_movimentacao ("ENTRADA_ESTOQUE")
- data_movimentacao
- detalhes
```

## 🔧 Mudanças no Google Apps Script (Backend)

### 1. Nova Action: `devolver_estoque`

Adicione esta função ao seu código do Google Apps Script:

```javascript
function devolverEstoque(dados) {
  try {
    const planilhaItens =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const planilhaMovimentacoes =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("movimentacoes");

    // Buscar item
    const dadosItens = planilhaItens.getDataRange().getValues();
    const headerItens = dadosItens[0];
    const linhaItem = dadosItens.find((linha) => linha[0] == dados.itemId);

    if (!linhaItem) {
      return { success: false, error: "Item não encontrado" };
    }

    // Buscar índices das colunas
    const indiceEstoque = headerItens.indexOf("estoque");
    const indiceLocalizacao = headerItens.indexOf("localizacao");
    const numeroLinha = dadosItens.indexOf(linhaItem) + 1;

    // Atualizar estoque (aumentar)
    const estoqueAtual = linhaItem[indiceEstoque] || 0;
    const novoEstoque = parseInt(estoqueAtual) + parseInt(dados.quantidade);

    // Atualizar localização se fornecida
    if (dados.localizacao && indiceLocalizacao !== -1) {
      planilhaItens
        .getRange(numeroLinha, indiceLocalizacao + 1)
        .setValue(dados.localizacao);
    }

    // Atualizar estoque
    planilhaItens
      .getRange(numeroLinha, indiceEstoque + 1)
      .setValue(novoEstoque);

    // Registrar movimentação
    const novaLinha = [
      "", // ID será auto-incrementado
      dados.itemId,
      dados.usuario_id,
      dados.quantidade,
      "ENTRADA_ESTOQUE",
      new Date(),
      dados.detalhes || "Devolução ao estoque via app",
      dados.localizacao || "",
    ];

    planilhaMovimentacoes.appendRow(novaLinha);

    return {
      success: true,
      message: "Item devolvido ao estoque com sucesso",
      novoEstoque: novoEstoque,
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
```

### 2. Atualizar função `listarItens`

Modifique a função para incluir a localização:

```javascript
function listarItens(categoriaId) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const dados = planilha.getDataRange().getValues();
    const header = dados[0];

    // Buscar índice da coluna localização
    const indiceLocalizacao = header.indexOf("localizacao");

    const itens = dados
      .slice(1)
      .filter((linha) => linha[2] == categoriaId) // Filtrar por categoria
      .map((linha) => ({
        id: linha[0],
        nome: linha[1],
        categoria_id: linha[2],
        tipo: linha[3],
        unidade: linha[4],
        controlado: linha[5],
        estoque: linha[6],
        localizacao: indiceLocalizacao !== -1 ? linha[indiceLocalizacao] : null,
      }));

    return { success: true, itens: itens };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
```

### 3. Atualizar função `doPost`

Adicione o caso para a nova action:

```javascript
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);

    switch (dados.action) {
      case "login":
        return ContentService.createTextOutput(
          JSON.stringify(login(dados.pin))
        );

      case "listar_categorias":
        return ContentService.createTextOutput(
          JSON.stringify(listarCategorias())
        );

      case "listar_itens":
        return ContentService.createTextOutput(
          JSON.stringify(listarItens(dados.categoriaId))
        );

      case "criar_categoria":
        return ContentService.createTextOutput(
          JSON.stringify(criarCategoria(dados.nome))
        );

      case "criar_item":
        return ContentService.createTextOutput(
          JSON.stringify(criarItem(dados))
        );

      case "registrar_movimentacao":
        return ContentService.createTextOutput(
          JSON.stringify(registrarMovimentacao(dados))
        );

      case "devolver_itens":
        return ContentService.createTextOutput(
          JSON.stringify(devolverItens(dados))
        );

      // NOVA ACTION
      case "devolver_estoque":
        return ContentService.createTextOutput(
          JSON.stringify(devolverEstoque(dados))
        );

      default:
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Action não reconhecida",
          })
        );
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    );
  }
}
```

## 📱 Funcionalidades Implementadas no App

✅ **Terceiro tab "Estoque"** - Para devolução específica ao estoque
✅ **Campo de localização** - Opcional na devolução ao estoque para auxiliar na localização  
✅ **Visualização de localização** - Mostrada na lista de itens
✅ **API de devolução ao estoque** - Aumenta o estoque e registra localização
✅ **Responsividade** - Layout adaptado para tablet e smartphone
✅ **Navegação melhorada** - Correção de conflitos com botões do sistema

## 🔄 Diferenças entre os tipos de devolução

### Tab "Caixa" → Tela "Devolver"

- **Finalidade:** Devolução de itens emprestados para pessoas
- **Comportamento:** Registra quem devolveu o que
- **Estoque:** Itens voltam para o almoxarifado disponível

### Tab "Estoque" → Tela "Devolver ao Estoque"

- **Finalidade:** Reposição/entrada de itens no estoque
- **Comportamento:** Permite informar localização opcional para facilitar localização
- **Estoque:** Aumenta quantidade disponível e atualiza localização

## 🚀 Próximos passos

1. **Configure a planilha** adicionando a coluna `localizacao`
2. **Atualize o Google Apps Script** com as novas funções
3. **Teste a devolução ao estoque** no app
4. **Configure localizações padrão** para facilitar o uso

Agora você tem um sistema completo de gestão de almoxarifado com controle de localização!
