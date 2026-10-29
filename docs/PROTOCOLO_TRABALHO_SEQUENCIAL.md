# Protocolo de trabalho sequencial — Projeto Apoena

**Regra obrigatória:** manter somente **uma tarefa ativa por vez em todo o projeto**, abrangendo Game Creator e Pixel Art. Não iniciar uma segunda tarefa de implementação enquanto a atual não estiver concluída em 100%.

## 1. Ciclo obrigatório de uma tarefa

1. **Definir:** registrar ID, objetivo, escopo, arquivos/módulos envolvidos e critérios objetivos de aceitação.
2. **Executar:** trabalhar apenas no escopo aprovado. Novas ideias entram no backlog; não viram trabalho paralelo.
3. **Testar:** executar os testes pertinentes à tarefa e corrigir as falhas encontradas antes de avançar.
4. **Validar:** executar a validação canônica do repositório no runner correto. Uma execução isolada local não substitui a CI real.
5. **Conferir entrega:** revisar diff, integridade dos arquivos, artefatos e documentação; confirmar que o resultado foi salvo no GitHub.
6. **Encerrar:** registrar commit, links dos testes, resultado, limitações e estado final no registro de pendências. Só então marcar a tarefa como concluída e selecionar a próxima.

## 2. Definição de “100% concluída”

Uma tarefa de código só pode ser encerrada quando:
- todos os critérios de aceitação definidos no início forem atendidos;
- os testes relevantes e a validação canônica exigida passarem;
- o build/artefato esperado for produzido e conferido, quando aplicável;
- as alterações estiverem registradas no GitHub e a documentação pertinente estiver atualizada;
- não houver falha, teste obrigatório, validação de dispositivo ou decisão necessária ainda pendente para o escopo dessa tarefa.

Se depender de teste humano ou de dispositivo, o estado será **AGUARDANDO VALIDAÇÃO**, não **CONCLUÍDA**. Se houver bloqueio de runner, permissões ou fila, será **BLOQUEADA**. Em ambos os casos, não se inicia outra tarefa de implementação.

## 3. Regras para o GitHub Actions

- Escolher uma validação canônica por tarefa e repositório; workflows manuais de diagnóstico só serão usados quando necessários para investigar a mesma tarefa.
- Não disparar várias validações equivalentes, não criar workflows temporários redundantes e não repetir a suíte inteira quando for suficiente reexecutar o job que falhou.
- Antes de uma nova execução, conferir se já existe uma execução equivalente ativa ou na fila.
- Distinguir erro de código/teste, erro de configuração do workflow, falta de runner e aviso de descontinuação. Não tratar todos como o mesmo problema.
- Não declarar sucesso enquanto a execução relevante estiver em fila, em andamento ou com falha.
- Falhas descobertas durante a tarefa permanecem dentro da tarefa ativa até serem corrigidas ou formalmente identificadas como bloqueio impeditivo; não abrir uma tarefa paralela para contorná-las.

## 4. Trabalho que abrange os dois repositórios

Quando uma funcionalidade exigir mudanças no Game Creator e no Pixel Art, os dois lados formam **uma única tarefa integrada**, com critérios de aceitação para cada repositório. Não iniciar outra funcionalidade entre a implementação e a validação dos dois lados.

## 5. Estados permitidos

- **BACKLOG:** ainda não iniciada.
- **EM EXECUÇÃO:** única tarefa ativa.
- **EM VALIDAÇÃO:** implementação feita; testes/CI ainda não terminaram.
- **BLOQUEADA:** depende de runner, permissão, ação humana ou outra condição externa. Continua sendo a tarefa ativa.
- **AGUARDANDO VALIDAÇÃO:** falta confirmação humana ou em dispositivo real. Continua sendo a tarefa ativa.
- **CONCLUÍDA:** todos os critérios de aceitação foram comprovados e o resultado foi registrado.

## 6. Registro de trabalho

Manter um único registro principal de pendências em `apoenalore/GameCreator/docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md`. Nele, identificar a tarefa ativa, os itens do backlog, os bloqueios, os links de CI e a evidência de encerramento. O protocolo deste arquivo aplica-se também ao repositório `apoenalore/Apoena-pixel-art-html`.

**Não começar a próxima tarefa por conveniência, por haver uma ideia nova ou porque a tarefa atual ficou bloqueada. Primeiro encerrar a tarefa ativa; se estiver bloqueada, resolver ou pedir a dependência necessária.**
