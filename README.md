<div align="left">
  <img src="assets/gen3kit.png" alt="gen3.KIT Logo" width="200"/>
  <p><strong>O companion app definitivo e minimalista para quem não lembra tanto assim das especificidades da 3ª Geração de Pokémon.</strong></p>
</div>

---

## A Ideia por Trás do Projeto

Quem joga a terceira geração de Pokémon (Ruby, Sapphire, Emerald, FireRed e LeafGreen) no hardware original ou em emuladores conhece bem algumas dores de cabeça clássicas:
1. **A Divisão Physical/Special:** Na Gen 3, o dano físico ou especial é atrelado ao Tipo do Pokémon, e não ao ataque em si. Decorar isso é um pesadelo.
2. **Consultas Lentas:** Parar o jogo para abrir wikis poluídas e pesadas no celular quebra totalmente o ritmo da gameplay.

O gen3.KIT nasceu para resolver isso. É um PWA (Progressive Web App) mobile-first, desenhado com foco absoluto em usabilidade, performance e estética. Sem frameworks pesados, construído apenas com TypeScript, HTML e CSS puro. O app muda de tema e dados dinamicamente de acordo com o cartucho que você seleciona, oferecendo exatamente a informação que você precisa, na hora que você precisa.

## Funcionalidades

- **Temas Dinâmicos:** A paleta de cores e a animação de fundo do app se adaptam instantaneamente ao jogo selecionado no Header (ex: verde esmeralda para Emerald, vermelho fogo para FireRed).
- **Referência Rápida de Tipagem:** Tela inicial focada em tirar a dúvida crucial da Gen 3: quais tipos batem Physical e quais batem Special.
- **Pokédex Regional Integrada:** Motor de busca em tempo real consumindo a PokéAPI. Filtra os Pokémon disponíveis no jogo selecionado, exibindo exclusivamente os sprites originais do Game Boy Advance.
- **Rastreador de Evoluções:** Parser complexo da árvore de evoluções (evolution-chain) para detalhar se o Pokémon evolui por Level, Pedra, Troca ou Felicidade.

## Arquitetura e Fluxo de Navegação

O app funciona como uma Single Page Application (SPA) controlada via TypeScript, garantindo transições instantâneas entre as visualizações sem recarregar a página.

```mermaid
graph TD
    A[Header Central] -->|Seleciona o Jogo| B(Motor de Tema TS)
    B -->|Atualiza Variáveis CSS| C[UI Base]
    B -->|Define Região de Busca| D[PokéAPI Fetcher]
    
    C --> E{Bottom Navigation}
    
    E -->|Aba 1| F[View: Tipos]
    F --> F1(Cards Físico/Especial)
    
    E -->|Aba 2| G[View: Dex]
    G --> G1(Input Busca/Filtro)
    G1 --> G2(Grid de Sprites GBA)
    D --> G2
    
    E -->|Aba 3| H[View: Evoluções]
    H --> H1(Busca de Espécie)
    H1 --> H2(Renderiza Evolution Chain)

    E -->|Aba 4| I[View: HMs]
    I --> I1(Toggles de HMs por Região)
    I1 --> I2(Filtro de Compatibilidade)
    D --> I2
    
    classDef highlight fill:#1e1e24,stroke:#50C878,stroke-width:2px,color:#fff;
    class B,D highlight;

```

## Tecnologias Utilizadas

- **HTML5 & CSS3:** Estrutura semântica e estilização avançada (Flexbox, CSS Grid, Variáveis CSS, Backdrop-filter para Glassmorphism, Safe-area-inset para iOS).
- **TypeScript:** Lógica de navegação SPA, gerenciamento de estado do tema e requisições assíncronas.
- **PokéAPI:** Consumo de dados RESTful (/pokedex/, /pokemon-species/, /evolution-chain/).
- **PWA (Progressive Web App):** Manifesto e configurações de cache para instalação direta na tela inicial de smartphones.
