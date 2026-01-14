const API_URL = process.env.EXPO_PUBLIC_API_URL || 
  'https://script.google.com/macros/s/SUA_URL_AQUI/exec';

export type Categoria = {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
};

export type Item = {
  id: number;
  nome: string;
  categoria_id: number;
  tipo: string;
  unidade: string;
  controlado: boolean;
  estoque?: number;
  localizacao?: string;
  ativo: boolean;
};

export type User = {
  id: number;
  nome: string;
  email: string;
};

export type MovimentacaoItem = {
  itemId: number;
  quantidade: number;
};

export type Configuracao = {
  [chave: string]: any;
};

export async function login(pin: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', pin }),
  });

  return res.json();
}

export async function listarCategorias(mostrarInativos = false): Promise<{
  success: boolean;
  categorias: Categoria[];
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'listar_categorias', mostrarInativos }),
  });

  return res.json();
}

export async function listarItens(categoriaId: string | number, mostrarInativos = false): Promise<{
  success: boolean;
  itens: Item[];
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'listar_itens',
      categoria_id: categoriaId,
      mostrarInativos,
    }),
  });

  return res.json();
}

export async function criarCategoria(nome: string, descricao?: string): Promise<{
  success: boolean;
  categoria?: Categoria;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'criar_categoria',
      nome,
      descricao: descricao || '',
    }),
  });

  return res.json();
}

export async function inativarCategoria(id: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'inativar_categoria',
      id,
    }),
  });

  return res.json();
}

export async function ativarCategoria(id: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'ativar_categoria',
      id,
    }),
  });

  return res.json();
}

export async function inativarItem(id: number): Promise<{
  success: boolean;
  item?: Item;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'inativar_item',
      id,
    }),
  });

  return res.json();
}

export async function ativarItem(id: number): Promise<{
  success: boolean;
  item?: Item;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'ativar_item',
      id,
    }),
  });

  return res.json();
}

export async function criarItem(dados: {
  nome: string;
  categoria_id: number;
  tipo?: string;
  unidade?: string;
  controlado?: boolean;
  estoque_inicial?: number;
}): Promise<{
  success: boolean;
  item?: Item;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'criar_item',
      ...dados,
    }),
  });

  return res.json();
}

export async function movimentarItens(dados: {
  itens: MovimentacaoItem[];
  usuario_id: number;
  destino?: string;
  detalhes?: string;
}): Promise<{
  success: boolean;
  movimentacoes?: any[];
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'movimentar_itens',
      ...dados,
    }),
  });

  return res.json();
}

// Nova função para devolução de itens
export async function devolverItens(dados: {
  itens: MovimentacaoItem[];
  usuario_id: number;
  detalhes?: string;
}): Promise<{
  success: boolean;
  movimentacoes?: any[];
  error?: string;
}> {
  // Para devolução, usar o backend diretamente com os dados corretos
  const promises = dados.itens.map(item => {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'movimentar_itens',
        itens: [{ itemId: item.itemId, quantidade: item.quantidade }], // Mantém formato para compatibilidade
        usuario_id: dados.usuario_id,
        destino: 'ALMOXARIFADO',
        detalhes: dados.detalhes,
      }),
    }).then(res => res.json());
  });

  try {
    const results = await Promise.all(promises);
    const allSuccess = results.every(r => r.success);
    
    if (allSuccess) {
      return { success: true, movimentacoes: results };
    } else {
      const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
      return { success: false, error: `Erro em algumas devoluções: ${errors}` };
    }
  } catch {
    return { success: false, error: 'Erro na comunicação com o servidor' };
  }
}

export async function devolverItensAoEstoque(dados: {
  itens: { itemId: number; quantidade: number; localizacao: string }[];
  usuario_id: number;
  detalhes?: string;
}) {
  const promises = dados.itens.map(item => {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'devolver_estoque',
        itemId: item.itemId,
        quantidade: item.quantidade,
        localizacao: item.localizacao,
        usuario_id: dados.usuario_id,
        detalhes: dados.detalhes,
      }),
    }).then(res => res.json());
  });

  try {
    const results = await Promise.all(promises);
    const allSuccess = results.every((r: any) => r.success);
    
    if (allSuccess) {
      return { success: true, movimentacoes: results };
    } else {
      const errors = results.filter((r: any) => !r.success).map((r: any) => r.error).join(', ');
      return { success: false, error: `Erro em algumas devoluções: ${errors}` };
    }
  } catch {
    return { success: false, error: 'Erro na comunicação com o servidor' };
  }
}
export async function listarConfiguracoes(): Promise<{
  success: boolean;
  configuracoes: Configuracao;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'listar_configuracoes' }),
  });

  return res.json();
}

export async function atualizarConfiguracao(chave: string, valor: any): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'atualizar_configuracao',
      chave,
      valor
    }),
  });

  return res.json();
}