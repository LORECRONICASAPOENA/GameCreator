# Backup pré-correção — GameCreator PR #14

**Data:** 2026-11-04
**Repositório:** `LORECRONICASAPOENA/GameCreator`
**PR:** #14 — Integrar Criador Modular de Personagens à aba Pixel Art
**Branch de origem:** `feat/apoena-modular-character-creator-integration`
**SHA preservado:** `4f90fc8739b4af351c929a97d8ed73c094477c36`
**Branch de backup:** `backup/pr14-before-preset-race-fix-20261104`

Esta branch preserva integralmente o estado do repositório no SHA indicado antes de corrigir a condição de corrida identificada em `pixel-art/estudio.js`.

## Achados da revisão anterior da PR #13 reavaliados na PR #14

- O limite acumulado de dados de camadas foi corrigido na PR #14: `addSource` cria um candidato e passa por `C.validate(candidate)` antes de confirmar a nova camada.
- A seleção de navegador do workflow foi ampliada para incluir caminhos de Edge/Chrome em `ProgramFiles(x86)`, corrigindo o finding de incompatibilidade entre smoke test e teste funcional.
- O README da PR #14 foi atualizado para refletir a biblioteca IndexedDB e a exportação Godot já existentes.
- A condição de corrida no carregamento de presets Apoena permanece: o `onload` de uma solicitação antiga ainda pode sobrescrever uma escolha mais recente, pois não há token de solicitação.
- PR #13 e PR #14 são divergentes (`61` commits à frente e `47` atrás na comparação consultada); não fechar ou mesclar automaticamente.

## Plano de correção

Adicionar token monotônico de solicitação ao carregamento dos presets; somente a solicitação mais recente pode alterar `image`, `frames`, malha e status. O erro de carregamento de uma solicitação antiga também não deve sobrescrever o status da mais recente.

## Limites

Este checkpoint preserva o código anterior à correção. Nenhum merge foi feito.