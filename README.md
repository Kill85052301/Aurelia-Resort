# AURELIA RESORT

Site demonstrativo de um resort cinco estrelas fictício no Mediterrâneo. As oito páginas usam HTML semântico, CSS compartilhado e JavaScript puro. Não há dependências, fontes externas ou etapa de compilação. As fotografias são arquivos WebP locais.

## Páginas

- `index.html` — Início
- `suites.html` — Suítes
- `experiences.html` — Experiências, organizadas em um atlas horizontal
- `reservations.html` — Seleção demonstrativa da estadia
- `checkout.html` — Revisão interna da estadia selecionada
- `my-reservations.html` — Estrutura de consulta de reservas, ainda desativada
- `contact.html` — Contatos fictícios e formulário desativado
- `administration.html` — Administração demonstrativa, sem acesso a operações reais

Cada documento contém seu próprio cabeçalho e rodapé. Alterações na navegação compartilhada devem ser reproduzidas nas oito páginas. O checkout não aparece nos menus nem no rodapé.

## Idioma e identidade visual

Conteúdo, títulos, descrições, rótulos acessíveis e mensagens estão em português brasileiro, com `lang="pt-BR"`. A identidade combina marfim, areia, oliva, carvão e detalhes dourados, com tipografia disponível localmente. As fotografias ilustrativas acompanham os elementos arquitetônicos em CSS, sem animações.

A página inicial usa uma composição de revista com narrativas paralelas e coleções laterais. Suítes apresenta fichas panorâmicas e uma coluna de comodidades. Experiências reúne três capítulos em uma única área horizontal. As demais páginas possuem composições próprias, com sobreposições, painéis laterais, ficha de estadia e área de trabalho administrativa. Os layouts se adaptam a telas menores.

## Exploração horizontal e navegação

O cabeçalho tem logotipo, textos e áreas de navegação ampliados. O arquivo compartilhado `assets/css/refinements.css` alinha cabeçalho, conteúdo e rodapé à mesma largura e reúne os ajustes de espaçamento de cartões, colunas e formulários nas oito páginas. As composições editoriais e as coleções horizontais são preservadas.

As coleções podem ser exploradas com setas, roda do mouse, rolagem horizontal do trackpad, arraste com o mouse e gestos de toque. Ao alcançar uma borda, a roda vertical volta a movimentar a página. Os links preservam suas ações. As regiões focáveis também aceitam as teclas de seta, Home e End. Não há reprodução automática. A coleção consolidada de suítes permite rolagem horizontal suave, respeitando a preferência por movimento reduzido; as outras coleções mantêm seu comportamento anterior.

Sem JavaScript, os menus e a rolagem nativa continuam disponíveis. Com JavaScript, o menu móvel pode ser aberto pelo botão e fechado com Escape. Tabelas largas têm uma região própria de rolagem.

## Fluxo demonstrativo da estadia

1. O visitante escolhe uma suíte, entrada, saída e ocupação em Reservas. As duas datas usam seletores independentes de dia, mês e ano, com listas nativas roláveis. Os links de seleção nas suítes podem preencher a categoria antecipadamente.
2. `stay.js` valida a categoria, datas reais de calendário, entrada a partir de hoje, saída posterior à entrada, ao menos um adulto e a capacidade total da suíte, incluindo crianças.
3. `reservation.js` guarda somente essa seleção no `sessionStorage` da aba e encaminha para a revisão. A seleção expira após 24 horas e também deixa de ser válida quando sua entrada fica no passado. Nenhum dado pessoal é guardado.
4. `checkout.html` valida a seleção antes de revelar o conteúdo. Sem uma seleção válida, redireciona para Reservas. Com JavaScript desativado, também redireciona para Reservas.
5. `checkout.js` exibe suíte, entrada, saída, hóspedes, número de diárias, valor por diária e subtotal ilustrativo em dólares americanos. A conferência se repete ao recuperar a página pelo histórico ou voltar à aba.

Impostos, taxas e serviços opcionais não entram no subtotal. O total final não é calculado. Os dados pessoais e a confirmação permanecem desativados: não há reserva real, cobrança, pagamento ou integração externa.

Os seletores de data são preenchidos uma única vez e mantêm seus próprios valores. Mudar a saída não altera a entrada; trocar suíte ou ocupação não reconstrói nenhuma das datas. Os dias disponíveis respeitam o mês e os anos bissextos. Se uma mudança de mês ou ano tornar o dia impossível, somente o dia daquela data é desmarcado, com orientação em português. Uma saída anterior ou igual à entrada é sinalizada sem apagar os valores. A validação final continua em `stay.js`, antes de salvar a seleção ou acessar a revisão.

A validação do checkout funciona no navegador e organiza o fluxo de um site estático; não substitui autenticação ou validação em servidor. Não existem dados protegidos nessa página demonstrativa. Se o armazenamento de sessão estiver indisponível, a seleção fica na página de Reservas e uma mensagem orienta o visitante.

## Conteúdo fictício e limites

Localização, acomodações, preços, comodidades e contatos são ilustrativos. O e-mail usa o domínio reservado `.example` e não é um canal ativo. A consulta de reservas, o formulário de contato e a administração continuam sem envio ou operações reais. A administração é pública e contém somente exemplos; autenticação e permissões serão necessárias antes de qualquer uso operacional.

## GitHub Pages

Publique o conteúdo desta pasta na raiz de um repositório do GitHub Pages ou copie para a pasta `docs` e selecione essa origem de publicação. Todos os caminhos internos são relativos, compatíveis com sites de usuário e de projeto. O arquivo `.nojekyll` mantém a publicação estática. Não são necessários servidor, variáveis de ambiente ou instalação de pacotes.

## Restrições de execução

Por solicitação do responsável, o site não foi aberto, iniciado, pré-visualizado ou acessado em navegador. Nenhum teste automatizado ou de navegador foi executado. A validação prática será realizada pelo responsável pelo projeto.

## Fotografia

O hero usa uma imagem de piscina com vista para o Mediterrâneo. Cada categoria de suíte tem uma fotografia distinta, usada de forma consistente no catálogo completo e no resumo da estadia. Gastronomia, spa e passeios costeiros também recebem imagens nos capítulos e carrosséis. Contato e páginas de serviço usam imagens discretas.

As fontes e condições estão em [PHOTOGRAPHY.md](PHOTOGRAPHY.md), com registro técnico em `assets/images/credits.json`. As imagens são ilustrativas, de locais reais, sem associação com o resort fictício. Arquivos locais em WebP usam `srcset` de 640/1280 pixels e 1920 no hero; `object-fit: cover` evita distorção e dimensões reservadas reduzem mudanças de layout. Apenas o hero é prioritário; as demais imagens usam carregamento adiado e decodificação assíncrona. Não existem URLs remotas de imagem em tempo de navegação.

As fotografias foram baixadas das fontes; o site não foi aberto, iniciado, pré-visualizado ou testado em navegador.

## Catálogo consolidado

A página separada de detalhes foi removida. `suites.html` reúne exatamente as três suítes existentes em painéis horizontais completos, com fotos, descrições, comodidades, ocupação, tarifas e links para a seleção da estadia. A rolagem suave se aplica somente a essa coleção e respeita a preferência por movimento reduzido. Os links internos do site agora apontam para as âncoras das suítes no catálogo.

## Edição de conteúdo e composições

Os textos foram condensados, mantendo informações essenciais, condições demonstrativas, tarifas e comodidades. O rodapé compartilhado contém apenas marca, Reservas, Contato, créditos das imagens e copyright.

A página inicial mantém a capa fotográfica; Suítes conserva seus três painéis horizontais completos; Experiências mantém seis cartões em três categorias. Reservas concentra a seleção da estadia em um formulário central. Contato usa uma fotografia panorâmica e uma folha de mensagem sobreposta, com os contatos e a nota de chegada ao lado. Minhas reservas organiza consulta e bilhete em paralelo; a revisão apresenta um recibo lateral; Administração usa uma abertura compacta e indicadores em faixa.

O acabamento específico está em `assets/css/editorial-cleanup.css`. Nenhum script de reserva, regra de datas, limite de hóspedes, armazenamento de seleção ou comportamento de checkout foi modificado nesta edição. Os formulários demonstrativos permanecem desativados onde já estavam. Não foram executados testes nem acessos ao site em navegador.

## Camada de movimento

GSAP 3.15.1 e ScrollTrigger estão em `assets/vendor/gsap`, com cabeçalhos de licença preservados e origem em `SOURCE.md`. As páginas carregam esses arquivos localmente; não há requisições de CDN durante a navegação.

`motion.js` adiciona entrada de capa com zoom discreto e máscaras, revelações únicas por ScrollTrigger, apresentações internas dos painéis de suíte, máscaras e parallax leve nas experiências, entradas de formulários e feedback de foco. Transições curtas entre páginas preservam URLs, parâmetros, âncoras, downloads e cliques com modificadores. O movimento não altera dimensões de cartões, imagens ou grades, nem controla a rolagem nativa.

`prefers-reduced-motion` desativa essa camada e reverte os estilos de animação quando a preferência muda. O bootstrap evita exibir um estado inicial incorreto e libera o conteúdo após 1,2 segundo caso os arquivos não carreguem; nesse caso não inicia animações atrasadas. O retorno pelo histórico restaura a visibilidade. Não há repetição automática de entradas ao rolar, texto dividido em elementos extras, pinagem ou reprodução automática dos carrosséis. A lógica de reservas permanece nos módulos originais, sem alterações.

Esta implementação não foi aberta, iniciada, pré-visualizada ou testada em navegador, por solicitação do responsável.
