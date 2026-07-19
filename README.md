# Portfólio — Eder Queiroz

Site pessoal de portfólio de **Eder Queiroz**, engenheiro de software. Uma landing page única em layout *bento*, com três widgets animados que ilustram cases reais (um ledger de pontos com consumo FIFO, uma fila SQS com retries/DLQ e um algoritmo genético), suporte a **PT/EN** e tooltips de skills.

Publicado em: **https://ederqueiroz.dev.br/**

## Stack

- [Vite](https://vitejs.dev/) — build e dev server
- HTML / CSS / JavaScript puro (sem framework de UI)
- [`@floating-ui/dom`](https://floating-ui.com/) — posicionamento dos tooltips de skills
- [`motion`](https://motion.dev/) — animações
- Fontes self-hosted via `@fontsource-variable/inter` e `@fontsource-variable/jetbrains-mono` (sem chamadas externas ao Google Fonts)

## Como rodar localmente

Requer Node.js e npm instalados.

```bash
git clone https://github.com/Eder-Queiroz/portfolio.git
cd portfolio
npm install
npm run dev
```

O Vite abre o site em modo desenvolvimento (com hot reload) em `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Gera os arquivos estáticos otimizados em `dist/`. Para pré-visualizar o build localmente antes do deploy:

```bash
npm run preview
```

## Deploy (VPS própria)

O site é 100% estático — basta servir o conteúdo de `dist/` com qualquer servidor web.

1. Gerar o build:

   ```bash
   npm run build
   ```

2. Copiar o conteúdo de `dist/` para a VPS (ajuste host e caminho conforme o seu servidor):

   ```bash
   rsync -avz --delete dist/ usuario@seu-servidor:/var/www/portfolio/
   ```

3. Exemplo de bloco de configuração do Nginx:

   ```nginx
   server {
       listen 80;
       server_name ederqueiroz.dev.br;

       root /var/www/portfolio;
       index index.html;

       # SPA: qualquer rota cai no index.html
       location / {
           try_files $uri /index.html;
       }

       # cache agressivo para assets versionados pelo Vite (hash no nome do arquivo)
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   Configure HTTPS (ex.: Certbot/Let's Encrypt) e recarregue o Nginx após aplicar (`nginx -t && systemctl reload nginx`).

## Estrutura de pastas

```
.
├── index.html              # documento único do site (SPA estática)
├── public/                 # assets servidos como estão (favicon, robots.txt, og-image)
├── src/
│   ├── i18n/                # dicionários de tradução (pt.json / en.json)
│   ├── js/
│   │   ├── main.js           # bootstrap da página
│   │   ├── i18n.js           # troca de idioma e persistência
│   │   ├── utils.js          # helpers (scroll reveal, prefers-reduced-motion, etc.)
│   │   └── widgets/          # widgets animados (ledger, sqs, genetic, skills, typing)
│   └── styles/               # CSS modular (tokens, grid, header, hero, cases, etc.)
└── vite.config.js
```

## Internacionalização (i18n)

O conteúdo textual vive em `src/i18n/pt.json` e `src/i18n/en.json`, aplicado via `src/js/i18n.js` a elementos marcados com `data-i18n="chave"` no `index.html`. O idioma escolhido pelo usuário (botão de troca no header) é persistido em `localStorage`, e a próxima visita já carrega no idioma salvo. Português é o idioma padrão.
