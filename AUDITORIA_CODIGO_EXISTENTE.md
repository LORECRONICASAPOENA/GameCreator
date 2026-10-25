# Auditoria do código existente — v3.9.2 (25/10/2026)

Esta análise foi feita sobre o HTML completo e o ZIP offline v3.9.2, **não** apenas sobre ideias de conversas.

## Recursos já presentes (não duplicar)
- Editor de Layout (camadas, componentes, propriedades, prévia e modo foco)
- Fábrica de Itens (múltiplas funções, efeitos e origens) e catálogo/inventário/loja
- Receitas, banco compartilhado de itens e biblioteca de imagens
- Slicer Inteligente (detecção automática, grade ajustável, seleção livre e exportação)
- Fichas de personagens, animações 3D, controles PC/Android
- Ações e eventos, simulador, missões, diálogos, NPCs, drops e outros cadastros RPG
- Central de projetos nomeados, limpeza seletiva, checkpoints, JSON e validação
- Exportação de recursos e layouts para Godot, com cena de prévia e scripts de referência
- 52 PNGs oficiais presentes no pacote

## Lacunas demonstradas
1. O executor Godot incluído **simula** alterações em uma cópia de estado, não integra todos os comportamentos ao jogo real.
2. A exportação exige copiar arquivos para um projeto Godot já existente; não gera um jogo autônomo.
3. A Fábrica de Itens e o editor de itens tradicional possuem sobreposição de interfaces; consolidar dados e experiência antes de adicionar campos.
4. Existem diversos caminhos de salvamento. Precisam de testes de regressão e recuperação no Android e Windows.
5. O programa está concentrado em um HTML de ~16,3 MB com 15 scripts embutidos. Atualizações devem ser controladas.
6. O importador de projetos contém limites de 200 imagens e 30 telas.
7. As 500 sugestões são **propostas**, não funcionalidades concluídas.
8. O HTML completo, o Android físico e a execução Godot ainda carecem de testes ponta a ponta.

## Evidências
ZIP auditado: 135 entradas, 52 PNGs, sem `project.godot`; integridade ZIP verificada. Os 15 scripts passam em `node --check`. Uma tentativa de abrir o HTML completo no Chromium deste ambiente foi bloqueada, portanto não se afirma teste visual completo.

## Próxima ordem de trabalho
1. Versionar a fonte real e proteger backups.
2. Mapear e estabilizar os módulos existentes.
3. Consolidar as interfaces duplicadas sem quebrar projetos JSON.
4. Fazer um único fluxo completo: item -> coleta -> inventário -> uso -> estado salvo -> execução Godot.
5. Só depois adicionar o que realmente estiver ausente.

**Regra:** localizar implementação existente -> verificar -> corrigir/ampliar -> testar -> verificar projetos antigos -> publicar. Nada de recriar sistemas já presentes.

**Estado do repositório nesta data:** a versão completa ainda não havia sido importada; este documento não significa que o aplicativo foi publicado ou atualizado.