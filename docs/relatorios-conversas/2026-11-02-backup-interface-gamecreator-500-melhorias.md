# Auditoria de interface — Apoena GameCreator

**Data:** 2 de novembro de 2026  
**Repositório analisado:** [apoenalore/GameCreator](https://github.com/apoenalore/GameCreator)  
**Escopo:** interface, organização de fluxos, desempenho percebido e manutenção que afeta a interface.  

## Como ler esta auditoria

A lista contém **500 propostas de melhoria**, não 500 defeitos comprovados. Os achados abaixo são fatos observados no repositório, na página inicial enviada e nos metadados da PR #13; as sugestões numeradas são caminhos para avaliar e priorizar com evidência. Não alterei o repositório nem executei testes.

## Achados observados

- A captura enviada mostra a tela inicial local do GameCreator v4.0: duas faixas de navegação, acesso a ferramentas avançadas, cinco cartões de criação, área explicativa e uma barra inferior de janelas.
- O README atual descreve a V4.1 como em desenvolvimento. A entrada principal é montada a partir de 24 partes em `bundle-v4/`; o `index.html` listado na branch `main` tem aproximadamente 16,3 MB.
- Há módulos especializados separados para Pixel Art, mapa e biblioteca, além de ponte entre ferramentas e armazenamento local IndexedDB.
- O `pixel-art/index.html` tem um formulário de personagem com predefinições, seletores de corpo/roupa/cores, prévia, spritesheet e exportações; o módulo integrado possui uma interface própria.
- A auditoria de código já versionada aponta sobreposição entre Fábrica de Itens e editor tradicional de itens e registra que parte dos comportamentos do jogo ainda depende de integração Godot.
- A PR #13, `GC-CHAR-001`, está aberta como rascunho e é marcada mergeable. Ela substitui o gerador procedural na aba de personagens por um módulo modular dentro de iframe. A própria PR declara que faltam validação no Creator compilado, sincronização com a biblioteca central e validação de importação no runtime Godot.
- A PR #13 está baseada na branch `feat/apoena-personagem-estudio-main`, não diretamente na `main`. Isso deve ser conferido antes de definir integração e dependências.

## Prioridades iniciais sugeridas

1. **P0 — Alinhar a base:** confirmar qual versão local (v4.0) corresponde à branch atual do GitHub (README V4.1) antes de alterar a tela inicial.
2. **P0 — Validar o GC-CHAR-001:** abrir no Creator compilado, verificar alturas e rolagem do iframe, importação de PNGs, persistência local e retorno ao shell.
3. **P1 — Clarificar navegação:** reduzir duplicidade entre barras e tornar evidente o caminho para Personagens sem retirar a página inicial existente.
4. **P1 — Unificar padrões visuais:** compartilhar tokens e componentes entre tela inicial, Pixel Art, mapas e biblioteca.
5. **P1 — Resolver sobreposição de itens:** mapear os dois fluxos atuais e consolidar sem duplicar cadastros ou quebrar projetos antigos.
6. **P2 — Medir antes de modularizar:** mapear o bundle de 16,3 MB às fontes e medir carregamento por módulo antes de escolher uma estratégia de divisão.
7. **P2 — Tornar o estado explícito:** distinguir salvamento no IndexedDB, sessão do Creator, JSON editável e pacote Godot na interface.

## 500 melhorias propostas

### 1. Navegação global e arquitetura da informação

1. Reduzir a navegação principal a poucos módulos estáveis e mover ações secundárias para menus contextuais.
2. Separar claramente navegação de módulos de ações do projeto, como salvar, abrir e exportar.
3. Usar a mesma ordem dos módulos em todas as telas e janelas.
4. Destacar o módulo atual por cor, ícone e título, sem depender apenas de cor.
5. Adicionar breadcrumb para indicar Projeto > Pixel Art > Personagens.
6. Reunir links externos de ferramenta em uma única área de navegação coerente.
7. Remover caminhos que levam à mesma função com nomes diferentes.
8. Revisar o seletor Ir para ferramenta para agrupar opções por tarefa.
9. Adicionar busca de comandos para abrir módulos pelo nome.
10. Exibir atalhos de teclado ao lado das ações mais usadas.
11. Manter a barra superior fixa sem reduzir o espaço útil da tela.
12. Permitir recolher a navegação global em telas menores.
13. Usar nomes curtos e consistentes para módulos e submódulos.
14. Evitar misturar categorias de autoria com categorias de execução do jogo.
15. Mostrar o nome do projeto ativo junto do título do módulo.
16. Indicar visualmente quando uma ferramenta abre em janela separada.
17. Manter o caminho de retorno ao painel inicial sempre no mesmo lugar.
18. Unificar o comportamento de voltar entre Pixel Art, mapas e biblioteca.
19. Adicionar menu de ações recentes para retomar tarefas.
20. Ordenar ferramentas por fluxo de trabalho, não por ordem de criação histórica.
21. Separar módulos ativos de ferramentas experimentais.
22. Marcar protótipos com estado experimental visível e não os apresentar como finalizados.
23. Mostrar dependências entre ferramentas sem duplicar a navegação.
24. Adicionar um mapa da estrutura do Creator acessível pelo menu Ajuda.
25. Registrar preferências de navegação por usuário e restaurá-las ao abrir.

### 2. Página inicial e painel Comece aqui

26. Transformar o Guia de criação em painel de projeto com estado e próximas ações.
27. Mostrar primeiro o projeto recente ou oferecer Criar projeto quando não houver nenhum.
28. Converter a sequência de cinco cartões em etapas com progresso real.
29. Deixar claro se a contagem de materiais, monstros, drops e receitas pertence ao projeto atual.
30. Fazer cada cartão abrir a ferramenta correta já filtrada para a etapa.
31. Trocar contagens zeradas por uma chamada para criar o primeiro recurso.
32. Mostrar projetos recentes com nome, última edição e miniatura.
33. Adicionar botão Continuar de onde parei para retomar módulo e seleção.
34. Separar tarefas de início rápido das ferramentas avançadas.
35. Reduzir a altura do bloco introdutório para liberar espaço às tarefas.
36. Exibir alertas de salvamento ou exportação pendente no painel inicial.
37. Mostrar quais etapas foram salvas no projeto editável.
38. Adicionar uma ação principal única conforme a etapa atual.
39. Trocar textos longos dos cartões por resumo e link Saiba mais.
40. Mostrar uma prévia pequena do mapa ou personagem do projeto atual.
41. Oferecer modelos de projeto com explicação do que será criado.
42. Permitir ocultar cartões de orientação depois de concluídos.
43. Apresentar erros de validação pendentes como tarefas acionáveis.
44. Separar o que está pronto do que ainda é apenas estrutura de dados.
45. Adicionar indicador de compatibilidade da versão do projeto.
46. Mostrar caminho do projeto local apenas quando for relevante e compreensível.
47. Evitar cartões de tamanhos diferentes causados por textos desiguais.
48. Distribuir cartões em grade responsiva sem deixar grandes áreas vazias.
49. Dar ao painel inicial uma hierarquia entre continuar, criar e aprender.
50. Exibir um resumo do último salvamento e da cópia de backup disponível.

### 3. Hierarquia visual e limpeza das telas

51. Padronizar alinhamento de títulos, subtítulos, ações e conteúdo em todos os módulos.
52. Limitar a quantidade de bordas simultâneas em painéis aninhados.
53. Usar espaçamento consistente para separar grupos de controles.
54. Reservar a cor de maior destaque para a ação principal da tela.
55. Reduzir o uso de ciano em elementos que não são interativos.
56. Separar visualmente controles de edição, prévia e exportação.
57. Trocar parágrafos de instrução permanentes por dicas recolhíveis.
58. Evitar colocar ações raras no mesmo nível visual de ações frequentes.
59. Usar títulos curtos que descrevam a tarefa atual.
60. Reduzir ícones decorativos quando não ajudam a identificar a função.
61. Manter contraste suficiente entre texto secundário e fundo escuro.
62. Evitar cartões com excesso de preenchimento interno.
63. Padronizar tamanho visual das áreas de prévia entre ferramentas.
64. Usar uma grade de alinhamento comum para as colunas do editor.
65. Remover efeitos de brilho de campos e botões sem foco ou seleção.
66. Usar estados visuais distintos para normal, hover, foco, ativo e desabilitado.
67. Priorizar o conteúdo editável e reduzir o peso visual de molduras.
68. Mostrar metadados em linhas compactas em vez de caixas separadas.
69. Alinhar etiquetas e campos de formulário para facilitar leitura em sequência.
70. Separar configurações raras em seções avançadas recolhidas.
71. Usar divisores apenas para separar grupos de trabalho reais.
72. Diminuir a repetição de cabeçalhos dentro de uma mesma tela.
73. Evitar rolagem horizontal em telas de desktop.
74. Mostrar mensagens de limite ou dependência junto do controle que as causa.
75. Manter a paleta escura, mas introduzir superfícies com contraste mais claro entre níveis.

### 4. Sistema visual compartilhado

76. Criar tokens CSS únicos para cor, espaçamento, tipografia, borda e sombra.
77. Unificar os tokens da tela principal, Pixel Art e editor de mapas.
78. Definir uma escala tipográfica curta para título, seção, campo e ajuda.
79. Definir uma escala de espaçamento baseada em múltiplos de quatro ou oito pixels.
80. Padronizar altura mínima de botões, campos e linhas de lista.
81. Documentar as cores semânticas de sucesso, aviso, erro e informação.
82. Definir um padrão único para botões primários, secundários e destrutivos.
83. Padronizar raio de borda de cartões, janelas, menus e campos.
84. Criar componentes reutilizáveis para cabeçalho de painel e barra de ações.
85. Unificar a aparência de abas e subabas entre módulos.
86. Definir estilo consistente para estados selecionados.
87. Padronizar ícones em uma única família e espessura.
88. Evitar emojis como substitutos de ícones funcionais.
89. Especificar paleta de acessibilidade para modo escuro.
90. Definir tokens para densidade compacta e confortável.
91. Centralizar estilos compartilhados para não copiar CSS entre arquivos.
92. Padronizar foco visível com contorno consistente.
93. Uniformizar mensagens de status, erro e sucesso.
94. Definir largura mínima para painéis editáveis.
95. Estabelecer regra de truncamento e tooltip para nomes longos.
96. Padronizar loaders, spinners e indicadores de tarefa.
97. Definir padrão de skeleton para carregamentos mais longos.
98. Especificar comportamento visual de controles indisponíveis.
99. Criar uma página interna de catálogo visual dos componentes.
100. Versionar os tokens para que módulos independentes não divergirem.

### 5. Painéis, janelas e espaço de trabalho

101. Definir um layout-base comum para ferramentas abertas dentro do Creator.
102. Permitir redimensionar painéis laterais por arraste.
103. Permitir recolher e reabrir painéis sem perder o estado do projeto.
104. Salvar a disposição de painéis por módulo.
105. Oferecer modo foco que maximize a área de edição.
106. Separar a barra de janelas do conteúdo de cada módulo.
107. Indicar quais janelas têm alterações ainda não salvas.
108. Evitar que barras fixas cubram conteúdo em telas menores.
109. Restaurar tamanho e posição da janela na abertura seguinte.
110. Evitar abrir múltiplas instâncias iguais da mesma ferramenta.
111. Mostrar título e estado de cada janela na barra inferior.
112. Adicionar opção de fechar outras janelas do mesmo grupo.
113. Permitir destacar uma ferramenta em janela própria sem perder o projeto.
114. Manter um único painel de propriedades contextual.
115. Usar abas para painéis auxiliares que não precisam estar simultaneamente abertos.
116. Adicionar comando para redefinir o layout de painéis.
117. Aplicar limite mínimo e máximo ao redimensionamento de painéis.
118. Dar prioridade de largura ao canvas em resoluções comuns de notebook.
119. Evitar cabeçalhos de janela com controles de minimizar duplicados.
120. Indicar visualmente janela ativa e janela em segundo plano.
121. Reduzir altura da barra inferior de janelas.
122. Adicionar navegação por teclado entre janelas abertas.
123. Usar scroll independente em listas longas, sem rolar a tela inteira.
124. Tratar corretamente o espaço útil quando a barra do sistema operacional está presente.
125. Exibir painéis de ajuda como drawer em vez de ocupar a área principal.

### 6. Fluxo principal do editor de personagens

126. Usar o Criador Modular como fluxo principal de personagens, integrado ao módulo existente.
127. Exibir uma tela inicial de personagem com opções Criar, Abrir e Importar.
128. Organizar as etapas em Aparência, Roupas, Equipamentos, Animações e Perfil.
129. Manter a prévia central visível durante a edição de categorias.
130. Exibir ferramentas de transformação junto ao canvas, não espalhadas pela tela.
131. Separar configuração de corpo da seleção de roupa.
132. Mostrar a categoria ativa e a quantidade de peças disponíveis.
133. Adicionar busca por nome nas opções de aparência e equipamento.
134. Filtrar peças por tribo, classe, tamanho ou compatibilidade.
135. Mostrar a peça selecionada antes de aplicá-la ao personagem.
136. Exibir aviso se uma peça não combina com o corpo selecionado.
137. Adicionar comparação antes e depois para mudanças de aparência.
138. Permitir duplicar personagem a partir do personagem aberto.
139. Oferecer predefinições como ponto de partida sem bloquear edição livre.
140. Adicionar campos de nome, tribo e classe em uma seção de identidade clara.
141. Ocultar campos de lore quando o objetivo for apenas gerar sprite.
142. Permitir trocar entre vista de edição e vista de jogo.
143. Exibir tamanho final em pixels junto da prévia.
144. Indicar se o personagem está usando imagens importadas ou peças nativas.
145. Permitir voltar ao estado anterior da composição sem perder o trabalho.
146. Dar destaque à ação de adicionar peça ao personagem.
147. Exibir avisos de recorte ou transparência incompleta na própria tela.
148. Manter a terminologia de personagem igual em todas as telas e exportações.
149. Separar o que é dado visual do que é ficha de gameplay.
150. Oferecer modo simplificado e modo avançado sem duplicar a ferramenta.

### 7. Camadas, peças e importação de arte

151. Mostrar camadas em ordem de renderização, da frente para trás.
152. Permitir arrastar camadas para reordenar com alça de movimento clara.
153. Usar miniaturas de camada para identificar cada peça rapidamente.
154. Permitir bloquear, ocultar e renomear camadas em ações distintas.
155. Exibir indicador de camada bloqueada que não dependa apenas de ícone.
156. Permitir selecionar várias camadas para mover ou ocultar em conjunto.
157. Adicionar busca e filtro de camadas por tipo.
158. Mostrar limites da imagem e ponto de ancoragem da peça selecionada.
159. Permitir ajustar posição com setas do teclado em incrementos de um pixel.
160. Oferecer ajuste de escala com preservação do pixel art.
161. Exibir a opacidade numérica e um controle deslizante preciso.
162. Mostrar aviso antes de substituir uma peça já existente.
163. Permitir recortar e importar várias imagens em lote.
164. Classificar automaticamente imagens por nome sem confiar apenas na classificação.
165. Permitir atribuir categoria manualmente ao importar.
166. Mostrar transparência em padrão xadrez configurável.
167. Validar dimensões e formato antes de adicionar uma imagem.
168. Explicar por que uma imagem foi recusada ou redimensionada.
169. Preservar imagem original e manter transformação como metadado separado.
170. Permitir remover fundo com prévia antes de aplicar a alteração.
171. Exibir contagem de peças carregadas e espaço usado.
172. Detectar nomes duplicados e sugerir renomeação.
173. Permitir substituir a fonte da camada sem perder transformações.
174. Mostrar relação entre peça importada e personagem que a utiliza.
175. Adicionar ação de exportar uma camada isolada com transparência.

### 8. Animação e pré-visualização

176. Separar lista de animações da linha do tempo de quadros.
177. Mostrar nomes de estados como parado, caminhada, corrida e ataque.
178. Exibir taxa de quadros atual junto ao controle.
179. Permitir alterar FPS por animação e não apenas por projeto.
180. Adicionar botão de loop visível na prévia.
181. Permitir avanço e retorno de um quadro por vez.
182. Destacar o quadro atual na linha do tempo.
183. Mostrar direção do personagem em cada faixa de spritesheet.
184. Permitir reproduzir apenas uma direção selecionada.
185. Adicionar comparação simultânea entre duas animações.
186. Mostrar animação em tamanho original e ampliado.
187. Desativar suavização de imagem para manter pixels nítidos.
188. Exibir quadro ausente ou tamanho inconsistente na linha do tempo.
189. Permitir arrastar quadros para alterar a ordem.
190. Oferecer duração individual por quadro quando o formato permitir.
191. Permitir duplicar quadro e espelhar horizontalmente.
192. Mostrar pivô e ponto de contato dos pés durante a animação.
193. Visualizar alinhamento do personagem ao alternar quadros.
194. Separar efeitos visuais da animação corporal.
195. Adicionar prévia de transição entre estados.
196. Permitir nomear animações personalizadas.
197. Exibir ações compatíveis com o runtime de exportação.
198. Mostrar status de sincronização da animação com o modelo atual.
199. Permitir salvar somente a animação sem exportar personagem completo.
200. Adicionar modo de prévia em fundo e escala configuráveis.

### 9. Pixel Art, spritesheets e recorte

201. Reunir recorte, edição, prévia e exportação num fluxo com etapas claras.
202. Mostrar tamanho da célula antes de iniciar o recorte de spritesheet.
203. Permitir salvar presets de grade para formatos recorrentes.
204. Exibir divisórias ajustáveis com alças de maior área de clique.
205. Mostrar dimensões do recorte selecionado em pixels.
206. Permitir desmarcar quadros que não devem entrar na exportação.
207. Oferecer prévia de todas as células antes de confirmar o fatiamento.
208. Destacar células vazias e células parcialmente preenchidas.
209. Permitir selecionar várias células por arraste.
210. Exibir nome sugerido e sequência de quadros a exportar.
211. Preservar proporção e resolução original durante a visualização.
212. Separar remoção de fundo de recorte e mostrar cada etapa.
213. Mostrar resultado da limpeza antes de gravar a imagem.
214. Permitir desfazer remoção de fundo por região.
215. Adicionar comparação lado a lado entre original e resultado.
216. Indicar quantos pixels transparentes foram removidos.
217. Guardar configurações do último recorte no projeto.
218. Permitir exportar spritesheet e quadros individuais juntos.
219. Mostrar limitações de dimensão antes de processar uma imagem grande.
220. Oferecer zoom por roda do mouse e botões acessíveis.
221. Indicar grade, âncora e origem do canvas na prévia.
222. Evitar processamento de imagem em cada movimento do mouse.
223. Dar feedback de progresso para detecção de sprites separados.
224. Permitir cancelamento seguro durante operações de imagem.
225. Exibir logs de exportação em mensagens legíveis para o criador.

### 10. Mapas, tilesets e mundo

226. Manter a tela do mapa centrada no canvas e não nos formulários.
227. Exibir coordenadas de grade do cursor.
228. Mostrar camada ativa e ferramenta ativa em local fixo.
229. Separar pincel de terreno, objetos e elevação.
230. Permitir ocultar e bloquear cada camada do mapa.
231. Mostrar minimapa recolhível para mapas grandes.
232. Oferecer zoom com níveis previsíveis e botão ajustar à tela.
233. Indicar dimensões do mapa e tamanho do tile sempre visíveis.
234. Permitir busca de tiles por nome e categoria.
235. Mostrar prévia do tile antes de usá-lo como pincel.
236. Oferecer carimbo de área para padrões repetidos.
237. Adicionar seleção retangular para copiar e colar regiões.
238. Mostrar bordas do autotile antes de confirmar a pintura.
239. Adicionar modo de visualização sem grades e guias.
240. Explicar erros de encaixe com indicação do tile afetado.
241. Permitir alternar terreno, colisão e objetos na mesma região.
242. Visualizar obstáculos e colisões com uma camada sobreposta.
243. Exibir nome de regiões e zonas do mapa no canvas.
244. Permitir esconder objetos temporariamente sem apagá-los.
245. Separar edição de geografia da edição de narrativa e eventos.
246. Mostrar estatísticas de tamanho e número de tiles usados.
247. Permitir ampliar biblioteca de tilesets por coleção.
248. Visualizar tile repetido em contexto de repetição antes de usar.
249. Desfazer pintura por grupo de operação.
250. Oferecer histórico de operações recentes do mapa.

### 11. Biblioteca central e organização de recursos

251. Usar a biblioteca central como origem única para recursos compartilhados.
252. Adicionar busca global por nome, tipo e etiqueta.
253. Permitir filtrar por personagem, mapa, item, animação e projeto.
254. Exibir miniaturas consistentes em todos os módulos.
255. Mostrar data de edição e projeto de origem do recurso.
256. Permitir favoritar recursos usados com frequência.
257. Oferecer coleções e pastas sem duplicar o arquivo original.
258. Indicar recursos órfãos não usados em nenhum projeto.
259. Mostrar relações de dependência antes de excluir um asset.
260. Permitir renomear e categorizar recursos em lote.
261. Detectar duplicatas por conteúdo e não apenas por nome.
262. Mostrar formato, dimensões, tamanho e transparência da imagem.
263. Permitir abrir o recurso na ferramenta apropriada.
264. Exibir miniatura ampliada em hover ou painel de inspeção.
265. Adicionar filtro para recursos quebrados ou sem prévia.
266. Informar quando a biblioteca está bloqueada por outra aba.
267. Mostrar estado de IndexedDB e disponibilidade do armazenamento.
268. Permitir ordenar por nome, uso recente e tamanho.
269. Adicionar etiquetas de origem oficial, importada ou gerada.
270. Exibir versão de schema do projeto e compatibilidade dos assets.
271. Oferecer opção de exportar somente os recursos selecionados.
272. Permitir restaurar recurso excluído a partir de lixeira temporária.
273. Mostrar quando duas abas alteraram o mesmo registro.
274. Evitar carregar todas as miniaturas de uma vez em bibliotecas grandes.
275. Dar uma visão de dependências antes de criar pacote para Godot.

### 12. Itens, receitas, drops e economia

276. Consolidar a fábrica de itens e o editor tradicional em um fluxo único.
277. Reutilizar um mesmo formulário de item em inventário, loja e drop.
278. Separar definição do item de seu uso em cada sistema.
279. Mostrar em quais receitas e tabelas de drop o item aparece.
280. Exibir saldo, raridade e categoria em uma prévia compacta.
281. Permitir criar item a partir de outro sem duplicar campos comuns.
282. Validar referências a materiais antes de salvar receita.
283. Mostrar custo final da receita enquanto os ingredientes são editados.
284. Destacar ingredientes inexistentes ou IDs não resolvidos.
285. Separar preço de loja, valor de venda e recompensa de missão.
286. Mostrar o impacto do item no inventário e no equipamento.
287. Exibir efeito do item em linguagem de jogo além do valor técnico.
288. Permitir testar fabricação em sandbox de prévia.
289. Indicar duração de fabricação e estado do temporizador.
290. Mostrar tabela de drops como distribuição visual por raridade.
291. Validar percentuais de drop e deixar claro se somam 100%.
292. Exibir relação entre ícone, ficha e recurso visual do item.
293. Permitir procurar todos os itens sem imagem.
294. Usar formulários em etapas para itens complexos.
295. Recolher configurações avançadas de efeitos.
296. Adicionar prévia de item no inventário antes da exportação.
297. Mostrar diferenças entre itens com nomes parecidos.
298. Explicar IDs compartilhados e evitar digitação manual.
299. Adicionar verificador de dados inconsistentes da economia.
300. Manter mensagem explícita quando a interface apenas registra dados e não executa gameplay.

### 13. Ajuda contextual e aprendizagem

301. Trocar manual extenso permanente por ajuda contextual acionada quando necessário.
302. Adicionar tour inicial que pode ser pulado e retomado.
303. Explicar a primeira ação de cada módulo em uma frase.
304. Mostrar exemplos carregáveis sem alterar o projeto atual.
305. Adicionar dicas para termos técnicos como spritesheet, âncora e tile.
306. Manter documentação sincronizada com o rótulo visível da interface.
307. Adicionar botão Ajuda ao lado de controles complexos.
308. Explicar diferença entre salvar recurso e salvar projeto.
309. Mostrar fluxo recomendado da arte até a exportação para Godot.
310. Informar o que o Creator faz e o que depende do Godot.
311. Marcar passo atual e próximo passo no painel de aprendizagem.
312. Permitir dispensar instruções já conhecidas.
313. Oferecer tutorial curto por tarefa em vez de tutorial geral.
314. Adicionar pesquisa na ajuda interna.
315. Usar screenshots atuais da aplicação na documentação.
316. Indicar versão da documentação na própria ferramenta.
317. Mostrar exemplos de JSON válidos e inválidos com correção sugerida.
318. Explicar limites de formatos de imagem antes do upload.
319. Oferecer dicas iniciais para o Criador Modular de Personagens.
320. Adicionar botão para restaurar dicas dispensadas.
321. Evitar jargão interno como bridge sem explicação para o usuário.
322. Mostrar links para artefatos exportados e como usá-los.
323. Ensinar a validar uma animação no runtime em etapas.
324. Separar orientação para iniciante da referência técnica.
325. Indicar quando uma etapa é recomendação e quando é obrigatória.

### 14. Controles, estados e feedback

326. Padronizar resposta visível após cada ação de salvar, importar ou exportar.
327. Usar notificações que não cubram botões e campos.
328. Mostrar progresso em operações longas de imagem.
329. Explicar por que um botão está desabilitado.
330. Indicar quando o canvas está processando uma mudança.
331. Evitar mensagens que desaparecem antes de serem lidas.
332. Permitir dispensar mensagens de sucesso sem perder o estado.
333. Mostrar status persistente de salvamento na barra de projeto.
334. Usar confirmação apenas para ações irreversíveis ou substituições.
335. Substituir alertas genéricos por mensagens com próxima ação.
336. Dar feedback imediato ao selecionar ferramenta ou camada.
337. Separar erro de validação de erro de armazenamento.
338. Exibir foco de teclado em todos os controles acionáveis.
339. Bloquear clique duplo acidental em exportações.
340. Mostrar indicador de carregamento em busca e lista de recursos.
341. Evitar estados falsos de sucesso quando uma gravação falha.
342. Manter consistência entre toasts e região role=status.
343. Adicionar opção desfazer a operações em lote.
344. Desativar ferramentas incompatíveis em vez de deixar falhar depois.
345. Informar que uma importação terminou parcialmente.
346. Destacar o campo inválido sem apagar os dados inseridos.
347. Preservar formulários quando o usuário alterna de módulo.
348. Adicionar estado vazio com ação adequada em cada lista.
349. Evitar texto técnico bruto em mensagens para o usuário.
350. Registrar resultado e tempo das ações de exportação.

### 15. Salvamento, projetos e recuperação

351. Unificar mentalmente os estados IndexedDB e projeto editável com rótulos distintos.
352. Indicar claramente onde cada alteração está salva.
353. Adicionar autosave configurável para documentos e transformações.
354. Mostrar alterações não salvas antes de fechar um módulo.
355. Criar checkpoint antes de migração de schema.
356. Permitir comparar duas versões do projeto.
357. Adicionar histórico de salvamento com data e origem.
358. Oferecer restauração seletiva de personagem, mapa ou biblioteca.
359. Validar backup antes de importar qualquer registro.
360. Mostrar quantidade de itens que serão criados, atualizados ou ignorados.
361. Confirmar restauração quando IDs existentes serão substituídos.
362. Evitar apagar registros ausentes de um backup parcial.
363. Exibir espaço aproximado usado pela biblioteca local.
364. Alertar antes de atingir limite de armazenamento do navegador.
365. Adicionar exportação de backup completo no painel principal.
366. Permitir backup por intervalo e não apenas manual.
367. Mostrar estado de backup no topo quando uma operação está pendente.
368. Salvar estado de painel sem misturar com conteúdo do projeto.
369. Oferecer migração de projeto antigo com relatório antes da conversão.
370. Indicar versão mínima e máxima do formato de projeto.
371. Manter recuperação automática depois de fechamento inesperado.
372. Permitir renomear projeto sem alterar seus IDs internos.
373. Mostrar atividade recente e quem alterou no caso de arquivo compartilhado.
374. Adicionar checagem de integridade dos vínculos antes de salvar.
375. Explicar a diferença entre checkpoint, backup e exportação.

### 16. Exportação e integração com Godot

376. Separar pacote de runtime de pacote de diagnóstico.
377. Mostrar lista exata dos arquivos que serão exportados.
378. Apresentar resumo de dependências antes de gerar ZIP.
379. Validar que spritesheet e manifesto têm dimensões compatíveis.
380. Indicar qual versão de Godot foi usada na validação automatizada.
381. Explicar ações manuais que ainda são necessárias após exportar.
382. Permitir escolher pasta de destino pelo fluxo de download.
383. Mostrar nome e tamanho do pacote antes do download.
384. Validar caminhos res:// e nomes de recursos.
385. Exibir estado de integração com a ponte do Creator.
386. Informar quando uma ferramenta está aberta fora do fluxo integrado.
387. Testar exportação com asset grande e com caractere acentuado no nome.
388. Mostrar aviso se a arte exportada não está ligada ao personagem salvo.
389. Permitir escolher entre spritesheet, quadros e pacote completo.
390. Pré-visualizar cenas Godot que serão incluídas no pacote.
391. Exibir diferenças entre exportar metadados e executar gameplay.
392. Gerar relatório simples de arquivos omitidos e motivo.
393. Detectar arquivo necessário ausente antes de gerar ZIP.
394. Manter identificadores estáveis ao atualizar recurso exportado.
395. Adicionar botão Abrir instruções de importação após baixar pacote.
396. Separar templates de Godot por tipo de projeto.
397. Indicar itens que exigem validação manual em dispositivo físico.
398. Evitar prometer runtime funcional quando existe apenas catálogo exportado.
399. Adicionar verificação de integridade do ZIP depois de criado.
400. Mostrar resultado de teste de importação quando disponível.

### 17. Responsividade e diferentes telas

401. Definir resolução de referência e largura mínima suportada para desktop.
402. Reorganizar três colunas do editor em duas antes de empilhar painéis.
403. Empilhar painéis na ordem de tarefa quando o viewport ficar estreito.
404. Manter canvas utilizável em notebook com tela de 1366 por 768.
405. Evitar altura mínima fixa que force rolagem excessiva em laptop.
406. Trocar sidebar por drawer recolhível em telas pequenas.
407. Reduzir colunas de campos sem deixar controles apertados.
408. Usar controles de toque maiores em tablet.
409. Permitir usar o editor de personagem em tablet sem hover.
410. Tratar orientação retrato e paisagem separadamente.
411. Não esconder ação salvar ao reduzir largura.
412. Adaptar barra inferior de janelas para rolagem acessível.
413. Evitar textos cortados sem tooltip ou quebra de linha.
414. Reduzir colunas de cartões na tela inicial conforme viewport.
415. Preservar a proporção do canvas ao redimensionar.
416. Permitir zoom do navegador sem quebra de painel.
417. Testar interface com escalas Windows de 100%, 125% e 150%.
418. Não usar largura fixa maior que o espaço disponível.
419. Reservar área para teclado virtual em campos de texto no celular.
420. Oferecer layout touch para navegação em canvas.
421. Evitar que controles de toque ativem simultaneamente pan e pintura.
422. Permitir fechar painel lateral sem perder sua seleção.
423. Redimensionar prévias sem suavizar pixels.
424. Manter ações frequentes acessíveis sem rolagem vertical longa.
425. Definir comportamento para janela dividida e tela ultrawide.

### 18. Acessibilidade e operação por teclado

426. Associar todos os inputs aos seus labels de forma programática.
427. Usar rótulo acessível para botões que exibem apenas ícone.
428. Manter ordem de tabulação coerente com a ordem visual.
429. Adicionar atalhos editáveis para salvar, desfazer, refazer e exportar.
430. Permitir navegação pela lista de camadas com teclado.
431. Oferecer alternativa de teclado para mover item no canvas.
432. Não comunicar estado apenas por cor ou brilho.
433. Verificar contraste de texto pequeno e texto secundário.
434. Evitar foco que desaparece após abrir modal ou drawer.
435. Conter o foco em diálogos até conclusão ou cancelamento.
436. Dar descrição acessível à prévia visual e spritesheet.
437. Anunciar mudanças de estado por região aria-live adequada.
438. Respeitar preferência de movimento reduzido.
439. Evitar animações de interface que desviam atenção.
440. Permitir ampliar interface sem conteúdo sair da tela.
441. Exibir foco de seleção em controles no modo escuro.
442. Usar linguagem simples e direta em validações.
443. Oferecer navegação sem mouse em menus de módulo.
444. Dar acesso por teclado ao seletor de cor.
445. Permitir alternar ferramenta de desenho sem gesto de arraste.
446. Usar alvo de clique grande para ações no canvas.
447. Adicionar modo de alto contraste para controles críticos.
448. Não usar placeholders como substitutos de rótulos.
449. Manter nomes de regiões acessíveis em janelas dinâmicas.
450. Verificar acessibilidade de controles dentro de Shadow DOM e iframe.

### 19. Desempenho no navegador

451. Reduzir trabalho repetido de renderização durante a digitação.
452. Recalcular spritesheet apenas quando dados visuais mudarem.
453. Usar debounce em busca e prévias que processam muitos assets.
454. Carregar miniaturas sob demanda em listas extensas.
455. Usar createImageBitmap quando suportado para imagens grandes.
456. Revogar object URLs depois de terminar a prévia.
457. Evitar converter canvas para data URL em toda atualização.
458. Preferir Blob para operações com imagens de maior tamanho.
459. Executar processamento pesado em Web Worker quando apropriado.
460. Mostrar progresso e permitir cancelar processamento longo.
461. Limitar dimensões de imagens com aviso antes de decodificar.
462. Evitar animação de canvas quando a aba do módulo está oculta.
463. Suspender loop de prévia quando a janela estiver minimizada.
464. Reutilizar canvas temporário em vez de criar vários por frame.
465. Reduzir listeners globais registrados em cada abertura de módulo.
466. Desconectar observadores quando ferramenta é desmontada.
467. Medir tempo de abertura de módulo e primeira prévia.
468. Usar virtualização para listas grandes de assets e camadas.
469. Evitar carregar partes do bundle que o módulo atual não utiliza.
470. Compactar ou dividir ativos estáticos grandes com estratégia explícita.
471. Evitar cópias desnecessárias de grandes objetos JSON.
472. Informar ao usuário quando a biblioteca está indexando muitos itens.
473. Manter taxa de quadros da prévia configurável em PCs modestos.
474. Testar comportamento com memória limitada e abas simultâneas.
475. Registrar regressão de tamanho do pacote em cada versão.

### 20. Arquitetura, validação e manutenção de interface

476. Reduzir o HTML monolítico de 16 MB por fatias testáveis e documentadas.
477. Separar código de interface, estado do projeto e renderização.
478. Manter os 24 módulos empacotados rastreáveis até seus arquivos de origem.
479. Evitar correção manual no arquivo compilado quando há fonte modular.
480. Extrair componentes comuns para um pacote interno compartilhado.
481. Definir contratos de integração entre Creator, Pixel Art, mapa e biblioteca.
482. Validar cada módulo isoladamente e dentro do shell integrado.
483. Adicionar testes de navegação para rotas e abertura de ferramentas.
484. Adicionar testes visuais de estados vazios, erro e conteúdo real.
485. Registrar screenshots de referência para regressão visual.
486. Verificar responsividade em resoluções de desktop e tablet.
487. Testar se fechar e reabrir uma janela não duplica listeners.
488. Medir peso total do pacote de entrega por release.
489. Atualizar documentação quando rótulos ou fluxos de interface mudarem.
490. Remover estilos duplicados apenas depois de localizar dependências.
491. Marcar claramente arquivos históricos sem carregá-los no runtime.
492. Separar protótipos de módulos oficialmente disponíveis.
493. Manter changelog visível para usuários do Creator.
494. Registrar limite conhecido junto do módulo correspondente.
495. Usar versão de schema explícita para dados de interface persistidos.
496. Manter build reproduzível para Windows e ambiente de CI.
497. Validar caminhos relativos quando ferramenta abre via file://.
498. Testar comunicação entre Shadow DOM, iframe e página hospedeira.
499. Preservar a regra do projeto de não iniciar trabalhos paralelos de implementação.
500. Priorizar correções por impacto no fluxo, evidência e risco de regressão.

## Limites desta avaliação

Esta revisão foi feita com a árvore e os documentos acessíveis na branch `main`, a tela inicial enviada e os metadados/escopo da PR #13. Não abri o aplicativo no navegador, não percorri todas as ferramentas em execução, não validei visualmente a versão integrada e não rodei CI ou testes. Por isso, recomendações sobre bugs de interação, acessibilidade ou velocidade precisam de confirmação prática antes de virar correção. As propostas devem seguir o protocolo do repositório: localizar o comportamento existente, evitar duplicação, preservar projetos e trabalhar de forma sequencial.

## Complemento — backup da conversa

**Data:** 02/11/2026; horário exato da conversa não preservado.  
**Objetivo:** registrar a análise do Apoena GameCreator e a direção de interface discutida nesta conversa.

### Registro da conversa

- O usuário apresentou uma referência visual para o editor de personagens e pediu um conceito visual para ver. Foi gerada uma imagem de conceito de interface do Criador Modular; ela é uma proposta visual, não alteração de código.
- O usuário mostrou a página inicial local atual do GameCreator v4.0. A decisão de interface foi manter essa tela como entrada e abrir o editor de personagens como módulo integrado, sem substituir a página inicial.
- O usuário pediu uma avaliação do repositório com 500 formas de melhorar a interface e deixá-la mais limpa e otimizada. Este relatório contém 500 propostas organizadas em 20 grupos, com recomendações iniciais e limites da análise.
- A análise consultou a branch main, o README, documentos de auditoria/organização, a árvore do repositório, trechos dos módulos Pixel Art e Map Editor, e os metadados/descrição da PR #13. Não houve execução do aplicativo ou de testes.

### Evidências de estado observadas

- O README na main identifica a versão V4.1 como em desenvolvimento, enquanto a captura enviada mostra a aplicação local V4.0. A base local e a branch do GitHub precisam ser alinhadas antes de uma mudança visual.
- A árvore do repositório contém uma entrada index.html de aproximadamente 16,3 MB e 24 partes em bundle-v4, além de ferramentas separadas para Pixel Art, mapas e biblioteca central.
- A documentação existente já registra sobreposição entre a Fábrica de Itens e o editor tradicional de itens; a proposta é mapear e consolidar antes de criar outro fluxo.
- A PR [#13 — GC-CHAR-001](https://github.com/apoenalore/GameCreator/pull/13) foi observada aberta, em rascunho e mergeable, com base feat/apoena-personagem-estudio-main e head feat/apoena-character-creator-prototype. O escopo da PR usa um iframe para a tela do Criador Modular e declara pendentes validação no Creator compilado, sincronização com a biblioteca IndexedDB e validação da integração Godot.
- A tela pretendida para personagens deve preservar o espaço central de edição, categorias de aparência/roupas/equipamentos/acessórios/habilidades, animação, prévia, composição por camadas e ações de spritesheet/exportação.

### Limites e preservação

- As 500 entradas são propostas de melhoria, não 500 defeitos comprovados.
- A captura local e as imagens de conceito não foram copiadas como binários neste backup; permanecem anexos da conversa/Library.
- Não foram alterados código do produto, PRs, workflows, testes, assets ou dados IndexedDB. Este backup altera somente documentação.
- A revisão estática não confirma funcionamento visual no navegador, em Android ou no runtime Godot.

### Próximo passo recomendado

Alinhar a versão local v4.0 com a branch atual do GitHub; validar o fluxo da PR #13 no Creator compilado; só então priorizar mudanças de navegação, painéis e integração do editor de personagens, preservando os módulos que já existem.

---

**Fim do relatório e backup documental desta conversa.**
