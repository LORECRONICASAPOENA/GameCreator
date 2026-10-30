# Teste da hidrologia e erosão — 29/10/2026

**Estado:** protótipo funcional em branch de teste. Não declarado pronto para produção, Android físico nem Godot.

## Abrir
1. Abra a branch `feature/hidrologia-erosao-niveis-20261029` no repositório e faça **Code > Download ZIP**.
2. Extraia o ZIP inteiro: scripts referenciados por HTML devem ficar nas mesmas pastas.
3. Abra `map-editor/hidrologia_teste.html`. Para testar no editor integrado, abra `index.html`, entre em Pixel Art > Editor de Mapas e veja o painel **Hidrologia e erosão (teste)**.

## Testes manuais
1. Use **Criar bacia**, escolha **nível 4**, toque no mapa formando o lago.
2. Acione **Chover 20 ciclos** e depois **Tempestade 50 ciclos**. A água deve aumentar e procurar regiões de menor altura.
3. Ajuste **solo rochoso** para reduzir o desgaste e **solo permeável** para favorecer a infiltração.
4. Use **Sol / Secagem 50 ciclos**. A água superficial deve diminuir.
5. Teste os seis níveis de bacia. Eles indicam profundidade potencial, não classificação obrigatória do corpo d'água.
6. Salve o JSON da simulação, importe novamente e confira se a água/altitude foram preservadas.
7. Importe um mapa JSON do Game Creator no laboratório, simule, e exporte um novo mapa com a camada `hydrology`.

## Teste dentro do Creator
No editor integrado, clique em **Selecionar pincel de bacia**, escolha nível/raio e toque no mapa. Use os botões de chuva/sol para atualizar a prévia. Exporte o mapa para teste e importe no laboratório separado. Os tiles do mapa e as imagens originais devem ser preservados.


## Limitações conhecidas
- A hidrologia usa aproximação em grade 2D; não reproduz dinâmica real de fluidos nem bacias de centenas de quilômetros ainda.
- A visualização por Canvas é provisória; não exige sprites finais.
- A erosão usa altura hidrológica independente da camada visual antiga `heights` do Game Creator.
- Correnteza, vegetação estressada e sedimentação são modelos iniciais, ainda sujeitos a balanceamento.
- O modo MOBA competitivo e o runtime Godot não consomem automaticamente a simulação.
- A criação de uma nova branch não altera a `main`; os testes de navegador/Android e a integração com outros sistemas precisam de validação separada.

## Verificação automatizada
- `node tests/hidrologia.test.cjs` (self-hosted Windows Runner).
- Verificações cobrem seis profundidades, chuvas, secagem, proteção contra erosão, serialização e reimportação.


## Estado da validação automatizada — 30/10/2026

O workflow foi ajustado para validar pull requests, verificar sintaxe com PowerShell em modo `ExecutionPolicy Bypass` e executar `tests/hidrologia.test.cjs`. **A validação ainda não passou:** a execução mais recente [#40995719532](https://github.com/apoenalore/GameCreator/actions/runs/40995719532) está em `queued`, sem runner atribuído. O runner Pixel Art não atende automaticamente este repositório, pois seu registro é restrito ao repositório Pixel Art.

Não marcar este motor como concluído até o runner GameCreator executar a suíte e os testes de integração do Creator confirmarem a importação/exportação.
