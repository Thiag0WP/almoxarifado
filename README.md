# 📦 Almoxarifado TI

<div align="center">

![Logo](./assets/images/icon.png)

**Sistema completo de gerenciamento de almoxarifado e estoque para departamentos de TI**

[![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-61dafb?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Built%20with-Expo-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-4285f4?style=for-the-badge&logo=google)](https://script.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[📱 Download APK](#-instalação) • [📚 Documentação](#-como-usar) • [🛠️ Configuração](#-configuração) • [🤝 Contribuir](#-contribuindo)

</div>

## ✨ Sobre o Projeto

O **Almoxarifado TI** é uma solução moderna e completa para gerenciamento de estoque voltada para departamentos de Tecnologia da Informação. Desenvolvido com React Native e Expo, oferece uma interface responsiva que funciona perfeitamente em tablets e smartphones.

### 🎯 **Problema Resolvido**

- ❌ Planilhas desorganizadas e difíceis de atualizar
- ❌ Falta de controle de retiradas e devoluções
- ❌ Dificuldade em localizar itens no estoque
- ❌ Ausência de histórico de movimentações

### ✅ **Nossa Solução**

- ✅ Interface intuitiva e moderna
- ✅ Sistema de carrinho para retiradas em lote
- ✅ Controle de localização de itens
- ✅ Histórico completo de movimentações
- ✅ Sistema de devoluções organizadas

## 🚀 Funcionalidades Principais

### 📊 **Gestão Completa**

- **Categorização inteligente** - Organize itens por categorias customizáveis
- **Controle de estoque** - Monitore quantidades em tempo real
- **Sistema de localização** - Saiba exatamente onde cada item está armazenado
- **Status ativo/inativo** - Gerencie itens temporariamente indisponíveis

### 🛒 **Operações de Estoque**

- **Carrinho de retiradas** - Selecione múltiplos itens em uma única operação
- **Devoluções organizadas** - Devolva itens ao estoque ou para outros usuários
- **Histórico detalhado** - Acompanhe todas as movimentações

### 🔐 **Segurança e Controle**

- **Autenticação por PIN** - Acesso seguro e rápido
- **Timeout de sessão** - Logout automático por inatividade
- **Configurações flexíveis** - Adapte o sistema às suas necessidades

### 📱 **Interface Responsiva**

- **Design adaptativo** - Funciona perfeitamente em tablets e smartphones
- **Tema consistente** - Interface moderna e profissional
- **Navegação intuitiva** - Fácil de usar para qualquer pessoa

## 🛠️ Tecnologias Utilizadas

### **Frontend**

```
React Native + Expo         # Framework mobile multiplataforma
TypeScript                  # Tipagem estática
Expo Router                  # Navegação baseada em arquivos
React Context                # Gerenciamento de estado
AsyncStorage                 # Persistência local
```

### **Backend**

```
Google Apps Script           # Serverless backend
Google Sheets               # Banco de dados
RESTful API                 # Comunicação HTTP/JSON
```

### **Design & UX**

```
Design System customizado    # Tema consistente
Ionicons                    # Ícones profissionais
Interface responsiva        # Tablet + Smartphone
```

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Google (para Google Sheets + Apps Script)
- Expo CLI ou EAS CLI instalado
- Android Studio (para build local Android) ou Xcode (para iOS)

## 🚀 Instalação

### 1️⃣ **Clone o repositório**

```bash
git clone https://github.com/Thiag0WP/almoxarifado.git
cd almoxarifado
```

### 2️⃣ **Instale as dependências**

```bash
npm install
```

### 3️⃣ **Configure as variáveis de ambiente**

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione sua URL da Google Apps Script
nano .env
```

### 4️⃣ **Configure o backend** (Google Apps Script)

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha seguindo a [estrutura documentada](./ESTRUTURA_PLANILHAS.md)
3. Configure o Google Apps Script com o código em [`backend-completo.gs`](./backend-completo.gs)
4. Copie a URL do Web App e adicione no arquivo `.env` como `EXPO_PUBLIC_API_URL`

### 5️⃣ **Execute o projeto**

```bash
# Desenvolvimento com Expo Go
npm start

# Build para Android (APK)
eas build --platform android --profile preview

# Build para produção
eas build --platform android --profile production
```

## 📖 Como Usar

### 🔑 **1. Login**

- Abra o app e digite seu PIN de acesso
- O PIN é configurado na planilha Google Sheets

### 📦 **2. Navegação**

- **Categorias**: Visualize e gerencie categorias e itens
- **Caixa**: Seu carrinho de itens selecionados
- **Estoque**: Realize devoluções ao estoque
- **Configurações**: Ajuste timeout de sessão e outras configurações

### 🛒 **3. Retirar Itens**

1. Navegue pelas categorias
2. Selecione a quantidade desejada de cada item
3. Vá para "Caixa" e confirme a retirada
4. Adicione detalhes sobre o destino

### 📥 **4. Devolver Itens**

- **Para estoque**: Use a aba "Estoque" → "Devolver ao Estoque"
- **Para pessoa**: Use a aba "Caixa" → "Devolver Itens"

## � Variáveis de Ambiente

O projeto usa variáveis de ambiente para manter dados sensíveis seguros:

```bash
# .env (não commitado no Git)
EXPO_PUBLIC_API_URL=https://script.google.com/macros/s/SUA_URL_AQUI/exec
```

**Importante**:

- Copie o arquivo `.env.example` para `.env`
- Adicione sua URL real do Google Apps Script
- O arquivo `.env` está no `.gitignore` por segurança

## �📁 Estrutura do Projeto

```
almoxarifado/
├── 📱 app/                          # Telas do aplicativo
│   ├── (tabs)/                     # Navegação em tabs
│   │   ├── index.tsx              # Tela de categorias
│   │   ├── explore.tsx            # Tela da caixa/carrinho
│   │   ├── estoque.tsx            # Tela de estoque
│   │   └── configuracoes.tsx      # Configurações
│   ├── carrinho.tsx               # Tela do carrinho
│   ├── devolver.tsx               # Tela de devolução
│   └── login.tsx                  # Tela de login
├── 🎨 assets/                       # Recursos visuais
│   └── images/                    # Ícones e imagens
├── ⚙️ src/                          # Código fonte principal
│   ├── components/                # Componentes reutilizáveis
│   ├── services/                  # Comunicação com API
│   ├── context/                   # Contextos React
│   ├── hooks/                     # Hooks customizados
│   └── styles/                    # Sistema de tema
├── 📄 backend-completo.gs           # Google Apps Script
├── 📋 ESTRUTURA_PLANILHAS.md        # Documentação do backend
└── ⚙️ eas.json                      # Configuração de build
```

## 🔧 Configuração

### **Google Apps Script**

1. Siga o guia em [ESTRUTURA_PLANILHAS.md](./ESTRUTURA_PLANILHAS.md)
2. Configure as planilhas: `usuarios`, `categorias`, `itens`, `movimentacoes`, `configuracoes`
3. Implemente o Google Apps Script
4. Atualize a URL da API no código

### **Configurações do App**

- **Timeout de sessão**: Configurável na aba "Configurações"
- **Temas**: Sistema de design responsivo automático
- **Localização**: Campo opcional para itens

## 🎨 Capturas de Tela

| Categorias                                                                       | Itens                                                                  | Carrinho                                                                     | Configurações                                                                   |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| ![Categorias](https://via.placeholder.com/200x400/2563EB/FFFFFF?text=Categorias) | ![Itens](https://via.placeholder.com/200x400/10B981/FFFFFF?text=Itens) | ![Carrinho](https://via.placeholder.com/200x400/F59E0B/FFFFFF?text=Carrinho) | ![Configurações](https://via.placeholder.com/200x400/8B5CF6/FFFFFF?text=Config) |

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 💡 **Ideias para contribuição:**

- [ ] Modo dark/light automático
- [ ] Notificações push para estoque baixo
- [ ] Relatórios de movimentação
- [ ] Integração com código de barras
- [ ] Sistema de aprovação de retiradas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Thiago**

- GitHub: [@Thiag0WP](https://github.com/Thiag0WP)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

**📱 Desenvolvido com ❤️ usando React Native + Expo**

</div>
