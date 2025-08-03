# 📜 Plano Inicial do Projeto

> Este documento define o escopo mínimo viável (MVP) para o aplicativo de avaliação de textos, descrevendo responsabilidades de cada camada, fases de implementação e tarefas prioritárias.

---

## 🎯 Visão Geral

1. **Editor (esquerda)** – Editor rich-text (Tiptap) onde o usuário escreve ou cola seu texto.
2. **Painel de Avaliação (direita)** – Exibe as notas e comentários gerados automaticamente a partir dos critérios configurados.
3. **Botão “Avaliar”** – Chama, via RPC, a ferramenta `GENERATE_OBJECT` (ver `server/deco.gen.ts`) passando o conteúdo do editor e o _schema_ dinâmico dos critérios para obter a avaliação.
4. **Configuração de Critérios** – Modal que permite adicionar/editar/remover critérios (cada um com `title` e `prompt`).
5. **Persistência** – Todo o estado (texto, critérios, avaliações) é salvo no **IndexedDB** para uso offline.

---

## 🏗️ Arquitetura

```mermaid
flowchart LR
    subgraph Frontend (React + Vite + Tiptap)
        A[Editor Tiptap]
        B[Botão "Avaliar"]
        C[Modal Configuração]
        D[Painel de Avaliação]
        A --texto--> B
        C --critérios--> B
        B -->|RPC GENERATE_OBJECT|
    end

    subgraph Backend (Cloudflare Worker MCP)
        E[Tool/Workflow GENERATE_OBJECT]
    end

    B -->|client.tools.GENERATE_OBJECT| E
    E -->|Notas JSON| D
```

---

## 📦 Tech-Stack

- **Backend**: Cloudflare Workers + Deco runtimes (Tools & Workflows em TypeScript)
- **Frontend**: React 18, Vite, Tailwind CSS, Tiptap, TanStack Router, IndexedDB via `idb` ou semelhante
- **State**: React Context ou Zustand (leve) para estados transitórios; IndexedDB para persistido

---

## 🔍 Requisitos Funcionais

1. **Editar texto** com formatação básica (negrito, itálico, listas, headings)
2. **Avaliar texto** com 4 critérios default (clareza, coerência, gramática, criatividade)
3. **Configurar critérios** (CRUD) via modal
4. **Persistir** texto + critérios + última avaliação no IndexedDB
5. **Recarregar app** deve restaurar último estado salvo

---

## 🚧 Roadmap & Tarefas

### Fase 0 – Setup
- [ ] Configurar monorepo (`npm install`, `npm run dev`)
- [ ] Integrar Tailwind no `view/`
- [ ] Garantir RPC client funcionando (`view/src/lib/rpc.ts`)

### Fase 1 – Editor & UI Base
- [ ] Adicionar Tiptap + extensões básicas
- [ ] Layout two-column (editor left, painel right)
- [ ] Botão fixo “Avaliar” acima do editor

### Fase 2 – Integração GENERATE_OBJECT
- [ ] Examinar `deco.gen.ts` para parâmetros da tool
- [ ] Criar chamada `client.tools.GENERATE_OBJECT` enviando { text, schema }
- [ ] Renderizar resultado no Painel de Avaliação

### Fase 3 – Configuração de Critérios
- [ ] Criar modal (shadcn/ui `Dialog`)
- [ ] Formulário dinâmico para adicionar/remover critérios
- [ ] Validar campos `title` (string) e `prompt` (string)
- [ ] Atualizar estado global + persistir

### Fase 4 – Persistência IndexedDB
- [ ] Abstrair camada `db.ts` usando `idb`
- [ ] Salvar/recuperar: texto, critérios, avaliações
- [ ] Sincronizar alterações em tempo real (onChange debounce)

### Fase 5 – Refino & Deploy
- [ ] UX: loading state, erros, toasts
- [ ] Responsividade (mobile-first)
- [ ] Testes básicos (unitários tool & componentes)
- [ ] `npm run deploy` → Cloudflare / deco.page 🔗

---

## ⚙️ Estrutura de Dados

```ts
interface Criterion {
  id: string;           // uuid
  title: string;        // "Clareza"
  prompt: string;       // prompt parcial para LLM
}

interface Evaluation {
  criterionId: string;
  score: number;        // 0-10
  feedback: string;     // texto livre
}

interface SavedState {
  text: string;
  criteria: Criterion[];
  evaluations: Evaluation[];
  updatedAt: string;    // ISO
}
```

---

## 🔑 Pontos de Atenção

- **Schema dinâmico**: o corpo enviado a `GENERATE_OBJECT` deve ser gerado a partir dos critérios atuais.
- **Limites de token**: chunk de texto + prompts pode estourar limite — considerar truncar/avisar.
- **IndexedDB**: versionamento do schema caso mudem os campos.
- **A11y & i18n**: componentes acessíveis e texto em pt-BR.

---

## 📚 Próximos Passos
1. Seguir Fase 0 e confirmar ambiente rodando.
2. Implementar layout mínimo (Fase 1) para visualizar rapidamente.
3. Conectar backend (Fase 2) para ciclo de feedback completo.
4. Iterar nas demais fases. 