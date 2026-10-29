extends SceneTree

const CatalogoScript = preload("res://ApoenaCatalogo.gd")

func _initialize() -> void:
    call_deferred("_run_tests")

func _expect(condition: bool, message: String) -> bool:
    if condition:
        return true
    push_error("GODOT CATALOG TEST FAILED: " + message)
    quit(1)
    return false

func _run_tests() -> void:
    var catalogo = CatalogoScript.new()
    root.add_child(catalogo)
    if not _expect(catalogo.carregar_catalogo(), "fixture do catálogo deve carregar: " + catalogo.ultimo_erro):
        return
    if not _expect(catalogo.obter_item("madeira") is Dictionary, "item madeira deve existir"):
        return
    catalogo.ouro = 2
    if not _expect(catalogo.coletar("madeira", 3), "coleta de madeira deve funcionar"):
        return
    if not _expect(catalogo.iniciar_receita("fazer-tabua"), "receita imediata deve iniciar"):
        return
    if not _expect(catalogo.quantidade("madeira") == 1 and catalogo.quantidade("tabua") == 2, "crafting imediato deve consumir ingredientes e produzir tábuas"):
        return
    if not _expect(catalogo.ouro == 1, "ouro da receita deve ser debitado"):
        return
    if not _expect(catalogo.iniciar_receita("fazer-tijolo"), "receita temporizada deve iniciar"):
        return
    if not _expect(catalogo.quantidade("madeira") == 0 and catalogo.fila_de_fabricacao.size() == 1, "receita temporizada deve entrar na fila"):
        return
    catalogo._process(2.1)
    if not _expect(catalogo.quantidade("tijolo") == 1 and catalogo.fila_de_fabricacao.is_empty(), "receita deve concluir após o tempo"):
        return
    if not _expect(catalogo.coletar("pocao", 1), "poção deve poder ser coletada"):
        return
    var status = {"hp": 40, "max_hp": 100, "aurium": 20, "max_aurium": 100}
    if not _expect(catalogo.usar_item("pocao", status), "efeito de cura suportado deve executar"):
        return
    if not _expect(status["hp"] == 55 and catalogo.quantidade("pocao") == 0, "poção consumível deve curar e sair do inventário"):
        return
    var session_path = "user://apoena_catalogo_test_session.json"
    if not _expect(catalogo.salvar_sessao(session_path), "sessão deve ser salva"):
        return
    var restaurado = CatalogoScript.new()
    root.add_child(restaurado)
    if not _expect(restaurado.carregar_catalogo(), "segundo catálogo deve carregar"):
        return
    if not _expect(restaurado.carregar_sessao(session_path), "sessão deve ser restaurada"):
        return
    if not _expect(restaurado.quantidade("tabua") == 2 and restaurado.quantidade("tijolo") == 1 and restaurado.ouro == 1, "inventário e ouro devem persistir"):
        return
    var invalid_path = "user://apoena_catalogo_invalido.json"
    var invalid_file = FileAccess.open(invalid_path, FileAccess.WRITE)
    if not _expect(invalid_file != null, "arquivo inválido de teste deve ser criado"):
        return
    invalid_file.store_string(JSON.stringify({"schema": "wrong", "items": [], "recipes": []}))
    invalid_file.close()
    if not _expect(not restaurado.carregar_catalogo(invalid_path), "schema incorreto deve ser rejeitado"):
        return
    if not _expect(restaurado.obter_item("madeira") is Dictionary, "falha de importação não pode apagar catálogo válido"):
        return
    var bad_session = FileAccess.open("user://apoena_catalogo_sessao_outro_jogo.json", FileAccess.WRITE)
    if not _expect(bad_session != null, "arquivo de sessão cruzada deve ser criado"):
        return
    bad_session.store_string(JSON.stringify({"schema": "apoena.gamecreator.sessao.v1", "game_id": "outro-jogo", "inventario": {}, "ouro": 0, "fila": []}))
    bad_session.close()
    if not _expect(not restaurado.carregar_sessao("user://apoena_catalogo_sessao_outro_jogo.json"), "sessão de outro jogo deve ser rejeitada"):
        return
    print("GODOT CATALOG TEST OK: carga, crafting, efeitos, persistência e rejeição de dados inválidos")
    quit(0)
