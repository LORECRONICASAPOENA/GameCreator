# GC-UPDATE-009 — CI Windows aprovada após reexecução do job sem logs

- **Data:** 05/11/2026
- **Repositório:** `LORECRONICASAPOENA/GameCreator`
- **PR:** #7 — Atualizador local incremental
- **Branch:** `feat/atualizador-local-incremental`
- **SHA validado:** `43fcf2afdbf669b4c79f0139fa73d27eb8d21fec`
- **Run:** [#41950469672](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41950469672)
- **Tentativa:** 2
- **Job:** `validar` / `127008498341`
- **Resultado:** `success`

## Evidência

A tentativa 1 do mesmo run falhou sem etapas registradas e sem logs recuperáveis (`BlobNotFound`). Não há evidência para atribuir essa falha ao código. A tentativa 2, no mesmo SHA, concluiu o job inteiro.

Etapas aprovadas:
- PowerShell 5.1 e sintaxe JavaScript;
- Creator nativo V4.0, DOM e módulos;
- Corte Inteligente, tilesets e contratos da interface;
- Biblioteca IndexedDB, persistência e teste automatizado de backup/restauração;
- exportação, sincronização V4.0/V4.1 e contrato Godot;
- manifesto do atualizador Windows;
- hidrologia/erosão e runtime Godot 4;
- preservação do Creator original e dos módulos.

## Relação com a falha anterior

O run [#41949644099](https://github.com/LORECRONICASAPOENA/GameCreator/actions/runs/41949644099) em um SHA anterior registrou erro de parser PowerShell por bloco duplicado após o `catch`. O commit `43fcf2af` removeu o trecho duplicado. A tentativa 2 de #419504 passou pela validação do manifesto e pelo job completo.

## Estado e próxima ação

**CI aprovada; PR permanece draft.** Ainda falta o teste manual na máquina do proprietário:
1. executar o atualizador em instalação de teste;
2. confirmar que arquivos locais, módulos e dados são preservados;
3. exportar a Biblioteca IndexedDB antes da atualização;
4. restaurar em perfil de teste e conferir personagens, sprites, mapas e catálogo.

Não mesclar a PR nem liberar WIP=1 antes dessa evidência manual.
