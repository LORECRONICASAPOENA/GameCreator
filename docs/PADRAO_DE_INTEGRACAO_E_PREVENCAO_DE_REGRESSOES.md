# Padrão de integração e prevenção de regressões

**Projeto:** Apoena Game Creator  
**Aplicação:** qualquer pessoa ou IA que leia, crie, altere, integre ou corrija código neste repositório.  
**Objetivo:** impedir que uma alteração isolada que parece funcionar quebre, duplique ou contradiga funcionalidades já existentes.

## 1. Regra principal

**Não criar código antes de entender onde ele se encaixa.**

Uma implementação só está pronta quando:
1. resolve o problema solicitado;
2. respeita a arquitetura e a fonte de verdade existentes;
3. mantém compatibilidade com os módulos que já dependem dela;
4. tem testes que comprovam o comportamento novo e protegem o comportamento antigo;
5. foi validada no workflow correto, no commit exato que contém a alteração.

Código que funciona sozinho, mas quebra a integração, não é uma solução concluída.

## 2. Entenda os tipos de problema

- **Conflito de implementação:** duas partes tentam controlar a mesma responsabilidade de maneiras incompatíveis.
- **Duplicidade:** uma função, variável, regra, módulo ou fonte de dados é criada novamente sem necessidade.
- **Quebra de contrato:** um campo, ID, formato JSON, evento, parâmetro, retorno ou comportamento muda e os consumidores antigos não são atualizados.
- **Erro de escopo:** uma variável é usada fora do bloco em que foi declarada, ou é declarada duas vezes no mesmo escopo.
- **Regressão:** uma alteração nova faz uma função que já funcionava deixar de funcionar.
- **Integração incompleta:** o módulo novo funciona isoladamente, mas não conversa corretamente com a tela, o armazenamento, a ponte, o catálogo ou o runtime que deveria utilizar seus dados.

Não trate todos esses casos como simples “erro de sintaxe”. Eles exigem investigação de dependências e contratos.

## 3. Antes de escrever ou alterar código

Faça esta leitura, nesta ordem:

1. Leia `AGENTS.md`, este documento e o README do módulo afetado.
2. Identifique a entrada do sistema, o módulo responsável e a fonte de verdade dos dados.
3. Leia a implementação atual da função e as funções vizinhas; não trabalhe apenas pelo nome ou pela mensagem de erro.
4. Procure todos os lugares que chamam, importam, sobrescrevem ou consomem o trecho que será alterado.
5. Confira os formatos de dados, IDs, schemas, eventos, parâmetros, retornos, valores padrão e tratamento de nulos.
6. Verifique se já existe uma função que resolve parte ou todo o problema. Prefira estender ou corrigir a implementação existente a criar uma segunda versão.
7. Identifique quais testes já cobrem o comportamento e qual teste novo será necessário.
8. Defina o menor conjunto de arquivos que precisa mudar. Não aproveite a tarefa para refatorar áreas sem relação direta.

Se não for possível identificar a fonte de verdade ou os consumidores, pare e investigue antes de implementar.

## 4. Regras para evitar código que se anula ou não se encaixa

### 4.1 Uma responsabilidade, uma implementação

- Não crie um segundo sistema de catálogo, biblioteca, armazenamento, ponte ou simulação sem justificar tecnicamente a separação.
- Não copie uma função existente para outro arquivo apenas para contornar um problema.
- Não mantenha duas implementações concorrentes da mesma regra.
- Antes de adicionar uma função, procure nomes equivalentes e confira se ela já existe com outra assinatura.
- Se uma responsabilidade realmente precisar ser dividida, documente quem é o responsável por cada parte e como elas se comunicam.

### 4.2 Preserve contratos e compatibilidade

- Não renomeie ou remova campos, IDs, eventos, funções públicas ou schemas sem localizar e atualizar todos os consumidores.
- Preserve dados antigos e formatos já publicados sempre que possível.
- Se uma mudança incompatível for inevitável, crie migração ou adaptador, mantenha compatibilidade pelo período necessário e teste os dois caminhos.
- Não altere silenciosamente o significado de um campo existente.
- Valide dados ausentes, nulos, tipos incorretos, valores fora da faixa e entradas antigas.

### 4.3 Respeite escopo e ciclo de vida

- Toda variável deve ser declarada no escopo em que é usada e inicializada antes do primeiro acesso.
- Em loops por célula, item ou entidade, confirme que o perfil/dado consultado corresponde ao elemento atual.
- Não dependa de uma variável global ou de uma iteração anterior por acidente.
- Evite declarações duplicadas de `const`/`let` no mesmo bloco.
- Confira o ciclo de vida de estado, eventos, timers, listeners, armazenamento e objetos: criação, atualização e descarte.
- Não use fallback que esconda dado inválido sem registrar ou tratar a condição de forma explícita.

### 4.4 Faça alterações pequenas e rastreáveis

- Leia o arquivo completo o suficiente para entender o contexto antes de substituir trechos.
- Prefira mudanças localizadas a reescrever arquivos inteiros.
- Não remova código, telas, botões, dados ou comportamentos que não fazem parte da solicitação.
- Não deixe funções antigas, chamadas duplicadas, imports sem uso ou caminhos mortos.
- Não altere simultaneamente o mesmo arquivo em tarefas/agentes diferentes. Atualize a versão mais recente antes de gravar.

## 5. Integração entre módulos

Ao conectar dois módulos, registre explicitamente:

| Contrato | O que conferir |
|---|---|
| Entrada | Quem chama, quais parâmetros envia e quais versões são aceitas |
| Saída | Formato, campos obrigatórios, tipos e erros possíveis |
| Dados | Schema, IDs, valores padrão, nulos e compatibilidade com dados antigos |
| Estado | Quem cria, altera, salva e restaura cada informação |
| Eventos | Nome, payload, ordem, origem e tratamento de falhas |
| Persistência | Onde os dados são salvos e como são recuperados |
| Responsabilidade | Qual módulo é dono da regra e qual apenas consome/adapta |

A integração precisa ter um teste que atravesse a fronteira entre os módulos. Testar cada parte isoladamente não prova que a comunicação entre elas funciona.

## 6. Testes obrigatórios

Escolha testes proporcionais ao risco e execute-os antes de considerar a tarefa pronta:

1. **Sintaxe e carregamento:** verifique se os arquivos alterados podem ser interpretados.
2. **Teste unitário:** valide a regra nova e seus limites.
3. **Teste de regressão:** reproduza o erro que motivou a alteração e confirme que ele não retorna.
4. **Teste de integração:** valide a comunicação com os módulos consumidores e os contratos de dados.
5. **Teste de fluxo completo/smoke:** quando a mudança afetar interface, build, exportação, salvamento ou runtime, percorra o fluxo correspondente.
6. **Suite do projeto:** execute os testes relacionados e o workflow oficial aplicável.

Um teste novo deve falhar antes da correção quando possível e passar depois dela. Não remova, enfraqueça ou pule um teste apenas para deixar o CI verde.

## 7. Regras para GitHub Actions e Runner

- Confira o nome do workflow e os caminhos que disparam sua execução. Uma alteração pode ficar fora dos filtros de CI.
- Confirme que o workflow executado realmente testa os arquivos alterados.
- Considere aprovado somente o resultado **success** do commit exato que contém a última alteração.
- Execuções `cancelled`, `queued`, `pending` ou ainda `in_progress` não são aprovação.
- Uma execução verde de outro commit, de outra branch ou de outro workflow não comprova a correção.
- Se o workflow for cancelado por uma execução mais recente, acompanhe a execução mais recente; não trate cancelamento automático como erro de código.
- Não dispare execuções repetidas sem necessidade. Agrupe alterações relacionadas e valide o commit consolidado.

## 8. Como registrar cada erro aprendido

Para cada falha relevante, registre em um relatório de erros do projeto:

- identificador e título do erro;
- data e hora, com fuso horário;
- repositório, branch, commit e workflow/run;
- arquivo, função e linha aproximada;
- mensagem de erro e trecho mínimo do log;
- causa raiz confirmada (não apenas uma hipótese);
- correção aplicada e arquivos alterados;
- testes executados e resultado no commit corrigido;
- prevenção para que outra IA não repita o problema.

Não registre “resolvido” enquanto a validação do commit corrigido não terminar com sucesso. Se a causa ainda for hipótese, marque-a como hipótese.

## 9. Relatório obrigatório ao concluir uma alteração

A IA ou pessoa responsável deve informar:

1. o que estava errado e a causa raiz;
2. quais arquivos foram alterados e por quê;
3. quais implementações existentes foram reutilizadas;
4. quais contratos/consumidores foram verificados;
5. quais testes foram executados e seus resultados;
6. o SHA do commit e o link do workflow;
7. o que ainda não foi validado.

Não diga “tudo verde” se algum teste relevante não foi executado ou se o workflow ainda está em andamento.

## 10. Exemplo real: perfil hidrológico não definido

Em 30/10/2026, a validação do catálogo encontrou:

```text
ReferenceError: profile is not defined
map-editor/terrain-system.js
stepHydrology()
```

**Causa:** o cálculo de escoamento consultava `profile.runoff`, mas o perfil da célula não estava declarado naquele loop. A função precisava obter o perfil correspondente ao índice `i` antes de usar suas propriedades.

**Prevenção:** ao percorrer cada célula, obter o perfil daquela célula dentro do escopo do loop, antes do cálculo que o utiliza; manter uma única declaração; testar uma simulação com escoamento ativo; e executar a suíte de integração hidrológica no workflow do PR.

**Lição:** uma variável existir em outra função ou em outro loop não significa que esteja disponível neste escopo. O teste precisa executar o caminho real que acessa a variável, não apenas validar a sintaxe do arquivo.

## 11. Checklist final antes de enviar um commit

- [ ] Li as instruções do projeto e os documentos do módulo.
- [ ] Localizei a implementação existente e a fonte de verdade.
- [ ] Procurei todos os consumidores e dependências do trecho alterado.
- [ ] Evitei duplicidade de funções, regras, variáveis e fontes de dados.
- [ ] Preservei schemas, IDs, contratos e compatibilidade.
- [ ] Verifiquei escopo, inicialização e ciclo de vida das variáveis/estados.
- [ ] Acrescentei ou atualizei testes de regressão e integração.
- [ ] Executei os testes relevantes; não apenas os testes isolados mais fáceis.
- [ ] Confirmei que o workflow cobre os arquivos alterados.
- [ ] Registrei causa, solução e evidências.
- [ ] Só declarei concluído após sucesso no commit exato.

**Princípio de encerramento:** primeiro compreender, depois integrar, então implementar e finalmente validar. A velocidade vem de evitar retrabalho — não de escrever mais código rapidamente.

## 12. Diário técnico e relatório de progresso obrigatório

Além deste padrão, é obrigatório manter `docs/DIARIO_TECNICO_E_HISTORICO_DE_ERROS.md` atualizado. Toda IA ou pessoa que executar uma tarefa significativa deve registrar o progresso antes de encerrar ou transferir o trabalho, mesmo quando a tarefa ficar incompleta ou bloqueada.

Para cada tarefa, registre objetivo, data/hora com fuso, branch, commits, arquivos analisados/alterados, trabalho realizado, decisões e justificativas técnicas, testes, evidências, limitações e próximo passo. Para cada erro, registre ID, primeira ocorrência, sintomas, reprodução, log, arquivo/função/linha, hipóteses testadas, caminho de identificação, causa raiz (ou status não confirmado), solução, motivo técnico, testes de regressão/integração e validação no SHA exato.

O registro deve conter raciocínio técnico reproduzível — evidências, hipóteses, verificações e decisões — e não pensamentos privados internos de uma IA. Diferencie fatos de hipóteses. Nunca marque como resolvido sem evidência. Se não puder atualizar o GitHub, declare o bloqueio e entregue o relatório pronto, sem afirmar que foi publicado.

O diário é a memória técnica compartilhada do projeto: desenvolvedores e futuras IAs devem conseguir entender o histórico, reproduzir o diagnóstico e continuar o trabalho sem repetir a investigação do zero.
