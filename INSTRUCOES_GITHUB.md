# Publicação do Game Creator no GitHub

**Destino:** https://github.com/apoenalore/GameCreator

### Caminho mais fácil (Windows)

1. Extraia totalmente o ZIP de migração.
2. Na pasta extraída, dê dois cliques em `PUBLICAR_NO_GITHUB.cmd`.
3. Se o Git solicitar, faça login na conta `apoenalore` na janela do navegador.
4. Veja o resultado na janela. O programa cria uma pasta nova `GameCreator_GitHub` ao lado da pasta extraída e faz o primeiro envio.
5. Confirme os arquivos no endereço do repositório GitHub.

**Importante:** a publicação não acontece automaticamente só por baixar/extrair o ZIP. O arquivo `PUBLICAR_NO_GITHUB.cmd` precisa ser executado uma vez em um PC com Git e conexão à internet.

### Depois da primeira publicação

Para sincronizar novos arquivos, execute o script novamente. Ele atualizará o clone local com os conteúdos da pasta extraída e tentará enviar só as diferenças. Não apaga nenhum arquivo de outros repositórios.

### Cuidados

- Este repositório é PÚBLICO.
- Não compartilhe senhas, tokens de autenticação ou conteúdo não licenciado.
- O Git pode pedir login no primeiro push.
- Evite mover a pasta durante o envio.
- O backup da versão 3.8 está preservado.
