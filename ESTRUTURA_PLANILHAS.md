# 📊 ESTRUTURA DAS PLANILHAS - ALMOXARIFADO TI

## 🔧 Como Configurar

### 1. Crie um novo Google Sheets com as seguintes planilhas:

---

## 📋 **Planilha: "usuarios"**

**Colunas (A até D):**

```
A | B    | C     | D
--|------|-------|----
id| nome | email | pin
1 | João | joao@empresa.com | 1234
2 | Maria| maria@empresa.com| 5678
```

**Exemplo de dados:**

- Linha 1 (cabeçalho): `id | nome | email | pin`
- Linha 2: `1 | João Silva | joao.silva@empresa.com | 1234`
- Linha 3: `2 | Maria Santos | maria.santos@empresa.com | 5678`

---

## 📁 **Planilha: "categorias"**

**Colunas (A até D):**

```
A | B          | C         | D
--|------------|-----------|------
id| nome       | descricao | ativo
1 | Equipamentos| Computadores, notebooks, etc | true
2 | Periféricos | Mouse, teclado, etc | true
3 | Ferramentas | Chaves de fenda, etc | true
4 | Consumíveis | Pilhas, papel, etc | true
5 | Infraestrutura | Cabos, switches, etc | true
6 | Serviços   | Manutenção, suporte, etc | true
```

**Exemplo de dados:**

- Linha 1 (cabeçalho): `id | nome | descricao | ativo`
- Linha 2: `1 | Equipamentos | Computadores, notebooks, tablets | true`
- Linha 3: `2 | Periféricos | Mouse, teclado, monitor | true`
- Linha 4: `3 | Ferramentas | Ferramentas de manutenção | true`

**Explicação das colunas:**

- **id**: Número único da categoria
- **nome**: Nome da categoria
- **descricao**: Descrição opcional da categoria
- **ativo**: true (categoria ativa) ou false (categoria inativa)

**Funcionalidades:**

- ✅ **Inativar categoria** ao invés de deletar
- ✅ **Manter histórico** de categorias antigas
- ✅ **Filtrar por ativas/inativas** no app
- ✅ **Reativar categorias** quando necessário

---

## 📦 **Planilha: "itens"**

**Colunas (A até I):**

```
A | B     | C          | D    | E      | F         | G      | H          | I
--|-------|------------|------|--------|-----------|--------|------------|------
id| nome  | categoria_id| tipo | unidade| controlado| estoque| localizacao| ativo
1 | Mouse | 2          | USB  | UN     | TRUE      | 10     | Gaveta A1  | true
2 | Cabo  | 3          | HDMI | UN     | FALSE     | 0      | Prat. B2   | true
3 | Teclado| 2         | USB  | UN     | TRUE      | 0      | Gaveta A2  | false
```

**Exemplo de dados:**

- Linha 1 (cabeçalho): `id | nome | categoria_id | tipo | unidade | controlado | estoque | localizacao | ativo`
- Linha 2: `1 | Mouse Wireless | 2 | USB | UN | TRUE | 10 | Gaveta A1 | true`
- Linha 3: `2 | Cabo HDMI | 3 | HDMI | UN | FALSE | 0 | Prateleira B2 | true`
- Linha 4: `3 | Teclado Antigo | 2 | USB | UN | TRUE | 0 | Gaveta A2 | false`

**Explicação das colunas:**

- **id**: Número único do item
- **nome**: Nome do item
- **categoria_id**: ID da categoria (deve existir na planilha categorias)
- **tipo**: Tipo/modelo do item (opcional)
- **unidade**: UN, KG, MT, etc.
- **controlado**: TRUE (controla estoque) ou FALSE
- **estoque**: Quantidade disponível
- **localizacao**: Onde o item está guardado (opcional)
- **ativo**: true (item ativo) ou false (item inativo)

**Funcionalidades:**

- ✅ **Inativar item** ao invés de deletar
- ✅ **Manter histórico** de itens antigos
- ✅ **Filtrar por ativos/inativos** no app
- ✅ **Reativar itens** quando necessário

---

## 📊 **Planilha: "movimentacoes"**

**Colunas (A até H):**

```
A | B      | C        | D        | E    | F           | G       | H
--|--------|----------|----------|------|-------------|---------|--------
id| item_id| usuario_id| quantidade| tipo | data       | detalhes| destino
1 | 1      | 1        | 2        | SAIDA| 2026-01-13 | Empréstimo| USUARIO
2 | 1      | 1        | 1        | ENTRADA| 2026-01-14| Devolução| ALMOXARIFADO
```

**Exemplo de dados:**

- Linha 1 (cabeçalho): `id | item_id | usuario_id | quantidade | tipo | data | detalhes | destino`
- Linha 2: `1 | 1 | 1 | 2 | SAIDA | 2026-01-13 | Empréstimo para projeto | USUARIO`
- Linha 3: `2 | 1 | 1 | 1 | ENTRADA | 2026-01-14 | Devolução do projeto | ALMOXARIFADO`

**Tipos de movimentação:**

- **SAIDA**: Item foi retirado
- **ENTRADA**: Item foi devolvido
- **ENTRADA_ESTOQUE**: Item foi adicionado ao estoque
- **BAIXA**: Item foi consumido/perdido

---

## 🚀 **Passos para Implementação:**

### 1. **Criar o Google Sheets:**

- Vá para [sheets.google.com](https://sheets.google.com)
- Clique em "Criar planilha em branco"
- Renomeie para "Almoxarifado TI"

### 2. **Criar as 4 planilhas:**

- Clique no "+" no canto inferior esquerdo para adicionar planilhas
- Renomeie as abas para: `usuarios`, `categorias`, `itens`, `movimentacoes`
- Cole os cabeçalhos exatamente como mostrado acima

### 3. **Adicionar dados de exemplo:**

- Adicione pelo menos 1 usuário na planilha `usuarios`
- Adicione algumas categorias na planilha `categorias`
- Os itens e movimentações podem ficar vazios (serão criados pelo app)

### 4. **Configurar o Google Apps Script:**

- No Google Sheets, vá em **Extensões** > **Apps Script**
- Apague o código padrão
- Cole o código do arquivo `backend-completo.gs`
- Clique em **Salvar**
- Clique em **Implantar** > **Nova implantação**
- Escolha **Aplicativo da Web**
- Execute como: **Eu**
- Quem tem acesso: **Qualquer pessoa**
- Clique em **Implantar**
- **Copie a URL** gerada

### 5. **Atualizar o app:**

- No arquivo `src/services/api.ts` do seu app
- Substitua a `API_URL` pela URL que você copiou

### 6. **Testar:**

- Execute o app
- Tente fazer login com o PIN cadastrado na planilha usuarios
- Crie uma categoria, depois adicione itens

---

---

## ⚙️ **Planilha: "configuracoes"**

**Colunas (A até B):**

```
A                | B
-----------------|----
chave            | valor
timeout_sessao_min | 60
```

**Exemplo de dados:**

- Linha 1 (cabeçalho): `chave | valor`
- Linha 2: `timeout_sessao_min | 60`

**Configurações disponíveis:**

- `timeout_sessao_min`: Tempo em minutos para logout automático por inatividade

---

## ✅ **Checklist Final:**

- [ ] 5 planilhas criadas com nomes exatos (usuarios, categorias, itens, movimentacoes, configuracoes)
- [ ] Cabeçalhos das colunas exatamente como especificado
- [ ] Pelo menos 1 usuário cadastrado
- [ ] Configuração de timeout definida
- [ ] Google Apps Script configurado
- [ ] URL atualizada no app
- [ ] Teste de login funcionando

## 🔧 **Dicas Importantes:**

1. **Mantenha os nomes das planilhas exatos** (usuarios, categorias, itens, movimentacoes, configuracoes)
2. **Não altere a ordem das colunas**
3. **O campo "localizacao" é opcional** mas deve existir na coluna H
4. **IDs devem ser numéricos** e únicos
5. **Controlado deve ser TRUE ou FALSE** (não Verdadeiro/Falso)
6. **Configurações são criadas automaticamente** se não existirem

Agora você pode usar o sistema completo! 🚀
