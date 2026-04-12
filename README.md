# AV1 — Revisão final (checklist x PDF)

Referência: especificação `projeto_av1.pdf`. Projeto: front-end apenas (HTML/CSS/JS), marcação `lang="pt-BR"`, identificadores de código em inglês, textos de interface em português.

## Página 1 — Apresentação (`index.html`)

| Requisito | Status |
|-----------|--------|
| Header com imagem de logo | OK — marca Arrecifes Tecnologia |
| Frase de apresentação | OK — tagline |
| Links: Login, Cadastro; terceiro (serviços) só se logado | OK — `layout.js` + classe `is-hidden` |
| Texto breve história | OK — conteúdo institucional preenchido |
| Vídeo YouTube em streaming (~1 min sugerido no PDF) | OK — iframe (substituir URL pelo institucional) |
| Galeria ≥ 4 fotos | OK — imagens ilustrativas com descrições coerentes |
| Seção livre serviços de TI (estático, sem vídeo) | OK — cards + grid |
| Tabela 3 fundadores (cargo, nome, CV) | OK |
| Footer: lista 3 contatos (fixo, zap, mailto) | OK |
| Endereço em texto | OK |
| Figuras formas de pagamento | OK — PIX, cartão e boleto |
| HTML: sem tags de estilo deprecated, blocos semânticos | OK |
| Texto diferenciado do padrão | OK — `<mark>` no intro |
| Tabela como parte do layout | OK — `table.layout-table` |
| CSS: tipos de seletores, acumulação, sobrescrita, arquivo + `<style>` + inline moderado | OK — comentários em `base.css`, `<style>` no `index`, `style=""` pontual |
| Fontes diferentes títulos × parágrafos | OK — variables |
| Alinhamento | OK — flex no header / grid |
| Rolagem automática em conteúdo longo | OK — `.scroll-panel` |
| Flex ou Grid em parte do layout | OK — `.layout-grid`, `.gallery`, etc. |

## Página 2 — Login (`login.html` + `login.js`)

| Requisito | Status |
|-----------|--------|
| Identificação “Login de clientes” | OK |
| Logo | OK — marca Arrecifes Tecnologia |
| Link troca de senha | OK |
| Campos login e senha | OK |
| Botões Realizar Login e Limpar | OK |
| Link cadastro | OK |
| Validações JS e-mail e senha preenchida | OK |
| Mensagens de erro + alert de sucesso | OK |
| Navegação para página de conteúdo após sucesso | OK — `index.html` |
| Limpar + foco no login | OK |
| Sessão mock | OK — `sessionStorage` em `auth-session.js` |

## Página 3 — Troca de senha (`change-password.html` + `change-password.js` + `password-validation.js`)

| Requisito | Status |
|-----------|--------|
| Título “Troca de senha de clientes” | OK |
| Logo | OK |
| Campos login, senha, confirmação | OK |
| Campo/área com regras e listas de caracteres | OK — `output` + HTML |
| Botões Troca Senha e Limpar | OK |
| Validações conforme PDF | OK |
| Sucesso → volta | OK — `history.back()` ou `login.html` |
| Atualização mock em `localStorage` se cadastro existir | OK |

## Página 4 — Cadastro (`register.html` + `register.js`)

| Requisito | Status |
|-----------|--------|
| Título “Cadastro de clientes” | OK |
| Campos e opções conforme PDF (radio default solteiro, select default 2º grau) | OK |
| Opções escolaridade exatamente como no PDF | OK — inclusive “nível superior” e “pós-graduado” em minúsculas |
| Validações nome, CPF com máscara e DV, data, idade ≥18, telefone opcional BR | OK |
| Regras de senha iguais à troca de senha | OK |
| Incluir / Limpar / Voltar | OK |
| Persistência local de usuário | OK — `localStorage` (senha em texto: **apenas protótipo acadêmico**) |

## Página 5 — Solicitações (`services.html` + `services.js`)

| Requisito | Status |
|-----------|--------|
| Uma página, várias seções | OK |
| Seção com nome e e-mail do usuário | OK — sessão + fallback texto fixo |
| Tabela pedidos com colunas obrigatórias | OK |
| Ordem crescente por data do pedido | OK |
| Linhas iniciais de exemplo | OK — seed ao primeiro acesso |
| Excluir linha funcional | OK |
| Combo serviços, preço e prazo por serviço | OK |
| Data prevista = hoje + prazo; status inicial “EM ELABORAÇÃO” | OK |
| Botão incluir na tabela | OK |
| Persistência mock | OK — `localStorage` por e-mail |

## Navegação e acesso (Step 8)

| Requisito | Status |
|-----------|--------|
| Links entre páginas | OK |
| Terceiro link só após login | OK |
| Página de serviços restrita a usuário logado | OK — redireciona para `login.html` |

## Simplificações / observações

- **Segurança:** autenticação e senhas funcionam apenas no navegador; não usar em produção.
- **Vídeo YouTube:** está como exemplo; trocar pelo vídeo institucional final.
- **Login sem cadastro prévio:** ainda passa na validação do PDF; sessão é criada com nome derivado do e-mail — fluxo completo recomendado: cadastrar → login com mesma senha.
- **`history.back()`:** em Cadastro/Troca depende do histórico do navegador; há fallback na troca para `login.html` quando não há histórico.
- **`String.prototype.padStart` / `Array.prototype.find`:** exige navegador relativamente atual (adequado para entrega acadêmica).
