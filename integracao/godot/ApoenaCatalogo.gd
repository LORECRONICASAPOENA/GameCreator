extends Node
class_name ApoenaCatalogo

## Ponte de dados para projetos Godot 4.
## A fonte dos itens/receitas continua sendo o APOENA_PROJETO_EDITAVEL.json no Game Creator.
## Coloque o JSON exportado como res://dados/apoena_catalogo.json.
## Não substitua scripts existentes de combate, loja ou inventário sem testes.

signal inventario_alterado(item_id: String, quantidade_atual: int)
signal receita_iniciada(receita_id: String, segundos: float)
signal receita_concluida(receita_id: String, item_id: String, quantidade: int)
signal item_utilizado(item_id: String, efeito: String)

const SCHEMA: String = "apoena.gamecreator.catalogo.v1"
const SESSAO_SCHEMA: String = "apoena.gamecreator.sessao.v1"

var itens: Dictionary = {}
var receitas: Dictionary = {}
var inventario: Dictionary = {}
var ouro: int = 0
var fila_de_fabricacao: Array[Dictionary] = []
var ultimo_erro: String = ""
var jogo_id: String = ""

func carregar_catalogo(caminho: String = "res://dados/apoena_catalogo.json") -> bool:
    ultimo_erro = ""
    if not FileAccess.file_exists(caminho):
        return _falhar("Arquivo de catálogo não encontrado: " + caminho)
    var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(caminho))
    if not (parsed is Dictionary):
        return _falhar("Catálogo JSON inválido.")
    if parsed.get("schema", "") != SCHEMA:
        return _falhar("Schema de catálogo não reconhecido.")
    var src_items: Variant = parsed.get("items", null)
    var src_recipes: Variant = parsed.get("recipes", null)
    if not (src_items is Array) or not (src_recipes is Array):
        return _falhar("O catálogo precisa conter itens e receitas.")

    var novos_itens: Dictionary = {}
    var novas_receitas: Dictionary = {}
    for item in src_items:
        if not (item is Dictionary):
            return _falhar("Item não é um objeto JSON.")
        var id: String = str(item.get("id", ""))
        if id.is_empty() or novos_itens.has(id):
            return _falhar("ID ausente ou duplicado no catálogo de itens: " + id)
        novos_itens[id] = item
    for receita in src_recipes:
        if not (receita is Dictionary):
            return _falhar("Receita não é um objeto JSON.")
        var id: String = str(receita.get("id", ""))
        if id.is_empty() or novas_receitas.has(id):
            return _falhar("ID ausente ou duplicado no catálogo de receitas: " + id)
        var produto_id: String = str(receita.get("resultId", ""))
        if not novos_itens.has(produto_id):
            return _falhar("Produto não encontrado na receita " + id + ": " + produto_id)
        if not (receita.get("ingredients", null) is Array):
            return _falhar("Ingredientes inválidos na receita: " + id)
        for ingrediente in receita["ingredients"]:
            if not (ingrediente is Dictionary):
                return _falhar("Ingrediente inválido na receita: " + id)
            if not novos_itens.has(str(ingrediente.get("id", ""))):
                return _falhar("Ingrediente não cadastrado na receita: " + id)
            if int(ingrediente.get("qty", 0)) < 1:
                return _falhar("Quantidade inválida na receita: " + id)
        if int(receita.get("quantity", 0)) < 1:
            return _falhar("Quantidade de produto inválida na receita: " + id)
        novas_receitas[id] = receita
    itens = novos_itens
    receitas = novas_receitas
    jogo_id = str(parsed.get("game_id", ""))
    return true

func _falhar(mensagem: String) -> bool:
    ultimo_erro = mensagem
    push_warning(mensagem)
    return false

func obter_item(id: String) -> Dictionary:
    return itens.get(id, {})

func quantidade(id: String) -> int:
    return int(inventario.get(id, 0))

func coletar(id: String, qtd: int = 1) -> bool:
    if not itens.has(id) or qtd < 1:
        return _falhar("Coleta inválida para o item: " + id)
    inventario[id] = quantidade(id) + qtd
    inventario_alterado.emit(id, quantidade(id))
    return true

func remover(id: String, qtd: int = 1) -> bool:
    if qtd < 1 or quantidade(id) < qtd:
        return _falhar("Inventário insuficiente para: " + id)
    inventario[id] = quantidade(id) - qtd
    inventario_alterado.emit(id, quantidade(id))
    return true

func iniciar_receita(id: String) -> bool:
    ultimo_erro = ""
    if not receitas.has(id):
        return _falhar("Receita inexistente: " + id)
    var receita: Dictionary = receitas[id]
    var necessidades: Dictionary = {}
    for ingrediente in receita["ingredients"]:
        var ingrediente_id: String = str(ingrediente.get("id", ""))
        necessidades[ingrediente_id] = int(necessidades.get(ingrediente_id, 0)) + int(ingrediente.get("qty", 0))
    for ingrediente_id in necessidades:
        if quantidade(str(ingrediente_id)) < int(necessidades[ingrediente_id]):
            return _falhar("Falta ingrediente: " + str(ingrediente_id))
    var custo: int = max(0, int(receita.get("gold", 0)))
    if ouro < custo:
        return _falhar("Ouro insuficiente para a receita: " + id)
    # Consome apenas depois de verificar TODOS os ingredientes e o ouro.
    for ingrediente_id in necessidades:
        remover(str(ingrediente_id), int(necessidades[ingrediente_id]))
    ouro -= custo
    var segundos: float = maxf(0.0, float(receita.get("seconds", 0.0)))
    if segundos <= 0.0:
        _concluir_receita(id, receita)
    else:
        fila_de_fabricacao.append({"recipe_id": id, "restante": segundos,
            "result_id": str(receita.get("resultId", "")),
            "quantity": int(receita.get("quantity", 1))})
        receita_iniciada.emit(id, segundos)
    return true

func _process(delta: float) -> void:
    for i in range(fila_de_fabricacao.size() - 1, -1, -1):
        fila_de_fabricacao[i]["restante"] = float(fila_de_fabricacao[i]["restante"]) - delta
        if float(fila_de_fabricacao[i]["restante"]) <= 0.0:
            var job: Dictionary = fila_de_fabricacao[i]
            fila_de_fabricacao.remove_at(i)
            var item_id: String = str(job.get("result_id", ""))
            var qtd: int = int(job.get("quantity", 1))
            if itens.has(item_id) and qtd > 0:
                coletar(item_id, qtd)
                receita_concluida.emit(str(job.get("recipe_id", "")), item_id, qtd)

func _concluir_receita(id: String, receita: Dictionary) -> void:
    var item_id: String = str(receita.get("resultId", ""))
    var qtd: int = int(receita.get("quantity", 1))
    coletar(item_id, qtd)
    receita_concluida.emit(id, item_id, qtd)

## Somente três efeitos instantâneos, explicitamente suportados.
## status = {"hp": 50, "max_hp": 100, "aurium": 20, "max_aurium": 100}
## Todos os outros efeitos exigem scripts próprios; NÃO são consumidos por engano.
func usar_item(id: String, status: Dictionary) -> bool:
    ultimo_erro = ""
    if quantidade(id) < 1 or not itens.has(id):
        return _falhar("Item não disponível: " + id)
    var item: Dictionary = itens[id]
    var efeito: Dictionary = item.get("effect", {})
    var tipo: String = str(efeito.get("type", "nenhum"))
    var valor: float = float(efeito.get("value", 0.0))
    if valor <= 0.0 or float(efeito.get("duration", 0.0)) > 0.0:
        return _falhar("Efeito ainda não implementado: " + tipo)
    var chave: String = ""
    var maximo: String = ""
    var adicionar: float = valor
    match tipo:
        "restaurar_hp_fixo":
            chave = "hp"
            maximo = "max_hp"
        "restaurar_hp_percentual":
            chave = "hp"
            maximo = "max_hp"
            adicionar = float(status.get(maximo, 0)) * valor / 100.0
        "restaurar_aurium_percentual":
            chave = "aurium"
            maximo = "max_aurium"
            adicionar = float(status.get(maximo, 0)) * valor / 100.0
        _:
            return _falhar("Efeito requer implementação no jogo: " + tipo)
    if not status.has(chave) or not status.has(maximo):
        return _falhar("Status do personagem não possui " + chave + " e " + maximo)
    status[chave] = minf(float(status[maximo]), float(status[chave]) + adicionar)
    if bool(item.get("consumable", false)):
        remover(id, 1)
    item_utilizado.emit(id, tipo)
    return true

func salvar_sessao(caminho: String = "user://apoena_catalogo_sessao.json") -> bool:
    var f: FileAccess = FileAccess.open(caminho, FileAccess.WRITE)
    if f == null:
        return _falhar("Não foi possível salvar a sessão no dispositivo.")
    var estado: Dictionary = {"schema": SESSAO_SCHEMA, "game_id": jogo_id,
        "inventario": inventario, "ouro": ouro, "fila": fila_de_fabricacao}
    f.store_string(JSON.stringify(estado, "\t"))
    f.close()
    return true

func carregar_sessao(caminho: String = "user://apoena_catalogo_sessao.json") -> bool:
    if not FileAccess.file_exists(caminho):
        return _falhar("Não existe sessão salva.")
    var data: Variant = JSON.parse_string(FileAccess.get_file_as_string(caminho))
    if not (data is Dictionary) or data.get("schema", "") != SESSAO_SCHEMA:
        return _falhar("Sessão inválida.")
    if str(data.get("game_id", "")) != jogo_id:
        return _falhar("A sessão pertence a outro jogo.")
    if not (data.get("inventario", null) is Dictionary) or not (data.get("fila", null) is Array):
        return _falhar("Estrutura de sessão inválida.")
    var novo_inventario: Dictionary = {}
    for id in data["inventario"]:
        if itens.has(str(id)):
            novo_inventario[id] = maxi(0, int(data["inventario"][id]))
    var nova_fila: Array[Dictionary] = []
    for job in data["fila"]:
        if job is Dictionary and itens.has(str(job.get("result_id", ""))) and int(job.get("quantity", 0)) > 0:
            nova_fila.append(job)
    inventario = novo_inventario
    ouro = maxi(0, int(data.get("ouro", 0)))
    fila_de_fabricacao = nova_fila
    return true
