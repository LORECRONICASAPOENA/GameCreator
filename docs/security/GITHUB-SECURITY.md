# Segurança do GitHub e cadeia de distribuição

## Estado histórico informado

A conversa de origem relatou GitHub Actions habilitado, distribuição por ZIP, ausência de aprovação independente obrigatória e desconhecimento sobre proteção da branch main. Verificar todas essas configurações no estado atual.

## Controles a verificar/configurar

- MFA/passkeys nas contas com acesso de escrita.
- Branch protection ou Rulesets para main.
- Pull Requests e revisão independente para alterações sensíveis.
- Permissões explícitas e mínimas em GITHUB_TOKEN.
- Actions de terceiros fixadas por SHA completo.
- Secrets fora do código, com escopo mínimo e rotação.
- Separar jobs de build e publicação.
- Tratar PRs de fork como entrada não confiável.
- Restringir publicação por environment/aprovação quando aplicável.
- Vincular artefato à tag, commit e workflow.
- Publicar manifesto SHA-256; avaliar assinatura digital com chave privada protegida.
- Revisar dependências e permissões dos workflows.

## Regra de evidência

Para cada controle, registrar configuração observada, URL/caminho, data, responsável, evidência e estado: configurado, ausente, desconhecido ou não verificável. Não inferir proteção de branch a partir de acesso administrativo nem inferir autenticidade apenas de hash.

## Distribuição

Fluxo histórico descrito: GitHub → GitHub Actions → ZIP → instalações Windows da equipe. Confirmar workflow e configuração atuais antes de alterar. Não publicar release até validar artefato, origem, integridade e testes exigidos.
