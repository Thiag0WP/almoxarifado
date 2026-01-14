// ====================================
// GOOGLE APPS SCRIPT - ALMOXARIFADO TI
// ====================================

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
          JSON.stringify(listarCategorias(dados.mostrarInativos))
        );

      case "inativar_categoria":
        return ContentService.createTextOutput(
          JSON.stringify(inativarCategoria(dados.id))
        );

      case "ativar_categoria":
        return ContentService.createTextOutput(
          JSON.stringify(ativarCategoria(dados.id))
        );

      case "listar_itens":
        return ContentService.createTextOutput(
          JSON.stringify(listarItens(dados.categoria_id, dados.mostrarInativos))
        );

      case "inativar_item":
        return ContentService.createTextOutput(
          JSON.stringify(inativarItem(dados.id))
        );

      case "ativar_item":
        return ContentService.createTextOutput(
          JSON.stringify(ativarItem(dados.id))
        );

      case "listar_configuracoes":
        return ContentService.createTextOutput(
          JSON.stringify(listarConfiguracoes())
        );

      case "atualizar_configuracao":
        return ContentService.createTextOutput(
          JSON.stringify(atualizarConfiguracao(dados.chave, dados.valor))
        );

      case "criar_categoria":
        return ContentService.createTextOutput(
          JSON.stringify(criarCategoria(dados.nome, dados.descricao))
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

// ====================================
// AUTENTICAÇÃO
// ====================================

function login(pin) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usuarios");
    const dados = planilha.getDataRange().getValues();

    for (let i = 1; i < dados.length; i++) {
      const linha = dados[i];
      if (linha[3] == pin) {
        // Coluna D = pin
        return {
          success: true,
          user: {
            id: linha[0],
            nome: linha[1],
            email: linha[2],
          },
        };
      }
    }

    return { success: false, error: "PIN inválido" };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ====================================
// CATEGORIAS
// ====================================

function listarCategorias(mostrarInativos = false) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("categorias");
    const dados = planilha.getDataRange().getValues();

    let categorias = dados.slice(1).map((linha) => ({
      id: linha[0],
      nome: linha[1],
      descricao: linha[2] || "",
      ativo: linha[3],
    }));

    // Filtrar por status ativo/inativo
    if (!mostrarInativos) {
      categorias = categorias.filter(
        (cat) => cat.ativo === true || cat.ativo === "true"
      );
    } else {
      categorias = categorias.filter(
        (cat) => cat.ativo === false || cat.ativo === "false"
      );
    }

    return { success: true, categorias: categorias };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function criarCategoria(nome, descricao = "") {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("categorias");
    const dados = planilha.getDataRange().getValues();

    // Verificar se categoria já existe (apenas entre as ativas)
    for (let i = 1; i < dados.length; i++) {
      if (
        dados[i][1].toLowerCase() === nome.toLowerCase() &&
        (dados[i][3] === true || dados[i][3] === "true")
      ) {
        return { success: false, error: "Categoria já existe" };
      }
    }

    // Gerar novo ID
    const novoId =
      dados.length > 0
        ? Math.max(...dados.slice(1).map((linha) => linha[0])) + 1
        : 1;

    // Adicionar nova categoria
    planilha.appendRow([novoId, nome, descricao, true]);

    return {
      success: true,
      categoria: {
        id: novoId,
        nome: nome,
        descricao: descricao,
        ativo: true,
      },
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function inativarCategoria(id) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("categorias");
    const dados = planilha.getDataRange().getValues();

    // Encontrar categoria
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] == id) {
        const numeroLinha = i + 1;
        planilha.getRange(numeroLinha, 4).setValue(false); // Coluna D = ativo

        return {
          success: true,
          message: "Categoria inativada com sucesso",
        };
      }
    }

    return { success: false, error: "Categoria não encontrada" };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function ativarCategoria(id) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("categorias");
    const dados = planilha.getDataRange().getValues();

    // Encontrar categoria
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] == id) {
        const numeroLinha = i + 1;
        planilha.getRange(numeroLinha, 4).setValue(true); // Coluna D = ativo

        return {
          success: true,
          message: "Categoria ativada com sucesso",
        };
      }
    }

    return { success: false, error: "Categoria não encontrada" };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ====================================
// ITENS
// ====================================

function listarItens(categoriaId, mostrarInativos = false) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const dados = planilha.getDataRange().getValues();
    const header = dados[0];

    // Buscar índices das colunas
    const indiceLocalizacao = header.indexOf("localizacao");
    const indiceAtivo = header.indexOf("ativo");

    let itens = dados
      .slice(1)
      .filter((linha) => linha[2] == categoriaId)
      .map((linha) => ({
        id: linha[0],
        nome: linha[1],
        categoria_id: linha[2],
        tipo: linha[3],
        unidade: linha[4],
        controlado: linha[5],
        estoque: linha[6] || 0,
        localizacao:
          indiceLocalizacao !== -1 ? linha[indiceLocalizacao] || "" : "",
        ativo: indiceAtivo !== -1 ? linha[indiceAtivo] : true,
      }));

    // Filtrar por status ativo/inativo
    if (!mostrarInativos) {
      itens = itens.filter(
        (item) => item.ativo === true || item.ativo === "true"
      );
    } else {
      itens = itens.filter(
        (item) => item.ativo === false || item.ativo === "false"
      );
    }

    return { success: true, itens: itens };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function criarItem(dados) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const dadosExistentes = planilha.getDataRange().getValues();

    // Verificar se item já existe na categoria
    for (let i = 1; i < dadosExistentes.length; i++) {
      const linha = dadosExistentes[i];
      if (
        linha[1].toLowerCase() === dados.nome.toLowerCase() &&
        linha[2] == dados.categoria_id
      ) {
        return { success: false, error: "Item já existe nesta categoria" };
      }
    }

    // Gerar novo ID
    const novoId =
      dadosExistentes.length > 0
        ? Math.max(...dadosExistentes.slice(1).map((linha) => linha[0])) + 1
        : 1;

    // Preparar dados do item
    const novaLinha = [
      novoId,
      dados.nome,
      dados.categoria_id,
      dados.tipo || "",
      dados.unidade,
      dados.controlado || false,
      dados.estoque_inicial || 0,
      "", // localizacao vazia inicialmente
      true, // ativo por padrão
    ];

    // Adicionar novo item
    planilha.appendRow(novaLinha);

    return {
      success: true,
      item: {
        id: novoId,
        nome: dados.nome,
        categoria_id: dados.categoria_id,
        tipo: dados.tipo || "",
        unidade: dados.unidade,
        controlado: dados.controlado || false,
        estoque: dados.estoque_inicial || 0,
        localizacao: "",
        ativo: true,
      },
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function inativarItem(id) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const dados = planilha.getDataRange().getValues();

    const linha = dados.find((linha) => linha[0] == id);
    if (!linha) {
      return { success: false, error: "Item não encontrado" };
    }

    const numeroLinha = dados.indexOf(linha) + 1;
    planilha.getRange(numeroLinha, 9).setValue(false);

    return {
      success: true,
      item: {
        id: linha[0],
        nome: linha[1],
        categoria_id: linha[2],
        tipo: linha[3],
        unidade: linha[4],
        controlado: linha[5],
        estoque: linha[6],
        localizacao: linha[7],
        ativo: false,
      },
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function ativarItem(id) {
  try {
    const planilha =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");
    const dados = planilha.getDataRange().getValues();

    const linha = dados.find((linha) => linha[0] == id);
    if (!linha) {
      return { success: false, error: "Item não encontrado" };
    }

    const numeroLinha = dados.indexOf(linha) + 1;
    planilha.getRange(numeroLinha, 9).setValue(true);

    return {
      success: true,
      item: {
        id: linha[0],
        nome: linha[1],
        categoria_id: linha[2],
        tipo: linha[3],
        unidade: linha[4],
        controlado: linha[5],
        estoque: linha[6],
        localizacao: linha[7],
        ativo: true,
      },
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ====================================
// MOVIMENTAÇÕES
// ====================================

function registrarMovimentacao(dados) {
  try {
    const planilhaMovimentacoes =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("movimentacoes");
    const planilhaItens =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");

    // Processar cada item
    const promises = dados.itens.map((item) => {
      try {
        // Buscar item
        const dadosItens = planilhaItens.getDataRange().getValues();
        const linhaItem = dadosItens.find((linha) => linha[0] == item.itemId);

        if (!linhaItem) {
          throw new Error(`Item ${item.itemId} não encontrado`);
        }

        // Se item é controlado, reduzir estoque
        if (linhaItem[5]) {
          // Coluna controlado
          const indiceEstoque = 6; // Coluna estoque
          const numeroLinha = dadosItens.indexOf(linhaItem) + 1;
          const estoqueAtual = linhaItem[indiceEstoque] || 0;
          const novoEstoque = Math.max(0, estoqueAtual - item.quantidade);

          planilhaItens
            .getRange(numeroLinha, indiceEstoque + 1)
            .setValue(novoEstoque);
        }

        // Registrar movimentação
        const novaMovimentacao = [
          "", // ID será auto-incrementado
          item.itemId,
          dados.usuario_id,
          item.quantidade,
          "SAIDA",
          new Date(),
          dados.detalhes || "Retirada via app",
          dados.destino || "USUARIO",
        ];

        planilhaMovimentacoes.appendRow(novaMovimentacao);

        return { success: true, itemId: item.itemId };
      } catch (error) {
        return { success: false, itemId: item.itemId, error: error.toString() };
      }
    });

    return { success: true, message: "Movimentações registradas com sucesso" };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ====================================
// DEVOLUÇÕES
// ====================================

function devolverItens(dados) {
  try {
    const planilhaMovimentacoes =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("movimentacoes");
    const planilhaItens =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("itens");

    const resultados = [];

    // Processar cada tipo de devolução
    dados.itens.forEach((item) => {
      try {
        // Buscar dados do item
        const dadosItens = planilhaItens.getDataRange().getValues();
        const linhaItem = dadosItens.find((linha) => linha[0] == item.itemId);

        if (!linhaItem) {
          throw new Error(`Item ${item.itemId} não encontrado`);
        }

        // Se item retorna ao almoxarifado, aumentar estoque
        if (item.tipoRetorno === "RETORNA" && linhaItem[5]) {
          const indiceEstoque = 6;
          const numeroLinha = dadosItens.indexOf(linhaItem) + 1;
          const estoqueAtual = linhaItem[indiceEstoque] || 0;
          const novoEstoque = estoqueAtual + item.quantidade;

          planilhaItens
            .getRange(numeroLinha, indiceEstoque + 1)
            .setValue(novoEstoque);
        }

        // Registrar movimentação
        const tipoMovimentacao =
          item.tipoRetorno === "RETORNA" ? "ENTRADA" : "BAIXA";
        const destino =
          item.tipoRetorno === "RETORNA" ? "ALMOXARIFADO" : "CONSUMIDO";

        const novaMovimentacao = [
          "",
          item.itemId,
          dados.usuario_id,
          item.quantidade,
          tipoMovimentacao,
          new Date(),
          dados.detalhes || `Devolução via app - ${item.tipoRetorno}`,
          destino,
        ];

        planilhaMovimentacoes.appendRow(novaMovimentacao);

        resultados.push({ success: true, itemId: item.itemId });
      } catch (error) {
        resultados.push({
          success: false,
          itemId: item.itemId,
          error: error.toString(),
        });
      }
    });

    const todosSuccesso = resultados.every((r) => r.success);

    if (todosSuccesso) {
      return { success: true, message: "Devoluções processadas com sucesso" };
    } else {
      const erros = resultados.filter((r) => !r.success);
      return { success: false, error: `Erro em ${erros.length} item(s)` };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

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

// ====================================
// CONFIGURAÇÕES
// ====================================

function listarConfiguracoes() {
  try {
    let planilha;
    
    try {
      planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("configuracoes");
    } catch {
      // Se a planilha não existir, criar com configurações padrão
      planilha = SpreadsheetApp.getActiveSpreadsheet().insertSheet("configuracoes");
      planilha.getRange(1, 1, 1, 2).setValues([["chave", "valor"]]);
      
      // Adicionar configuração padrão de timeout
      planilha.appendRow(["timeout_sessao_min", 60]);
    }

    const dados = planilha.getDataRange().getValues();
    const configuracoes = {};

    // Converter para objeto chave-valor
    for (let i = 1; i < dados.length; i++) {
      configuracoes[dados[i][0]] = dados[i][1];
    }

    // Garantir que existe a configuração de timeout
    if (!configuracoes.timeout_sessao_min) {
      planilha.appendRow(["timeout_sessao_min", 60]);
      configuracoes.timeout_sessao_min = 60;
    }

    return { success: true, configuracoes };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function atualizarConfiguracao(chave, valor) {
  try {
    let planilha;
    
    try {
      planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("configuracoes");
    } catch {
      // Se a planilha não existir, criar
      planilha = SpreadsheetApp.getActiveSpreadsheet().insertSheet("configuracoes");
      planilha.getRange(1, 1, 1, 2).setValues([["chave", "valor"]]);
    }

    const dados = planilha.getDataRange().getValues();
    let linhaEncontrada = false;

    // Procurar se a chave já existe
    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0] === chave) {
        planilha.getRange(i + 1, 2).setValue(valor);
        linhaEncontrada = true;
        break;
      }
    }

    // Se não encontrou, adicionar nova linha
    if (!linhaEncontrada) {
      planilha.appendRow([chave, valor]);
    }

    return { success: true, message: "Configuração atualizada com sucesso" };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ====================================
// FUNÇÃO AUXILIAR PARA TESTES
// ====================================

function testarConexao() {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Conexão funcionando!",
      timestamp: new Date(),
    })
  );
}
