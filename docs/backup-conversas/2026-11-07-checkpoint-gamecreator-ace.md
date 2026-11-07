# Checkpoint — GameCreator ACE — 2026-11-07 11:46 BRT

**Projeto:** Apoena GameCreator — proposta Apoena Character Engine (ACE)  
**Escopo:** preservar a conversa e o plano proposto. Nenhuma alteração de código foi realizada.

## Objetivo
O usuário indicou que a próxima etapa é trabalhar no código real do GameCreator, com coordenação de Amigo Apoena, Notion, GitHub, CodeRabbit e 12ui Design.

## Proposta registrada (ainda não aprovada como especificação definitiva)
Desenvolver o **Apoena Character Engine (ACE)** integrado ao GameCreator, sem criar editor isolado.

Arquitetura conceitual:
- Apoena Core compartilhado para projetos, assets, eventos e persistência.
- Fluxos 2D, 2.5D e futuramente 3D.
- GameCreator como aplicação anfitriã, integrando biblioteca, Pixel Art, personagens, animações e exportação para Godot.

Módulos propostos:
1. Character Core — dados e estrutura do personagem.
2. Anatomy System — partes corporais e articulações.
3. Character Composer — montagem modular e manual.
4. Rigging Studio — ossos, pivôs e hierarquia.
5. Mesh System — malhas e deformações.
6. 2.5D Renderer — profundidade e rotação.
7. Animation Engine — poses, keyframes e IK.
8. Asset Manager — biblioteca compartilhada.
9. Export Engine — PNG, spritesheet, JSON e Godot.

## MVP sugerido
Usar Serena como personagem de referência, sujeito à confirmação do proprietário:
- Importação de PNG frontal 1024 × 1536.
- Separação de cabeça, tronco, braços, antebraços, mãos, pelve, coxas, pernas e pés.
- Máscaras reversíveis, preservando a imagem original.
- Ajuste individual de pivôs e esqueleto com hierarquia pai/filho.
- Movimento de braços e pernas, poses e caminhada.
- Salvamento e reabertura.
- Exportação PNG, spritesheet e JSON.

Etapas posteriores: IK, malhas, profundidade 2.5D e 3D.

## Governança proposta
- Amigo Apoena: coordenação e continuidade.
- Alberto: arquitetura, implementação, testes e integração.
- GitHub: código, branches, commits e PRs.
- Notion: decisões, arquitetura e documentação.
- CodeRabbit: revisão independente.
- 12ui Design: interface e experiência visual.

## Estado e limites deste checkpoint
- É um registro de proposta, não de implementação.
- Nenhum arquivo do GameCreator foi alterado.
- Nenhum commit de código, PR ou release do ACE foi criado.
- Antes de implementar, confirmar o nome ACE, validar o escopo e converter a proposta em especificação técnica com critérios de aceite.
- A conversa anterior indicou lease WIP=1 ativa para reconciliação/correção anterior. Reconsultar lock, fila, PRs e Actions antes de qualquer trabalho; não contornar a trava nem trabalhar em paralelo.
- PR #7 foi mencionada como integrada e Issue #17 (GC-ANIM-005) como referência de animação; confirmar estado e conteúdo atuais antes de usar como evidência.
- Este backup não inclui IndexedDB, dados locais, projetos pessoais, arquivos não rastreados, imagens binárias ou estado do navegador.

## Próximas ações seguras
- [ ] Verificar lease WIP=1 e fila canônica.
- [ ] Atualizar estado do GameCreator: branch, SHA, PRs, Issues e Actions.
- [ ] Localizar especificação do Creator Modular, contratos de assets e persistência.
- [ ] Confirmar ACE como nome oficial ou nome de trabalho.
- [ ] Definir primeiro incremento do Rigging Studio 2D e critérios de aceite.
- [ ] Fazer novo checkpoint antes de qualquer alteração de código.

**Próximo ponto de retomada:** revalidar WIP/lease e estado real do GameCreator; então especificar o primeiro incremento do Rigging Studio 2D integrado ao Creator.
