# Weather Explorer

Consulte o clima e a previsão de 5 dias de qualquer cidade e colecione **carimbos, XP e conquistas** no seu passaporte climático.

**Tecnologias:** React 18, Vite, OpenWeatherMap API, GitHub Actions + GitHub Pages.

## Recursos
- Busca por cidade (ou pelo pino, que usa sua localização), previsão de 5 dias, °C/°F (toque no °C) e cidades favoritas
- Autocomplete de cidades (setas e Enter funcionam) e checagem de chuva por data, até 16 dias à frente (Open-Meteo, sem chave)
- Animações: campo de busca reage ao digitar, o cartão se abre e o clima entra em sequência com a temperatura contando até o valor
- Identidade visual do projeto original (azul #06283D, cartão branco, ilustrações por clima), com fundo mais escuro à noite
- Gamificação: XP, níveis, conquistas e carimbos (salvos no `localStorage`)
- Tratamento de erros e estados de carregamento, com acessibilidade básica

## Rodando localmente
```bash
npm install
cp .env.example .env   # coloque sua chave do OpenWeatherMap em VITE_OWM_KEY
npm run dev
```

## Publicando (GitHub Pages)
1. Repositório → **Settings → Secrets and variables → Actions** → novo secret `VITE_OWM_KEY` com sua chave.
2. **Settings → Pages → Source: GitHub Actions**.
3. A cada push na `main` o site é construído e publicado.

> Atenção: como o app roda no navegador, a chave vai junto no JavaScript final. Use uma chave do plano gratuito e nunca commite o arquivo `.env`.
