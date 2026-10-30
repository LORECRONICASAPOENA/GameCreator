# Instruções para agentes de IA — Game Creator

Antes de investigar ou alterar CI, GitHub Actions, PowerShell, runner, testes ou build:

1. Leia docs/BASE_CONHECIMENTO_ERROS_RUNNER_CI.md.
2. Leia docs/PENDENCIAS_ABERTAS_E_LIMPEZA_GITHUB.md.
3. Respeite o protocolo sequencial: WIP = 1 para Game Creator e Apoena Pixel Art HTML combinados.
4. Diferencie job queued (aguardando runner) de job failed (código/etapa executada e falhou).
5. Não repita workflows, não crie workflows redundantes e não altere labels/shells sem identificar a causa.
6. Nunca enfraqueça testes, remova assertions ou oculte exceções para obter CI verde.
7. Separe causas comprovadas de hipóteses. Atualize a base de conhecimento somente depois de validar a correção.
8. Preserve a liberdade criativa: automações do editor devem ser assistivas, reversíveis e nunca impor escolhas ao criador.