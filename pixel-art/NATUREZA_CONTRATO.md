# Contrato de natureza — GameCreator e jogo Apoena Agar

**Schema:** `apoena.natureza.asset.v1`.

## Preparar a primeira planta e semente
1. No GameCreator entre em **Pixel Art → Natureza / Plantas** (ou `pixel-art/index.html`).
2. Selecione Bananeira/Jabuticabeira ou árvore genérica, edite nome/ID, necessidades de água, fertilidade, luz, temperatura, idade adulta, idade de fruto, longevidade, decomposição e reprodução.
3. Produza **cada PNG separado**, fundo transparente real, perspectiva 3/4 elevada Apoena, mesma paleta, base alinhada ao centro inferior. Muda pequena, adulta grande, sem cenário ou texto.
4. Importe em cada fase, confira dimensões e transparência. Clique **Baixar PNG** em cada fase para nomear corretamente e **Baixar ficha JSON** para os metadados.
5. No jogo, coloque em `assets/natureza/<id>/<id>_<fase>.png` e ficha `<id>.natureza.json` na mesma pasta.

## Fases (14 PNGs)
`semente`, `semente_molhada`, `germinacao`, `muda`, `jovem`, `adulta`, `floracao`, `frutificando`, `fruto_caido`, `murchando`, `morta`, `tronco_caido`, `decompondo`, `po`.

## Lógica e limites
- Sem chuva suficiente a semente fica dormente e pode perder viabilidade. Só germina com água, luz, nutrientes e espaço.
- Desenvolvimento depende da qualidade do solo; se insuficiente, fruto pode não vingar e a planta pode morrer. Após morte o tronco apodrece e devolve nutrientes ao solo. O estágio pó encerra o objeto de madeira.
- Bananeira gera até três rebentos vegetativos próximos do pé-mãe quando completa ciclo produtivo e encontra espaço; fruto de bananeira não é a fonte principal de sementes no simulador.
- Jabuticabeira dispersa sementes por frutos no solo e animais, inclusive javali (futuramente pássaros). Cocô é evento de deposição de sementes, não necessidade de imagem realista.
- O jogo simula a mecânica; o editor somente cadastra dados e imagens. O jogo atual ainda precisa de adaptador visual para substituir seus desenhos geométricos pelos PNGs.
- Parâmetros são para *balanceamento de jogo*, não prescrição agronômica. Crescimento não é obrigatório se o solo falhar.

**Notas:** não há geração de imagem por IA nesta ferramenta; PNGs são baixados separadamente, a ficha JSON não contém imagens e não há ZIP único. Ao mudar o ID, baixe novamente com o mesmo ID em todos os arquivos.
