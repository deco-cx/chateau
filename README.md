# 🏰 Chateau

**Avaliador inteligente de textos com critérios personalizáveis**

Chateau é uma aplicação web que utiliza inteligência artificial para avaliar textos de acordo com critérios personalizáveis. Construído com React, Tiptap e integração com deco.chat MCP.

## ✨ Funcionalidades

- 📝 **Editor Rich-text**: Editor Tiptap com formatação completa (negrito, itálico, headings, listas)
- ⚖️ **Avaliação Inteligente**: IA analisa textos e fornece notas (0-10) + feedback detalhado
- ⚙️ **Critérios Personalizáveis**: Configure seus próprios critérios de avaliação via modal
- 💾 **Auto-save**: Persistência automática no IndexedDB (funciona offline)
- 🎯 **Critérios Default**: Clareza, Coerência, Gramática, Criatividade

## 🚀 Como Usar

1. **Acesse**: http://localhost:8787
2. **Escreva**: Digite seu texto no editor da esquerda
3. **Configure**: (Opcional) Personalize critérios clicando em "Configurar Critérios"
4. **Avalie**: Clique no botão "Avaliar" para receber análise com IA
5. **Veja Resultados**: Notas e feedback aparecem no painel da direita

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Editor**: Tiptap (rich-text editor)
- **Backend**: Cloudflare Workers, deco.chat MCP
- **IA**: AI_GENERATE_OBJECT para análise estruturada
- **Persistência**: IndexedDB para armazenamento local
- **Build**: Vite

## 🏗️ Arquitetura

```
chateau/
├── server/          # MCP Server (Cloudflare Workers)
│   ├── main.ts     # Tools e workflows
│   └── deco.gen.ts # Tipos gerados das integrações
└── view/           # Frontend React
    ├── src/
    │   ├── components/  # Componentes UI
    │   ├── lib/        # RPC client e IndexedDB
    │   └── types.ts    # Tipos TypeScript
    └── package.json
```

## 🚀 Desenvolvimento

### Pré-requisitos
- Node.js ≥18
- Deno ≥2.0
- deco CLI: `deno install -Ar -g -n deco jsr:@deco/cli`

### Setup
```bash
# Instalar dependências
npm install

# Configurar app no deco.chat
npm run configure

# Desenvolvimento (frontend + backend)
npm run dev

# Deploy para produção
npm run deploy
```

### Scripts Disponíveis
- `npm run dev` - Inicia desenvolvimento (frontend:4000 + backend:8787)
- `npm run gen` - Gera tipos das integrações deco.chat
- `npm run gen:self` - Gera tipos das próprias tools/workflows
- `npm run deploy` - Deploy para Cloudflare Workers

## 🎯 Como Funciona

1. **Editor**: Usuário escreve texto no editor Tiptap
2. **Critérios**: Sistema usa 4 critérios default ou personalizados
3. **Schema Dinâmico**: Gera JSON Schema baseado nos critérios
4. **IA**: Chama `AI_GENERATE_OBJECT` com prompt estruturado
5. **Resultado**: Recebe notas (0-10) e feedback para cada critério
6. **Persistência**: Salva tudo no IndexedDB automaticamente

## 📊 Critérios Default

- **Clareza**: Facilidade de compreensão do texto
- **Coerência**: Conexão lógica entre as ideias
- **Gramática**: Correção gramatical e ortográfica
- **Criatividade**: Originalidade e inovação do conteúdo

## 🔧 Personalização

Você pode:
- ✅ Adicionar novos critérios
- ✅ Editar critérios existentes
- ✅ Personalizar prompts de avaliação
- ✅ Remover critérios não desejados

## 📱 Interface

- **Layout Responsivo**: Two-column no desktop, single-column no mobile
- **Estados Visuais**: Loading, empty state, error handling
- **Feedback Visual**: Cores diferentes para notas (verde/amarelo/vermelho)
- **Auto-save**: Salva enquanto você digita (debounce 1s)

## 🌐 Deploy

O app é automaticamente deployado no Cloudflare Workers via deco.chat:
- **URL de Produção**: `https://seu-app.deco.page`
- **MCP Endpoint**: Disponível para integração com agentes IA
- **Assets**: Frontend servido via Cloudflare CDN

---

**Construído com ❤️ usando deco.chat MCP Platform**
