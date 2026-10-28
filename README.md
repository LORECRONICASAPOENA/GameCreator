# APOENA GAME CREATOR — BASE v4.0 + PIXEL ART INTEGRADO

> **Programa único, um único projeto.** O Game Creator v4.0 é a base da aplicação. Personagens, objetos e mapas Pixel Art são ferramentas da navegação interna, não outro game editor e não outro repositório.

## Estado real — 28/10/2026

- Fonte integral **v4.0 original** preservada: `APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html` (16,3 MB, possui os módulos 3.9, 3.9.2 e a bancada 4.0).
- **v3.9.2** original preservada como backup histórico; código antigo da v3.9 também está em `legacy/`.
- Editor nativo integrado: construção determinística com `integracao/build_unificado.py` ou `integracao/build_unificado.ps1`, que **substitui `index.html` pelo conteúdo da v4.0** com aba adicional Pixel Art. **Não usa iframe, não abre um segundo editor e não cria um segundo inventário.**
- **Importante:** o GitHub Actions que deveria compilar/publicar automaticamente `index.html` falhou antes das etapas executarem. Até a publicação bem-sucedida, o `index.html` existente no branch pode continuar sendo o iniciador antigo. **Não confundir** o iniciador que aparece no GitHub com a v4.0 já integrada. A fonte v4.0 continua íntegra.

## Como abrir a versão realmente integrada no Windows 10/11

1. Baixe o repositório pelo botão **Code → Download ZIP** e extraia todas as pastas.
2. Abra **`ABRIR_GAME_CREATOR.cmd`** (já atualizado). O arquivo executa o PowerShell de compilação e abre `index.html` com a v4.0 e suas abas integradas.
3. Na barra do próprio Game Creator, escolha **Pixel Art**. Dentro dessa aba estão Personagens / Animações, Objetos / Funções / Clima e Mapas / Cenários.
4. Use o botão original **Salvar projeto editável** na barra superior. Salva o mesmo projeto `apoena.central.v1` com itens, receitas, imagens, personagens e mapas.

**Celular/Android:** para abrir a versão integrada diretamente no navegador, o arquivo `index.html` compilado precisa estar no pacote ou no repositório. O PowerShell acima só é executado no Windows. O HTML original v4.0 isolado funciona no celular, mas não inclui a aba Pixel Art até a compilação. Não prometer que o iniciador antigo do GitHub já esteja correto.

## Um único banco de itens

A Fábrica Universal de Itens da v4.0 é a **fonte oficial**. Não criar uma segunda fábrica no Pixel Art.

- Objeto Pixel Art: seleciona pelo **mesmo ID** de `state.items` ou cadastra item novo em `state.items`, sem substituir descrições, dados de receita e propriedades já configuradas.
- Comportamento visual e funcional: `item.worldBehavior` com tipo de objeto, interações, ataque, defesa, HP, durabilidade, colisão, coleta, destruição, reações à chuva, sol, vento, frio e tempestade. Essas são **regras salvas de dados**, não a execução automática do clima no jogo.
- Imagem Pixel Art transparente: PNG cadastrado em `state.assets` e vinculado ao `item.iconId`; inclui recorte simples, remoção de fundo externo e borracha.
- Personagens Pixel Art: o desenho e as animações originais são preservados. Ao clicar em **Gravar personagem no Game Creator**, salva a ficha e o spritesheet no projeto principal.
- Mapas 2.5D: editor original preservado e disponibilizado dentro da aba Pixel Art. **Gravar mapa no Game Creator** acrescenta o projeto em `state.pixelArtMaps`, sem apagar as telas ou a geografia já criada.

## Módulos internos — não são iniciadores

- `pixel-art/modulo-integrado.js`: interface Pixel Art 2D (personagens e objetos) incorporada.
- `pixel-art/objetos.js`: fonte do editor de objetos e clima.
- `map-editor/modulo-integrado.js`: montador 2.5D incorporado.
- `pixel-art/ponte-creator.js`: acesso à base `state`, persistência e atualização de cadastros.
- `pixel-art/index.html` e `map-editor/index.html`: fontes independentes preservadas **para manutenção e comparação**; não precisam aparecer como aplicativos na navegação principal.
- `integracao/`: regras de contrato para outros jogos HTML/Godot 4; não é um segundo Game Creator.

Os dois redirecionadores redundantes `INICIO_RAPIDO.html` e `INICIO_RAPIDO_V39_2.html` foram removidos. **Não apagar fontes históricas, inventários ou backups sem validação da versão unificada**.

## Testes realizados e pendências

**Verificados:** sintaxe dos módulos JavaScript incorporados; presença dos arquivos originais, navegação e contrato de dados analisados por código. **Pendentes:** compilação automática do `index.html` no GitHub Actions, teste visual ponta a ponta no Android, abertura de projetos de versões anteriores, exportação de sprites/objetos, persistência de clima, ligação efetiva ao jogo Godot e regressão completa.

Os efeitos de clima, combate, inventário e produção precisam de adaptadores/runtime nos jogos consumidores; editar uma propriedade no Creator não a executa sozinho em todo jogo.

**Orientação de preservação:** usar o código v4.0 como base e implementar em cima dele. Não reiniciar o projeto, não duplicar funções, não descartar trabalho 3.9 ou 3.9.2.
