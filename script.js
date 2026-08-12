/**
 * TOLEDO ADVOCACIA ESPECIALIZADA — DRA. PAOLA TOLEDO
 * Modern Interactive JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTimelineProgress();
  initPracticeModals();
  initPracticeFilters();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Header Scroll Glassmorphism & Active Navigation
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      mobileMenu.classList.remove('active');
      mobileMenu.classList.add('hidden');
      mobileBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => mobileMenu.classList.add('active'), 10);
      mobileBtn.setAttribute('aria-expanded', 'true');
    }
  };

  mobileBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenu.classList.add('hidden');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => {
      el.classList.add('visible');
      el.classList.add('active');
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.05,
    rootMargin: '50px 0px 50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Fallback trigger for elements already in view on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        el.classList.add('visible');
        el.classList.add('active');
      }
    });
  }, 100);
}

/* ==========================================================================
   4. Credibility Counter Animation
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const startCounting = () => {
    counters.forEach(counter => {
      const targetStr = counter.getAttribute('data-target');
      if (!targetStr) return;
      const numericTarget = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
      const prefix = targetStr.startsWith('+') ? '+' : '';
      const suffix = targetStr.endsWith('h') ? 'h' : (targetStr.endsWith('+') && !targetStr.startsWith('+') ? '+' : '');

      if (isNaN(numericTarget)) {
        counter.textContent = targetStr;
        return;
      }

      let frame = 0;
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easeOutProgress = progress * (2 - progress);
        const currentVal = numericTarget * easeOutProgress;

        counter.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;

        if (frame >= totalFrames) {
          counter.textContent = targetStr;
          clearInterval(timer);
        }
      }, frameDuration);
    });
  };

  const counterSection = document.getElementById('credibilidade');
  if (!counterSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        startCounting();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(counterSection);
}

/* ==========================================================================
   5. Interactive Timeline Progress Bar
   ========================================================================== */
function initTimelineProgress() {
  const timelineSection = document.getElementById('processo');
  const progressLineDesktop = document.querySelector('.timeline-progress');
  const progressLineMobile = document.querySelector('.timeline-vertical-progress');
  const stepNodes = document.querySelectorAll('.timeline-step');

  if (!timelineSection) return;

  const updateProgress = () => {
    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalScrollable = rect.height + windowHeight;
      const currentScroll = windowHeight - rect.top;
      const progressPercent = Math.min(Math.max((currentScroll / totalScrollable) * 100, 0), 100);

      if (progressLineDesktop) progressLineDesktop.style.width = `${progressPercent}%`;
      if (progressLineMobile) progressLineMobile.style.height = `${progressPercent}%`;

      stepNodes.forEach((step, index) => {
        const threshold = ((index + 1) / stepNodes.length) * 80;
        if (progressPercent >= threshold) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
}

/* ==========================================================================
   6. Practice Areas Detail Modals (All 22 Areas from Original Site)
   ========================================================================== */
function initPracticeModals() {
  const modalBackdrop = document.getElementById('practice-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const practiceButtons = document.querySelectorAll('.practice-detail-btn');

  const practiceData = {
    // ---------------- CRIMINAL (14 ITEMS) ----------------
    delegacias: {
      title: 'Atuação em Delegacias',
      content: `
        <p class="text-gray-300 mb-4">Acompanhamento presencial imediato em delegacias de polícia civil e federal para garantir que nenhum direito constitucional seja violado durante inquéritos policiais, depoimentos ou autos de prisão em flagrante.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Presença imediata no auto de prisão em flagrante.</li>
          <li>Acompanhamento presencial em oitivas e interrogatórios.</li>
          <li>Acesso aos autos de inquérito e elaboração de petições preventivas.</li>
        </ul>
      `
    },
    custodia: {
      title: 'Audiência de Custódia',
      content: `
        <p class="text-gray-300 mb-4">Atuação urgente presencial perante o juiz de custódia nas primeiras 24h da prisão para pleitear a liberdade provisória ou o relaxamento da prisão ilegal.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Sustentação oral imediata para liberação do acusado sem fiança.</li>
          <li>Demonstração de requisitos para concessão de medidas cautelares alternativas.</li>
          <li>Denúncia e constatação de eventuais abusos ou ilicitudes na prisão.</li>
        </ul>
      `
    },
    habeascorpus: {
      title: 'Habeas Corpus',
      content: `
        <p class="text-gray-300 mb-4">Impetração de medidas urgentes de Habeas Corpus perante os Tribunais de Justiça (TJSP), Superior Tribunal de Justiça (STJ) e Supremo Tribunal Federal (STF).</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Combate ao excesso de prazo e prisões preventivas desnecessárias.</li>
          <li>Pedido de liminar urgente para imediata expedição de alvará de soltura.</li>
          <li>Sustentação oral presencial perante os colegiados de desembargadores e ministros.</li>
        </ul>
      `
    },
    defesapenal: {
      title: 'Defesa em Processos Penais',
      content: `
        <p class="text-gray-300 mb-4">Representação técnica e incansável em todas as fases da ação penal, desde a Resposta à Acusação até alegações finais e recursos superiores.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Elaboração de Resposta à Acusação com arguição de nulidades.</li>
          <li>Produção minuciosa de provas e inquirição estratégica de testemunhas.</li>
          <li>Recursos de Apelação, Recurso em Sentido Estrito e Recursos Especiais/Extraordinários.</li>
        </ul>
      `
    },
    acusacao: {
      title: 'Assistente de Acusação',
      content: `
        <p class="text-gray-300 mb-4">Atuação firme na defesa dos direitos das vítimas e seus familiares no processo criminal para garantir que a justiça seja feita com o devido rigor legal.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Habilitação formal como assistente do Ministério Público na ação penal.</li>
          <li>Requerimento de diligências e produção de provas acusatórias.</li>
          <li>Fixação de indenização mínima pelos danos sofridos pela vítima.</li>
        </ul>
      `
    },
    execucao: {
      title: 'Execução da Pena',
      content: `
        <p class="text-gray-300 mb-4">Acompanhamento contínuo do cumprimento da pena para assegurar a aplicação correta da lei e o alcance dos benefícios no menor tempo possível.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Acompanhamento de condenações e cálculo atuarial de penas.</li>
          <li>Remição de pena por trabalho e estudo.</li>
          <li>Unificação e adequação de regimes prisionais.</li>
        </ul>
      `
    },
    progressao: {
      title: 'Progressão de Pena & Benefícios',
      content: `
        <p class="text-gray-300 mb-4">Pedidos estratégicos para conquista dos benefícios legais previstos na Lei de Execução Penal.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Progressão de regime (Fechado -> Semiaberto -> Aberto).</li>
          <li>Livramento Condicional e Saídas Temporárias.</li>
          <li>Pedidos de Indulto Presidencial e Comutação de Pena.</li>
        </ul>
      `
    },
    juri: {
      title: 'Tribunal do Júri',
      content: `
        <p class="text-gray-300 mb-4">Atuação especializada e de altíssimo impacto na defesa de acusados por crimes dolosos contra a vida (homicídios e tentativas).</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Defesa na 1ª fase (Sumário da Acusação) visando impronúncia ou desclassificação.</li>
          <li>Oratória persuasiva e defesa plenária perante o Conselho de Sentença.</li>
          <li>Análise técnica de laudos periciais e reconstrução dos fatos.</li>
        </ul>
      `
    },
    honra: {
      title: 'Crimes Contra a Honra',
      content: `
        <p class="text-gray-300 mb-4">Defesa e proposição de Queixas-Crime relacionadas aos delitos de Calúnia, Injúria e Difamação no ambiente presencial e digital.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Elaboração e oferecimento de Queixa-Crime.</li>
          <li>Defesa técnica em acusações por superexposição em redes sociais.</li>
          <li>Retratação e conciliação perante os Juizados Especiais Criminais.</li>
        </ul>
      `
    },
    mariadapenha: {
      title: 'Lei Maria da Penha',
      content: `
        <p class="text-gray-300 mb-4">Atuação jurídica técnica e equilibrada em inquéritos e processos relacionados à violência doméstica e familiar.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Revogação ou modificação de Medidas Protetivas de Urgência indevidas.</li>
          <li>Acompanhamento de vítimas na requisição de proteção urgente.</li>
          <li>Defesa técnica em ações penais relativas à violência doméstica.</li>
        </ul>
      `
    },
    lavagem: {
      title: 'Lavagem de Dinheiro',
      content: `
        <p class="text-gray-300 mb-4">Especialidade técnica avançada da Dra. Paola Toledo na defesa de investigados por acusações de ocultação de bens, direitos e valores.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Análise técnica de perícias financeiras e contábeis.</li>
          <li>Desbloqueio de bens, veículos e contas bancárias atingidos por medidas cautelares.</li>
          <li>Demonstração da origem lícita de patrimônio e bens.</li>
        </ul>
      `
    },
    orgcriminosa: {
      title: 'Organização Criminosa',
      content: `
        <p class="text-gray-300 mb-4">Defesa complexa e especializada em investigações e processos envolvendo acusações de associação e organização criminosa.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Impugnação de interceptações telefônicas e quebras de sigilo ilícitas.</li>
          <li>Descaracterização de liame subjetivo e estrutura de organização criminosa.</li>
          <li>Habeas Corpus preventivos para trancamento de investigações abusivas.</li>
        </ul>
      `
    },
    arma: {
      title: 'Porte e Posse de Arma de Fogo',
      content: `
        <p class="text-gray-300 mb-4">Defesa técnica especializada em inquéritos e processos decorrentes de acusações do Estatuto do Desarmamento (Lei nº 10.826/03).</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Defesa por posse irregular ou porte ilegal de arma de fogo de uso permitido ou restrito.</li>
          <li>Regularização documental de registro e porte de armas (CACs e cidadãos).</li>
          <li>Pleito de liberdade provisória e descaracterização de qualificadoras.</li>
        </ul>
      `
    },
    demaiscrimes: {
      title: 'Demais Crimes Penais',
      content: `
        <p class="text-gray-300 mb-4">Consultoria e atuação defensiva em todas as demais modalidades de crimes previstos no Código Penal e Legislação Extravagante.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Crimes contra o patrimônio (furto, roubo, estelionato e receptação).</li>
          <li>Crimes de trânsito (homicídio culposo, embriaguez ao volante).</li>
          <li>Crimes ambientais e contra a administração pública.</li>
        </ul>
      `
    },

    // ---------------- CÍVEL (8 ITEMS) ----------------
    contratos: {
      title: 'Elaboração e Análise de Contratos',
      content: `
        <p class="text-gray-300 mb-4">Redação, análise e revisão estratégica de contratos cíveis e comerciais para garantir máxima segurança jurídica e blindagem contra prejuízos.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Contratos de compra, venda, locação e prestação de serviços.</li>
          <li>Parcerias empresariais, distratos e rescisões.</li>
          <li>Revisão contratual por descumprimento de cláusulas.</li>
        </ul>
      `
    },
    guarda: {
      title: 'Pensão, Visitas e Guarda de Filhos',
      content: `
        <p class="text-gray-300 mb-4">Atendimento humanizado e focado em solucionar conflitos familiares com agilidade, sensibilidade e rigor técnico.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Fixação, exoneração e revisional de Pensão Alimentícia.</li>
          <li>Regulamentação e modificação de Guarda Compartilhada ou Unilateral.</li>
          <li>Regime de visitas e plano de convivência familiar.</li>
        </ul>
      `
    },
    divorcio: {
      title: 'Divórcio Judicial e Extrajudicial',
      content: `
        <p class="text-gray-300 mb-4">Condução de processos de divórcio consensual ou litigioso com foco na justa partilha de bens e proteção de interesses.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Divórcio extrajudicial rápido em Cartório de Notas.</li>
          <li>Divórcio judicial litigioso com partilha de patrimônio complexo.</li>
          <li>Reconhecimento e dissolução de União Estável.</li>
        </ul>
      `
    },
    acordos: {
      title: 'Acordos Extrajudiciais',
      content: `
        <p class="text-gray-300 mb-4">Negociação e mediação preventiva para resolução amigável de controvérsias sem a necessidade de longos processos judiciais.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Negociação direta de dívidas e pendências cíveis.</li>
          <li>Formalização de termos de acordo homologáveis em juízo.</li>
          <li>Economia de tempo e recursos financeiros para as partes.</li>
        </ul>
      `
    },
    danos: {
      title: 'Danos Morais e Materiais',
      content: `
        <p class="text-gray-300 mb-4">Ações reparatórias por prejuízos patrimoniais, ofensas à honra, negativação indevida ou acidentes.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Indenização por inscrição indevida no SPC/Serasa.</li>
          <li>Reparação por Danos Morais, Materiais e Estéticos.</li>
          <li>Responsabilidade civil em geral.</li>
        </ul>
      `
    },
    consumidor: {
      title: 'Direito do Consumidor',
      content: `
        <p class="text-gray-300 mb-4">Defesa dos direitos do consumidor contra práticas abusivas cometidas por empresas, fornecedores e prestadores de serviço.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Ressarcimento por produtos defeituosos ou descumprimento de garantia.</li>
          <li>Cobranças indevidas e cancelamento unilateral de contratos.</li>
          <li>Ações de restituição em dobro de valores cobrados indevidamente.</li>
        </ul>
      `
    },
    bancos: {
      title: 'Ações Contra Bancos e Seguradoras',
      content: `
        <p class="text-gray-300 mb-4">Combate a juros abusivos, cobranças indevidas e negativas injustificadas de sinistro por seguradoras e instituições financeiras.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Ações revisionais de juros em contratos de financiamento.</li>
          <li>Cobrança de indenizações de seguros de vida, veículos e patrimônio.</li>
          <li>Desconstituição de empréstimos não autorizados e golpes bancários.</li>
        </ul>
      `
    },
    concessionarias: {
      title: 'Assessoria Jurídica para Concessionárias & Empresas',
      content: `
        <p class="text-gray-300 mb-4">Especialidade consolidada da Dra. Paola Toledo na assessoria preventiva e contenciosa para concessionárias de veículos e empresas de todo o Brasil.</p>
        <h4 class="font-heading text-xl text-gold mb-2">Principais Atuações:</h4>
        <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Defesa em ações cíveis e de consumo movidas por compradores de veículos.</li>
          <li>Elaboração de termos de garantia, contratos de intermediação e procedimentos operacionais.</li>
          <li>Blindagem preventiva de conflitos e negociação direta de acordos lucrativos.</li>
        </ul>
      `
    }
  };

  const practiceElements = document.querySelectorAll('.practice-card-light, .practice-detail-btn');

  practiceElements.forEach(el => {
    el.addEventListener('click', (e) => {
      const area = el.getAttribute('data-area') || el.closest('[data-area]')?.getAttribute('data-area');
      if (!area) return;

      const data = practiceData[area];
      if (data && modalBackdrop && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalBackdrop.classList.add('active');
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   6.1 Practice Areas Filtering & Live Search
   ========================================================================== */
function initPracticeFilters() {
  const tabBtns = document.querySelectorAll('.area-tab-btn');
  const practiceCards = document.querySelectorAll('.practice-card-light');
  const blockCriminal = document.getElementById('block-criminal');
  const blockCivel = document.getElementById('block-civel');
  const searchInput = document.getElementById('area-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resultsCounter = document.getElementById('search-results-counter');
  const noResultsMsg = document.getElementById('no-areas-found');

  let activeTab = 'all';

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    if (clearSearchBtn) {
      if (query.length > 0) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
    }

    practiceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

      const matchesText = query === '' || title.includes(query) || desc.includes(query);
      const matchesTab = activeTab === 'all' || category === activeTab;

      if (matchesText && matchesTab) {
        card.classList.remove('hidden');
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });

    if (blockCriminal) {
      const visibleCriminal = blockCriminal.querySelectorAll('.practice-card-light:not(.hidden)').length;
      blockCriminal.style.display = (visibleCriminal > 0) ? 'block' : 'none';
    }

    if (blockCivel) {
      const visibleCivel = blockCivel.querySelectorAll('.practice-card-light:not(.hidden)').length;
      blockCivel.style.display = (visibleCivel > 0) ? 'block' : 'none';
    }

    if (resultsCounter) {
      if (query !== '') {
        resultsCounter.textContent = `${visibleCount} ${visibleCount === 1 ? 'especialidade encontrada' : 'especialidades encontradas'}`;
      } else {
        resultsCounter.textContent = '';
      }
    }

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.remove('hidden');
      } else {
        noResultsMsg.classList.add('hidden');
      }
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-[#8C602F]', 'to-[#A8763C]', 'text-white', 'shadow-sm', 'bg-[#8C602F]', 'shadow-md');
        b.classList.add('text-slate-600', 'hover:text-[#8C602F]');
      });
      btn.classList.remove('text-slate-600', 'hover:text-[#8C602F]');
      btn.classList.add('active', 'bg-gradient-to-r', 'from-[#8C602F]', 'to-[#A8763C]', 'text-white', 'shadow-sm');

      activeTab = btn.getAttribute('data-tab');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterCards();
        searchInput.focus();
      }
    });
  }
}

/* ==========================================================================
   7. Contact Form WhatsApp Direct Redirect
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('whatsappForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('nome');
    const messageInput = document.getElementById('mensagem');

    const name = nameInput ? nameInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !message) {
      alert('Por favor, preencha seu nome e mensagem.');
      return;
    }

    const textMsg = `Olá, Dra. Paola Toledo! Meu nome é *${name}*.\n\n*Mensagem/Caso:* ${message}`;
    const encodedMsg = encodeURIComponent(textMsg);
    const whatsappUrl = `https://wa.me/5511972722661?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   8. Smooth Scroll for Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length <= 1) return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
