# AURELIA RESORT

Site estático demonstrativo de um resort cinco estrelas fictício no Mediterrâneo. O projeto reúne **nove páginas**, com conteúdo em português brasileiro, HTML semântico, CSS e JavaScript puro. As animações utilizam GSAP 3.15.1 e ScrollTrigger, armazenados localmente. Não há etapa de compilação nem instalação de pacotes para publicação.

## Páginas

| Arquivo | Conteúdo atual |
| --- | --- |
| `index.html` | Página inicial com capa fotográfica e coleções horizontais de suítes e experiências. |
| `suites.html` | Catálogo completo das três suítes, em painéis horizontais com fotos, descrições, comodidades, capacidades, tarifas e links de seleção. |
| `experiences.html` | Seis experiências em Gastronomia, Bem-estar e Descoberta, com fotografias distintas e grade de duas colunas no desktop e uma no celular. |
| `reservations.html` | Formulário funcional de seleção demonstrativa da estadia. |
| `checkout.html` | Revisão interna da seleção válida, com dados e subtotal ilustrativo. |
| `my-reservations.html` | Consulta e gestão desativadas, com um registro fictício de exemplo. |
| `contact.html` | Composição fotográfica com formulário sobreposto, contatos fictícios e envio desativado. |
| `administration.html` | Painel ilustrativo com indicadores, tabelas e controles administrativos desativados. |
| `photography.html` | Apresentação das fontes, autorias e licenças das imagens. |

Todas as informações das acomodações estão em `suites.html`. A antiga página separada de detalhes foi removida.

## Navegação e apresentação

O cabeçalho reúne Início, Suítes, Experiências, Reservas e Contato. Todos os links seguem o mesmo padrão visual, com um único sublinhado para a página ativa. O ícone de perfil abre Minhas reservas e Administração. No celular, a navegação principal utiliza um botão de menu. Os menus aceitam teclado e fechamento com Escape.

O rodapé contém apenas a marca, Reservas, Contato e copyright. A página de créditos permanece disponível diretamente em `photography.html`.

A identidade combina marfim, areia, oliva, carvão e detalhes dourados, com fontes disponíveis no dispositivo. Cada página possui uma composição própria. As regras responsivas adaptam espaçamentos, tipografia, formulários, imagens e grades a tablets e celulares. Tabelas largas têm rolagem própria.

## Recursos demonstrativos funcionais

- Seleção prévia da categoria pelos links das suítes.
- Seletores independentes de dia, mês e ano, sem opções de placeholder. Datas passadas e dias inexistentes ficam indisponíveis. O limite considera a data local e é atualizado à meia-noite e ao retornar à aba.
- Validação de entrada a partir de hoje, saída posterior à entrada e anos bissextos.
- Opções de hóspedes ajustadas à capacidade total da suíte, com pelo menos um adulto. A suíte para quatro hóspedes permite um adulto e três crianças.
- Armazenamento da seleção no `sessionStorage` da aba e encaminhamento ao checkout. A seleção expira em 24 horas ou quando a entrada passa para uma data anterior ao dia atual.
- Validação da seleção antes de exibir o checkout, com redirecionamento para Reservas quando necessário. A revisão também revalida a sessão durante sua permanência aberta e no retorno pelo histórico.
- Exibição de suíte, datas, ocupação, diárias, tarifa e subtotal calculado. Impostos, taxas e serviços opcionais ficam fora desse subtotal. O total final permanece a definir.

| Suíte | Capacidade total | Diária ilustrativa a partir de |
| --- | --- | --- |
| Suíte Terraço do Mar | 2 hóspedes | US$ 850 |
| Suíte Piscina Privativa | 3 hóspedes | US$ 1.250 |
| Residência Exclusiva Aurelia | 4 hóspedes | US$ 2.400 |

## Recursos ilustrativos ou desativados

Não há consulta de disponibilidade real, confirmação de reserva, pagamentos ou serviços de backend. Os campos pessoais e a confirmação do checkout permanecem desativados.

Minhas reservas e Administração exibem o registro fictício `DEMO-0001`. Não existe histórico de reservas confirmadas, autenticação, gestão de registros ou sincronização administrativa. O formulário de Contato não envia mensagens. Seus contatos usam o domínio reservado `.example` e não atendem hóspedes.

A seleção de estadia é o único dado persistido pelo fluxo demonstrativo. Se o armazenamento de sessão estiver bloqueado, o formulário informa a falha e impede o avanço.

## Carrosséis e animações

Os carrosséis oferecem setas com deslizamento suave, barra de rolagem, arraste com o mouse e gestos de toque. As regiões focáveis aceitam as setas do teclado, Home e End. No catálogo de suítes, um gesto de roda ou trackpad solicita a próxima suíte ou a anterior, com controle dos eventos de inércia e de transições simultâneas. Os três painéis têm dimensões uniformes e fotografias com `object-fit: cover`.

GSAP e ScrollTrigger animam a capa inicial, revelações de conteúdo, máscaras fotográficas, formulários e transições entre páginas. As experiências recebem parallax discreto em dispositivos sem toque. **O carrossel de suítes não recebe efeitos cinematográficos GSAP**. Seu deslizamento usa a rolagem do navegador.

A camada respeita `prefers-reduced-motion`, possui recuperação caso as bibliotecas não carreguem e restaura a visibilidade ao voltar pelo histórico. Não há reprodução automática dos carrosséis.

## Arquivos e imagens

- `assets/css/` reúne os estilos compartilhados, ajustes responsivos e estilos específicos de páginas.
- `assets/js/main.js` controla menus e carrosséis. `stay.js`, `reservation.js` e `checkout.js` tratam a seleção e sua revisão. Os arquivos `motion.js` e `motion-bootstrap.js` implementam a camada de animação.
- `assets/vendor/gsap/` contém GSAP e ScrollTrigger, com avisos de licença e origem em `SOURCE.md`.
- `assets/images/` contém fotografias WebP locais com versões responsivas. O hero tem carregamento prioritário e as demais imagens usam carregamento adiado.

As fotografias ilustram locais reais. Fontes e licenças estão em [photography.html](photography.html), [PHOTOGRAPHY.md](PHOTOGRAPHY.md) e `assets/images/credits.json`. As páginas carregam imagens e bibliotecas localmente, sem depender de CDN durante a navegação.

## Publicação no GitHub Pages

Publique o conteúdo desta pasta na raiz do repositório ou na pasta `docs`, configurando a origem correspondente no GitHub Pages. Os caminhos são relativos e o arquivo `.nojekyll` mantém a publicação estática. Não são necessárias variáveis de ambiente ou configuração de backend. JavaScript e armazenamento de sessão são necessários para o fluxo de seleção e revisão da estadia.

Cabeçalho e rodapé estão presentes em cada HTML. Alterações compartilhadas nesses elementos devem ser aplicadas às nove páginas.

## Validação

A auditoria anterior incluiu análise estática de referências locais e verificações isoladas de lógica em Node.js para datas, ocupação, tarifas, sessão e passagem de dados ao checkout. A validação visual e das interações reais em desktop, tablet e celular depende de teste manual do responsável. O site não foi aberto ou pré-visualizado em navegador durante o desenvolvimento assistido.
