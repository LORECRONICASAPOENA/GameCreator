# Segurança Apoena — 500 controles candidatos e plano de proteção comunitária

**Pesquisa e inspeção documental:** 02/11/2026  
**Repositório:** `apoenalore/GameCreator`  
**Escopo:** Game Creator, futuro jogo Apoena, uploads, itens comunitários, mods, publicação, economia e operação online.  
**Status:** pesquisa inicial e backlog de segurança; não é certificação, pentest ou garantia de invulnerabilidade.

## Diretriz principal

Adotar **secure by design, secure by default, least privilege, deny by default e defesa em profundidade**.

A comunidade poderá personalizar aparência e narrativa dentro de opções aprovadas. Nenhum conteúdo criado pelo jogador deve executar código arbitrário nem definir autoridade sobre combate, economia, inventário, contas, permissões ou partidas competitivas.

O catálogo contém exatamente 500 controles candidatos, organizados em 20 domínios. Eles precisam ser classificados como aplicáveis, não aplicáveis ou condicionais, e só podem ser marcados como verificados com evidência e teste.

## Inspeção do Game Creator — achados preliminares

Arquivos consultados: `shared/creator-bridge.js`, `pixel-art/ponte-creator.js`, `shared/asset-library.js`, `shared/library-backup.js`, `integracao/catalogo.js`, `integracao/godot/ApoenaCatalogo.gd`, `tests/creator-bridge.test.cjs`, páginas da biblioteca/map editor e workflow canônico.

| ID | Evidência observada | Risco/limite | Próxima ação recomendada |
|---|---|---|---|
| SEC-001 | `creator-bridge.js` envia mensagens com targetOrigin `*` | A mensagem não fica restrita a uma origem exata | Redesenhar handshake e targetOrigin; preservar compatibilidade local apenas com autenticação explícita |
| SEC-002 | Listener aceita `event.origin === "null"` | Origem opaca não autentica o remetente | Não confiar em origem null isoladamente; usar canal autenticado/nonce, source esperado e validação estrita |
| SEC-003 | Teste cobre origem HTTPS externa, não cobre origem null, replay e payload extremo | Cobertura incompleta | Adicionar testes negativos e fuzzing de mensagens |
| SEC-004 | Backup limita a 10.000 registros e 120 MB de texto, mas importa registro por registro | Falha no meio pode deixar importação parcial; limites por objeto/complexidade devem ser avaliados | Validar todo snapshot, profundidade, dimensões, tamanho por asset e atomicidade/rollback |
| SEC-005 | Biblioteca aceita Blob cujo MIME começa com image/ | MIME declarado não comprova bytes de imagem | Decodificar e re-encodar em processo atualizado e isolado antes de publicação |
| SEC-006 | Ponte verifica prefixo data:image/png;base64 | Prefixo não comprova PNG íntegro nem dimensões/tamanho seguros | Validar base64, assinatura, dimensões, pixels e bytes |
| SEC-007 | Catálogo/inventário inspecionado é lógica local | Cliente controlado pelo jogador pode ser alterado | Antes de multiplayer/economia, mover autoridade de itens, saldo, craft e recompensas para servidor |
| SEC-008 | Não foi identificada sandbox de mods | Executar scripts enviados por jogadores no processo principal seria risco crítico | Primeira versão comunitária sem scripts: somente dados declarativos |
| SEC-009 | Nesta inspeção não foi encontrada API de publicação multiusuário | Autorização por usuário, armazenamento privado e moderação ainda precisam de projeto próprio | Especificar backend, ACL por objeto, quarentena e auditoria antes de uploads públicos |

**Limite:** inspeção parcial do repositório; não demonstra ausência de outras vulnerabilidades. O Game Creator local não deve ser confundido com um backend online já existente.

## Modelo seguro para a iniciativa comunitária

### Fase 1 — criação limitada, sem código executável
- Templates aprovados para arma, roupa, armadura, acessório e emblema.
- Paletas, materiais, padrões, ornamentos, silhuetas, sockets e efeitos visuais predefinidos.
- Limites para polígonos, ossos, texturas, dimensões, frames, tamanho de arquivo e combinações.
- Exportação de manifesto declarativo versionado + assets validados.
- Nenhum script, HTML, SVG ativo, executável ou plugin arbitrário.
- Quarentena técnica e moderação antes de publicação.

### Fase 2 — atributos e recompensas sob autoridade do servidor
- O criador define aparência; o jogo define atributos.
- Dano, defesa, alcance, cooldown, raridade, preço e drop rate são derivados de templates oficiais.
- O cliente não decide inventário, moeda, posse, resultado de partida ou elegibilidade.
- Recompensas de participação são concedidas no servidor após validar entitlement/conta/recibo, nunca por flag local.
- Conteúdo cosmético e conteúdo competitivo têm regras separadas.

### Fase 3 — mods avançados somente se necessários
- Sandbox de processo/runtime apropriado, não apenas iframe.
- Sem acesso a filesystem, rede, cookies, tokens ou processos do host.
- API pequena por capabilities, quotas de CPU/memória/tempo e revogação.
- Assinatura de manifests e pacotes, hashes, revisão e kill switch.
- Mods não aprovados não entram em partidas ranqueadas.

**Não existe proteção absoluta contra modificação do cliente:** o usuário controla o próprio dispositivo. A arquitetura deve impedir que alterações locais concedam vantagem no servidor, acessem dados de terceiros ou comprometam o serviço.

## Prioridades

**P0 — antes de abrir uploads comunitários:** ponte de mensagens, validação binária de assets, limites e atomicidade de backup, ausência de execução de código, quarentena e moderação.

**P1 — antes de contas/publicação online:** identidade, MFA da equipe, autorização por objeto, rate limits, storage privado, logs protegidos, gestão de segredos e recuperação.

**P2 — antes de multiplayer/economia:** servidor autoritativo, ledger de transações, idempotência, anti-replay, validação de combate/inventário/recompensas e testes de duplicação.

**P3 — antes de mods executáveis:** sandbox real, capabilities, quotas, assinatura, revogação, revisão independente e pentest.

## Catálogo de 500 controles candidatos

## Arquitetura e confiança

1. Inventariar os componentes e suas versões fronteiras de confiança (fluxos de dados).
2. Definir proprietário e responsável operacional fronteiras de confiança (componentes).
3. Classificar dados por sensibilidade fronteiras de confiança (serviços).
4. Documentar fluxos de entrada e saída fronteiras de confiança (cliente e servidor).
5. Desenhar fronteiras de confiança fronteiras de confiança (fluxos de dados).
6. Aplicar menor privilégio fronteiras de confiança (componentes).
7. Negar acesso por padrão fronteiras de confiança (serviços).
8. Validar entradas no ponto de entrada fronteiras de confiança (cliente e servidor).
9. Validar autorização no ponto de uso fronteiras de confiança (fluxos de dados).
10. Limitar tamanho e frequência de operações fronteiras de confiança (componentes).
11. Registrar eventos de segurança sem segredos fronteiras de confiança (serviços).
12. Proteger logs contra alteração fronteiras de confiança (cliente e servidor).
13. Definir retenção e descarte fronteiras de confiança (fluxos de dados).
14. Criar testes negativos automatizados fronteiras de confiança (componentes).
15. Testar comportamento em falha de rede fronteiras de confiança (serviços).
16. Testar concorrência e repetição fronteiras de confiança (cliente e servidor).
17. Monitorar dependências e vulnerabilidades fronteiras de confiança (fluxos de dados).
18. Revisar configurações antes de release fronteiras de confiança (componentes).
19. Separar desenvolvimento e produção fronteiras de confiança (serviços).
20. Criar procedimento de revogação fronteiras de confiança (cliente e servidor).
21. Definir limites de recursos fronteiras de confiança (fluxos de dados).
22. Proteger dados em trânsito e repouso fronteiras de confiança (componentes).
23. Criar rollback verificável fronteiras de confiança (serviços).
24. Documentar riscos residuais fronteiras de confiança (cliente e servidor).
25. Revisar o controle após mudanças arquiteturais fronteiras de confiança (fluxos de dados).

## Contas e identidade

26. Inventariar os componentes e suas versões contas de jogadores (contas administrativas).
27. Definir proprietário e responsável operacional contas de jogadores (sessões).
28. Classificar dados por sensibilidade contas de jogadores (credenciais).
29. Documentar fluxos de entrada e saída contas de jogadores (recuperação de conta).
30. Desenhar fronteiras de confiança contas de jogadores (contas administrativas).
31. Aplicar menor privilégio contas de jogadores (sessões).
32. Negar acesso por padrão contas de jogadores (credenciais).
33. Validar entradas no ponto de entrada contas de jogadores (recuperação de conta).
34. Validar autorização no ponto de uso contas de jogadores (contas administrativas).
35. Limitar tamanho e frequência de operações contas de jogadores (sessões).
36. Registrar eventos de segurança sem segredos contas de jogadores (credenciais).
37. Proteger logs contra alteração contas de jogadores (recuperação de conta).
38. Definir retenção e descarte contas de jogadores (contas administrativas).
39. Criar testes negativos automatizados contas de jogadores (sessões).
40. Testar comportamento em falha de rede contas de jogadores (credenciais).
41. Testar concorrência e repetição contas de jogadores (recuperação de conta).
42. Monitorar dependências e vulnerabilidades contas de jogadores (contas administrativas).
43. Revisar configurações antes de release contas de jogadores (sessões).
44. Separar desenvolvimento e produção contas de jogadores (credenciais).
45. Criar procedimento de revogação contas de jogadores (recuperação de conta).
46. Definir limites de recursos contas de jogadores (contas administrativas).
47. Proteger dados em trânsito e repouso contas de jogadores (sessões).
48. Criar rollback verificável contas de jogadores (credenciais).
49. Documentar riscos residuais contas de jogadores (recuperação de conta).
50. Revisar o controle após mudanças arquiteturais contas de jogadores (contas administrativas).

## Autenticação

51. Inventariar os componentes e suas versões login (MFA).
52. Definir proprietário e responsável operacional login (passkeys).
53. Classificar dados por sensibilidade login (tokens).
54. Documentar fluxos de entrada e saída login (recuperação e reautenticação).
55. Desenhar fronteiras de confiança login (MFA).
56. Aplicar menor privilégio login (passkeys).
57. Negar acesso por padrão login (tokens).
58. Validar entradas no ponto de entrada login (recuperação e reautenticação).
59. Validar autorização no ponto de uso login (MFA).
60. Limitar tamanho e frequência de operações login (passkeys).
61. Registrar eventos de segurança sem segredos login (tokens).
62. Proteger logs contra alteração login (recuperação e reautenticação).
63. Definir retenção e descarte login (MFA).
64. Criar testes negativos automatizados login (passkeys).
65. Testar comportamento em falha de rede login (tokens).
66. Testar concorrência e repetição login (recuperação e reautenticação).
67. Monitorar dependências e vulnerabilidades login (MFA).
68. Revisar configurações antes de release login (passkeys).
69. Separar desenvolvimento e produção login (tokens).
70. Criar procedimento de revogação login (recuperação e reautenticação).
71. Definir limites de recursos login (MFA).
72. Proteger dados em trânsito e repouso login (passkeys).
73. Criar rollback verificável login (tokens).
74. Documentar riscos residuais login (recuperação e reautenticação).
75. Revisar o controle após mudanças arquiteturais login (MFA).

## Autorização

76. Inventariar os componentes e suas versões projetos (assets).
77. Definir proprietário e responsável operacional projetos (personagens).
78. Classificar dados por sensibilidade projetos (inventários).
79. Documentar fluxos de entrada e saída projetos (operações administrativas).
80. Desenhar fronteiras de confiança projetos (assets).
81. Aplicar menor privilégio projetos (personagens).
82. Negar acesso por padrão projetos (inventários).
83. Validar entradas no ponto de entrada projetos (operações administrativas).
84. Validar autorização no ponto de uso projetos (assets).
85. Limitar tamanho e frequência de operações projetos (personagens).
86. Registrar eventos de segurança sem segredos projetos (inventários).
87. Proteger logs contra alteração projetos (operações administrativas).
88. Definir retenção e descarte projetos (assets).
89. Criar testes negativos automatizados projetos (personagens).
90. Testar comportamento em falha de rede projetos (inventários).
91. Testar concorrência e repetição projetos (operações administrativas).
92. Monitorar dependências e vulnerabilidades projetos (assets).
93. Revisar configurações antes de release projetos (personagens).
94. Separar desenvolvimento e produção projetos (inventários).
95. Criar procedimento de revogação projetos (operações administrativas).
96. Definir limites de recursos projetos (assets).
97. Proteger dados em trânsito e repouso projetos (personagens).
98. Criar rollback verificável projetos (inventários).
99. Documentar riscos residuais projetos (operações administrativas).
100. Revisar o controle após mudanças arquiteturais projetos (assets).

## Web e navegador

101. Inventariar os componentes e suas versões páginas do Creator (conteúdo comunitário).
102. Definir proprietário e responsável operacional páginas do Creator (janelas e mensagens).
103. Classificar dados por sensibilidade páginas do Creator (scripts e recursos externos).
104. Documentar fluxos de entrada e saída páginas do Creator (sessões web).
105. Desenhar fronteiras de confiança páginas do Creator (conteúdo comunitário).
106. Aplicar menor privilégio páginas do Creator (janelas e mensagens).
107. Negar acesso por padrão páginas do Creator (scripts e recursos externos).
108. Validar entradas no ponto de entrada páginas do Creator (sessões web).
109. Validar autorização no ponto de uso páginas do Creator (conteúdo comunitário).
110. Limitar tamanho e frequência de operações páginas do Creator (janelas e mensagens).
111. Registrar eventos de segurança sem segredos páginas do Creator (scripts e recursos externos).
112. Proteger logs contra alteração páginas do Creator (sessões web).
113. Definir retenção e descarte páginas do Creator (conteúdo comunitário).
114. Criar testes negativos automatizados páginas do Creator (janelas e mensagens).
115. Testar comportamento em falha de rede páginas do Creator (scripts e recursos externos).
116. Testar concorrência e repetição páginas do Creator (sessões web).
117. Monitorar dependências e vulnerabilidades páginas do Creator (conteúdo comunitário).
118. Revisar configurações antes de release páginas do Creator (janelas e mensagens).
119. Separar desenvolvimento e produção páginas do Creator (scripts e recursos externos).
120. Criar procedimento de revogação páginas do Creator (sessões web).
121. Definir limites de recursos páginas do Creator (conteúdo comunitário).
122. Proteger dados em trânsito e repouso páginas do Creator (janelas e mensagens).
123. Criar rollback verificável páginas do Creator (scripts e recursos externos).
124. Documentar riscos residuais páginas do Creator (sessões web).
125. Revisar o controle após mudanças arquiteturais páginas do Creator (conteúdo comunitário).

## Uploads e arquivos

126. Inventariar os componentes e suas versões imagens (spritesheets).
127. Definir proprietário e responsável operacional imagens (modelos 3D).
128. Classificar dados por sensibilidade imagens (áudio).
129. Documentar fluxos de entrada e saída imagens (pacotes de conteúdo).
130. Desenhar fronteiras de confiança imagens (spritesheets).
131. Aplicar menor privilégio imagens (modelos 3D).
132. Negar acesso por padrão imagens (áudio).
133. Validar entradas no ponto de entrada imagens (pacotes de conteúdo).
134. Validar autorização no ponto de uso imagens (spritesheets).
135. Limitar tamanho e frequência de operações imagens (modelos 3D).
136. Registrar eventos de segurança sem segredos imagens (áudio).
137. Proteger logs contra alteração imagens (pacotes de conteúdo).
138. Definir retenção e descarte imagens (spritesheets).
139. Criar testes negativos automatizados imagens (modelos 3D).
140. Testar comportamento em falha de rede imagens (áudio).
141. Testar concorrência e repetição imagens (pacotes de conteúdo).
142. Monitorar dependências e vulnerabilidades imagens (spritesheets).
143. Revisar configurações antes de release imagens (modelos 3D).
144. Separar desenvolvimento e produção imagens (áudio).
145. Criar procedimento de revogação imagens (pacotes de conteúdo).
146. Definir limites de recursos imagens (spritesheets).
147. Proteger dados em trânsito e repouso imagens (modelos 3D).
148. Criar rollback verificável imagens (áudio).
149. Documentar riscos residuais imagens (pacotes de conteúdo).
150. Revisar o controle após mudanças arquiteturais imagens (spritesheets).

## UGC e moderação

151. Inventariar os componentes e suas versões publicações (comentários).
152. Definir proprietário e responsável operacional publicações (perfis de criadores).
153. Classificar dados por sensibilidade publicações (denúncias).
154. Documentar fluxos de entrada e saída publicações (conteúdo em revisão).
155. Desenhar fronteiras de confiança publicações (comentários).
156. Aplicar menor privilégio publicações (perfis de criadores).
157. Negar acesso por padrão publicações (denúncias).
158. Validar entradas no ponto de entrada publicações (conteúdo em revisão).
159. Validar autorização no ponto de uso publicações (comentários).
160. Limitar tamanho e frequência de operações publicações (perfis de criadores).
161. Registrar eventos de segurança sem segredos publicações (denúncias).
162. Proteger logs contra alteração publicações (conteúdo em revisão).
163. Definir retenção e descarte publicações (comentários).
164. Criar testes negativos automatizados publicações (perfis de criadores).
165. Testar comportamento em falha de rede publicações (denúncias).
166. Testar concorrência e repetição publicações (conteúdo em revisão).
167. Monitorar dependências e vulnerabilidades publicações (comentários).
168. Revisar configurações antes de release publicações (perfis de criadores).
169. Separar desenvolvimento e produção publicações (denúncias).
170. Criar procedimento de revogação publicações (conteúdo em revisão).
171. Definir limites de recursos publicações (comentários).
172. Proteger dados em trânsito e repouso publicações (perfis de criadores).
173. Criar rollback verificável publicações (denúncias).
174. Documentar riscos residuais publicações (conteúdo em revisão).
175. Revisar o controle após mudanças arquiteturais publicações (comentários).

## Mods e plugins

176. Inventariar os componentes e suas versões mods cosméticos (plugins).
177. Definir proprietário e responsável operacional mods cosméticos (scripts futuros).
178. Classificar dados por sensibilidade mods cosméticos (APIs de extensão).
179. Documentar fluxos de entrada e saída mods cosméticos (runtime isolado).
180. Desenhar fronteiras de confiança mods cosméticos (plugins).
181. Aplicar menor privilégio mods cosméticos (scripts futuros).
182. Negar acesso por padrão mods cosméticos (APIs de extensão).
183. Validar entradas no ponto de entrada mods cosméticos (runtime isolado).
184. Validar autorização no ponto de uso mods cosméticos (plugins).
185. Limitar tamanho e frequência de operações mods cosméticos (scripts futuros).
186. Registrar eventos de segurança sem segredos mods cosméticos (APIs de extensão).
187. Proteger logs contra alteração mods cosméticos (runtime isolado).
188. Definir retenção e descarte mods cosméticos (plugins).
189. Criar testes negativos automatizados mods cosméticos (scripts futuros).
190. Testar comportamento em falha de rede mods cosméticos (APIs de extensão).
191. Testar concorrência e repetição mods cosméticos (runtime isolado).
192. Monitorar dependências e vulnerabilidades mods cosméticos (plugins).
193. Revisar configurações antes de release mods cosméticos (scripts futuros).
194. Separar desenvolvimento e produção mods cosméticos (APIs de extensão).
195. Criar procedimento de revogação mods cosméticos (runtime isolado).
196. Definir limites de recursos mods cosméticos (plugins).
197. Proteger dados em trânsito e repouso mods cosméticos (scripts futuros).
198. Criar rollback verificável mods cosméticos (APIs de extensão).
199. Documentar riscos residuais mods cosméticos (runtime isolado).
200. Revisar o controle após mudanças arquiteturais mods cosméticos (plugins).

## API e backend

201. Inventariar os componentes e suas versões endpoints (webhooks).
202. Definir proprietário e responsável operacional endpoints (integrações).
203. Classificar dados por sensibilidade endpoints (consultas).
204. Documentar fluxos de entrada e saída endpoints (tarefas assíncronas).
205. Desenhar fronteiras de confiança endpoints (webhooks).
206. Aplicar menor privilégio endpoints (integrações).
207. Negar acesso por padrão endpoints (consultas).
208. Validar entradas no ponto de entrada endpoints (tarefas assíncronas).
209. Validar autorização no ponto de uso endpoints (webhooks).
210. Limitar tamanho e frequência de operações endpoints (integrações).
211. Registrar eventos de segurança sem segredos endpoints (consultas).
212. Proteger logs contra alteração endpoints (tarefas assíncronas).
213. Definir retenção e descarte endpoints (webhooks).
214. Criar testes negativos automatizados endpoints (integrações).
215. Testar comportamento em falha de rede endpoints (consultas).
216. Testar concorrência e repetição endpoints (tarefas assíncronas).
217. Monitorar dependências e vulnerabilidades endpoints (webhooks).
218. Revisar configurações antes de release endpoints (integrações).
219. Separar desenvolvimento e produção endpoints (consultas).
220. Criar procedimento de revogação endpoints (tarefas assíncronas).
221. Definir limites de recursos endpoints (webhooks).
222. Proteger dados em trânsito e repouso endpoints (integrações).
223. Criar rollback verificável endpoints (consultas).
224. Documentar riscos residuais endpoints (tarefas assíncronas).
225. Revisar o controle após mudanças arquiteturais endpoints (webhooks).

## Dados e armazenamento

226. Inventariar os componentes e suas versões IndexedDB (banco de dados futuro).
227. Definir proprietário e responsável operacional IndexedDB (backups).
228. Classificar dados por sensibilidade IndexedDB (bibliotecas).
229. Documentar fluxos de entrada e saída IndexedDB (arquivos privados).
230. Desenhar fronteiras de confiança IndexedDB (banco de dados futuro).
231. Aplicar menor privilégio IndexedDB (backups).
232. Negar acesso por padrão IndexedDB (bibliotecas).
233. Validar entradas no ponto de entrada IndexedDB (arquivos privados).
234. Validar autorização no ponto de uso IndexedDB (banco de dados futuro).
235. Limitar tamanho e frequência de operações IndexedDB (backups).
236. Registrar eventos de segurança sem segredos IndexedDB (bibliotecas).
237. Proteger logs contra alteração IndexedDB (arquivos privados).
238. Definir retenção e descarte IndexedDB (banco de dados futuro).
239. Criar testes negativos automatizados IndexedDB (backups).
240. Testar comportamento em falha de rede IndexedDB (bibliotecas).
241. Testar concorrência e repetição IndexedDB (arquivos privados).
242. Monitorar dependências e vulnerabilidades IndexedDB (banco de dados futuro).
243. Revisar configurações antes de release IndexedDB (backups).
244. Separar desenvolvimento e produção IndexedDB (bibliotecas).
245. Criar procedimento de revogação IndexedDB (arquivos privados).
246. Definir limites de recursos IndexedDB (banco de dados futuro).
247. Proteger dados em trânsito e repouso IndexedDB (backups).
248. Criar rollback verificável IndexedDB (bibliotecas).
249. Documentar riscos residuais IndexedDB (arquivos privados).
250. Revisar o controle após mudanças arquiteturais IndexedDB (banco de dados futuro).

## Integridade do jogo

251. Inventariar os componentes e suas versões movimento (combate).
252. Definir proprietário e responsável operacional movimento (habilidades).
253. Classificar dados por sensibilidade movimento (partidas).
254. Documentar fluxos de entrada e saída movimento (resultados).
255. Desenhar fronteiras de confiança movimento (combate).
256. Aplicar menor privilégio movimento (habilidades).
257. Negar acesso por padrão movimento (partidas).
258. Validar entradas no ponto de entrada movimento (resultados).
259. Validar autorização no ponto de uso movimento (combate).
260. Limitar tamanho e frequência de operações movimento (habilidades).
261. Registrar eventos de segurança sem segredos movimento (partidas).
262. Proteger logs contra alteração movimento (resultados).
263. Definir retenção e descarte movimento (combate).
264. Criar testes negativos automatizados movimento (habilidades).
265. Testar comportamento em falha de rede movimento (partidas).
266. Testar concorrência e repetição movimento (resultados).
267. Monitorar dependências e vulnerabilidades movimento (combate).
268. Revisar configurações antes de release movimento (habilidades).
269. Separar desenvolvimento e produção movimento (partidas).
270. Criar procedimento de revogação movimento (resultados).
271. Definir limites de recursos movimento (combate).
272. Proteger dados em trânsito e repouso movimento (habilidades).
273. Criar rollback verificável movimento (partidas).
274. Documentar riscos residuais movimento (resultados).
275. Revisar o controle após mudanças arquiteturais movimento (combate).

## Economia e itens

276. Inventariar os componentes e suas versões moedas (compras).
277. Definir proprietário e responsável operacional moedas (crafting).
278. Classificar dados por sensibilidade moedas (trocas).
279. Documentar fluxos de entrada e saída moedas (recompensas).
280. Desenhar fronteiras de confiança moedas (compras).
281. Aplicar menor privilégio moedas (crafting).
282. Negar acesso por padrão moedas (trocas).
283. Validar entradas no ponto de entrada moedas (recompensas).
284. Validar autorização no ponto de uso moedas (compras).
285. Limitar tamanho e frequência de operações moedas (crafting).
286. Registrar eventos de segurança sem segredos moedas (trocas).
287. Proteger logs contra alteração moedas (recompensas).
288. Definir retenção e descarte moedas (compras).
289. Criar testes negativos automatizados moedas (crafting).
290. Testar comportamento em falha de rede moedas (trocas).
291. Testar concorrência e repetição moedas (recompensas).
292. Monitorar dependências e vulnerabilidades moedas (compras).
293. Revisar configurações antes de release moedas (crafting).
294. Separar desenvolvimento e produção moedas (trocas).
295. Criar procedimento de revogação moedas (recompensas).
296. Definir limites de recursos moedas (compras).
297. Proteger dados em trânsito e repouso moedas (crafting).
298. Criar rollback verificável moedas (trocas).
299. Documentar riscos residuais moedas (recompensas).
300. Revisar o controle após mudanças arquiteturais moedas (compras).

## Criação limitada de itens

301. Inventariar os componentes e suas versões armas (roupas).
302. Definir proprietário e responsável operacional armas (armaduras).
303. Classificar dados por sensibilidade armas (acessórios).
304. Documentar fluxos de entrada e saída armas (emblemas).
305. Desenhar fronteiras de confiança armas (roupas).
306. Aplicar menor privilégio armas (armaduras).
307. Negar acesso por padrão armas (acessórios).
308. Validar entradas no ponto de entrada armas (emblemas).
309. Validar autorização no ponto de uso armas (roupas).
310. Limitar tamanho e frequência de operações armas (armaduras).
311. Registrar eventos de segurança sem segredos armas (acessórios).
312. Proteger logs contra alteração armas (emblemas).
313. Definir retenção e descarte armas (roupas).
314. Criar testes negativos automatizados armas (armaduras).
315. Testar comportamento em falha de rede armas (acessórios).
316. Testar concorrência e repetição armas (emblemas).
317. Monitorar dependências e vulnerabilidades armas (roupas).
318. Revisar configurações antes de release armas (armaduras).
319. Separar desenvolvimento e produção armas (acessórios).
320. Criar procedimento de revogação armas (emblemas).
321. Definir limites de recursos armas (roupas).
322. Proteger dados em trânsito e repouso armas (armaduras).
323. Criar rollback verificável armas (acessórios).
324. Documentar riscos residuais armas (emblemas).
325. Revisar o controle após mudanças arquiteturais armas (roupas).

## Cliente e anti-cheat

326. Inventariar os componentes e suas versões HTML (APK).
327. Definir proprietário e responsável operacional HTML (cliente desktop).
328. Classificar dados por sensibilidade HTML (recursos locais).
329. Documentar fluxos de entrada e saída HTML (protocolo de jogo).
330. Desenhar fronteiras de confiança HTML (APK).
331. Aplicar menor privilégio HTML (cliente desktop).
332. Negar acesso por padrão HTML (recursos locais).
333. Validar entradas no ponto de entrada HTML (protocolo de jogo).
334. Validar autorização no ponto de uso HTML (APK).
335. Limitar tamanho e frequência de operações HTML (cliente desktop).
336. Registrar eventos de segurança sem segredos HTML (recursos locais).
337. Proteger logs contra alteração HTML (protocolo de jogo).
338. Definir retenção e descarte HTML (APK).
339. Criar testes negativos automatizados HTML (cliente desktop).
340. Testar comportamento em falha de rede HTML (recursos locais).
341. Testar concorrência e repetição HTML (protocolo de jogo).
342. Monitorar dependências e vulnerabilidades HTML (APK).
343. Revisar configurações antes de release HTML (cliente desktop).
344. Separar desenvolvimento e produção HTML (recursos locais).
345. Criar procedimento de revogação HTML (protocolo de jogo).
346. Definir limites de recursos HTML (APK).
347. Proteger dados em trânsito e repouso HTML (cliente desktop).
348. Criar rollback verificável HTML (recursos locais).
349. Documentar riscos residuais HTML (protocolo de jogo).
350. Revisar o controle após mudanças arquiteturais HTML (APK).

## Infraestrutura

351. Inventariar os componentes e suas versões servidores (runners).
352. Definir proprietário e responsável operacional servidores (storage).
353. Classificar dados por sensibilidade servidores (redes).
354. Documentar fluxos de entrada e saída servidores (painéis administrativos).
355. Desenhar fronteiras de confiança servidores (runners).
356. Aplicar menor privilégio servidores (storage).
357. Negar acesso por padrão servidores (redes).
358. Validar entradas no ponto de entrada servidores (painéis administrativos).
359. Validar autorização no ponto de uso servidores (runners).
360. Limitar tamanho e frequência de operações servidores (storage).
361. Registrar eventos de segurança sem segredos servidores (redes).
362. Proteger logs contra alteração servidores (painéis administrativos).
363. Definir retenção e descarte servidores (runners).
364. Criar testes negativos automatizados servidores (storage).
365. Testar comportamento em falha de rede servidores (redes).
366. Testar concorrência e repetição servidores (painéis administrativos).
367. Monitorar dependências e vulnerabilidades servidores (runners).
368. Revisar configurações antes de release servidores (storage).
369. Separar desenvolvimento e produção servidores (redes).
370. Criar procedimento de revogação servidores (painéis administrativos).
371. Definir limites de recursos servidores (runners).
372. Proteger dados em trânsito e repouso servidores (storage).
373. Criar rollback verificável servidores (redes).
374. Documentar riscos residuais servidores (painéis administrativos).
375. Revisar o controle após mudanças arquiteturais servidores (runners).

## CI/CD e cadeia de suprimentos

376. Inventariar os componentes e suas versões workflows (dependências).
377. Definir proprietário e responsável operacional workflows (builds).
378. Classificar dados por sensibilidade workflows (releases).
379. Documentar fluxos de entrada e saída workflows (segredos).
380. Desenhar fronteiras de confiança workflows (dependências).
381. Aplicar menor privilégio workflows (builds).
382. Negar acesso por padrão workflows (releases).
383. Validar entradas no ponto de entrada workflows (segredos).
384. Validar autorização no ponto de uso workflows (dependências).
385. Limitar tamanho e frequência de operações workflows (builds).
386. Registrar eventos de segurança sem segredos workflows (releases).
387. Proteger logs contra alteração workflows (segredos).
388. Definir retenção e descarte workflows (dependências).
389. Criar testes negativos automatizados workflows (builds).
390. Testar comportamento em falha de rede workflows (releases).
391. Testar concorrência e repetição workflows (segredos).
392. Monitorar dependências e vulnerabilidades workflows (dependências).
393. Revisar configurações antes de release workflows (builds).
394. Separar desenvolvimento e produção workflows (releases).
395. Criar procedimento de revogação workflows (segredos).
396. Definir limites de recursos workflows (dependências).
397. Proteger dados em trânsito e repouso workflows (builds).
398. Criar rollback verificável workflows (releases).
399. Documentar riscos residuais workflows (segredos).
400. Revisar o controle após mudanças arquiteturais workflows (dependências).

## Criptografia e segredos

401. Inventariar os componentes e suas versões chaves (tokens).
402. Definir proprietário e responsável operacional chaves (certificados).
403. Classificar dados por sensibilidade chaves (dados sensíveis).
404. Documentar fluxos de entrada e saída chaves (assinaturas).
405. Desenhar fronteiras de confiança chaves (tokens).
406. Aplicar menor privilégio chaves (certificados).
407. Negar acesso por padrão chaves (dados sensíveis).
408. Validar entradas no ponto de entrada chaves (assinaturas).
409. Validar autorização no ponto de uso chaves (tokens).
410. Limitar tamanho e frequência de operações chaves (certificados).
411. Registrar eventos de segurança sem segredos chaves (dados sensíveis).
412. Proteger logs contra alteração chaves (assinaturas).
413. Definir retenção e descarte chaves (tokens).
414. Criar testes negativos automatizados chaves (certificados).
415. Testar comportamento em falha de rede chaves (dados sensíveis).
416. Testar concorrência e repetição chaves (assinaturas).
417. Monitorar dependências e vulnerabilidades chaves (tokens).
418. Revisar configurações antes de release chaves (certificados).
419. Separar desenvolvimento e produção chaves (dados sensíveis).
420. Criar procedimento de revogação chaves (assinaturas).
421. Definir limites de recursos chaves (tokens).
422. Proteger dados em trânsito e repouso chaves (certificados).
423. Criar rollback verificável chaves (dados sensíveis).
424. Documentar riscos residuais chaves (assinaturas).
425. Revisar o controle após mudanças arquiteturais chaves (tokens).

## Privacidade

426. Inventariar os componentes e suas versões perfis (telemetria).
427. Definir proprietário e responsável operacional perfis (arquivos enviados).
428. Classificar dados por sensibilidade perfis (dados de menores).
429. Documentar fluxos de entrada e saída perfis (solicitações de titulares).
430. Desenhar fronteiras de confiança perfis (telemetria).
431. Aplicar menor privilégio perfis (arquivos enviados).
432. Negar acesso por padrão perfis (dados de menores).
433. Validar entradas no ponto de entrada perfis (solicitações de titulares).
434. Validar autorização no ponto de uso perfis (telemetria).
435. Limitar tamanho e frequência de operações perfis (arquivos enviados).
436. Registrar eventos de segurança sem segredos perfis (dados de menores).
437. Proteger logs contra alteração perfis (solicitações de titulares).
438. Definir retenção e descarte perfis (telemetria).
439. Criar testes negativos automatizados perfis (arquivos enviados).
440. Testar comportamento em falha de rede perfis (dados de menores).
441. Testar concorrência e repetição perfis (solicitações de titulares).
442. Monitorar dependências e vulnerabilidades perfis (telemetria).
443. Revisar configurações antes de release perfis (arquivos enviados).
444. Separar desenvolvimento e produção perfis (dados de menores).
445. Criar procedimento de revogação perfis (solicitações de titulares).
446. Definir limites de recursos perfis (telemetria).
447. Proteger dados em trânsito e repouso perfis (arquivos enviados).
448. Criar rollback verificável perfis (dados de menores).
449. Documentar riscos residuais perfis (solicitações de titulares).
450. Revisar o controle após mudanças arquiteturais perfis (telemetria).

## Detecção e resposta

451. Inventariar os componentes e suas versões logs (alertas).
452. Definir proprietário e responsável operacional logs (incidentes).
453. Classificar dados por sensibilidade logs (evidências).
454. Documentar fluxos de entrada e saída logs (recuperação).
455. Desenhar fronteiras de confiança logs (alertas).
456. Aplicar menor privilégio logs (incidentes).
457. Negar acesso por padrão logs (evidências).
458. Validar entradas no ponto de entrada logs (recuperação).
459. Validar autorização no ponto de uso logs (alertas).
460. Limitar tamanho e frequência de operações logs (incidentes).
461. Registrar eventos de segurança sem segredos logs (evidências).
462. Proteger logs contra alteração logs (recuperação).
463. Definir retenção e descarte logs (alertas).
464. Criar testes negativos automatizados logs (incidentes).
465. Testar comportamento em falha de rede logs (evidências).
466. Testar concorrência e repetição logs (recuperação).
467. Monitorar dependências e vulnerabilidades logs (alertas).
468. Revisar configurações antes de release logs (incidentes).
469. Separar desenvolvimento e produção logs (evidências).
470. Criar procedimento de revogação logs (recuperação).
471. Definir limites de recursos logs (alertas).
472. Proteger dados em trânsito e repouso logs (incidentes).
473. Criar rollback verificável logs (evidências).
474. Documentar riscos residuais logs (recuperação).
475. Revisar o controle após mudanças arquiteturais logs (alertas).

## Testes e governança

476. Inventariar os componentes e suas versões código (APIs).
477. Definir proprietário e responsável operacional código (conteúdo comunitário).
478. Classificar dados por sensibilidade código (releases).
479. Documentar fluxos de entrada e saída código (processos de moderação).
480. Desenhar fronteiras de confiança código (APIs).
481. Aplicar menor privilégio código (conteúdo comunitário).
482. Negar acesso por padrão código (releases).
483. Validar entradas no ponto de entrada código (processos de moderação).
484. Validar autorização no ponto de uso código (APIs).
485. Limitar tamanho e frequência de operações código (conteúdo comunitário).
486. Registrar eventos de segurança sem segredos código (releases).
487. Proteger logs contra alteração código (processos de moderação).
488. Definir retenção e descarte código (APIs).
489. Criar testes negativos automatizados código (conteúdo comunitário).
490. Testar comportamento em falha de rede código (releases).
491. Testar concorrência e repetição código (processos de moderação).
492. Monitorar dependências e vulnerabilidades código (APIs).
493. Revisar configurações antes de release código (conteúdo comunitário).
494. Separar desenvolvimento e produção código (releases).
495. Criar procedimento de revogação código (processos de moderação).
496. Definir limites de recursos código (APIs).
497. Proteger dados em trânsito e repouso código (conteúdo comunitário).
498. Criar rollback verificável código (releases).
499. Documentar riscos residuais código (processos de moderação).
500. Revisar o controle após mudanças arquiteturais código (APIs).

## Como transformar o catálogo em trabalho executável

Para cada controle, registrar: ID, aplicabilidade, risco, prioridade, estado, responsável, componente/arquivo, evidência, teste, data e risco residual. Estados permitidos: não iniciado, em andamento, implementado, verificado, não aplicável justificado ou risco aceito com aprovação. “Implementado” não significa “verificado”.

## Referências consultadas

- OWASP ASVS 5.0.0: https://asvs.owasp.org/ — requisitos verificáveis de segurança para aplicações web.
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html — validação de arquivos, armazenamento, quotas e defesa em profundidade.
- OWASP HTML5 Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html — sandbox e validação de mensagens entre janelas.
- OWASP CSP Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html — mitigação de XSS com CSP.
- OWASP Authorization Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html — menor privilégio e deny-by-default.
- OWASP API Security Top 10 2023: https://api-security.owasp.org/editions/2023/en/0x11-t10/ — BOLA, autenticação, autorização, consumo de recursos e configuração.
- OWASP Logging Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html — logs de segurança, proteção e monitoramento.
- NIST SP 800-218 SSDF: https://csrc.nist.gov/pubs/sp/800/218/final — desenvolvimento seguro no ciclo de vida.
- CISA Secure by Design: https://www.cisa.gov/sites/default/files/2023-10/Shifting-the-Balance-of-Cybersecurity-Risk-Principles-and-Approaches-for-Secure-by-Design-Software.pdf — responsabilidade do fabricante e configurações seguras por padrão.

**Nota de pesquisa:** os padrões servem como base, mas o catálogo deve ser adaptado à arquitetura real. Backend online, multiplayer, pagamentos e distribuição de mods ainda exigem especificações e auditorias próprias.
