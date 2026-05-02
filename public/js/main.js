/**
 * main.js - Hardcore Server Tech SPA
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SPA Navigation Logic ---
  const navBtns = document.querySelectorAll('.nav-btn, .trigger-nav');
  const sections = document.querySelectorAll('.screen-section');

  function switchSection(targetId) {
    // Hide all
    sections.forEach(sec => sec.classList.remove('active'));
    // Deactivate nav btns
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show target
    const targetSec = document.getElementById(targetId);
    if (targetSec) {
      targetSec.classList.add('active');
    }
    
    // Activate nav
    const targetNav = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
    if (targetNav) {
      targetNav.classList.add('active');
    }
    
    // Re-trigger typing effect in target if exists
    triggerTypingEffects(targetSec);
    
    // Close mobile menu if open
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (hamburgerBtn && hamburgerBtn.classList.contains('open')) {
      hamburgerBtn.classList.remove('open');
      navLinks.classList.remove('open');
    }
  }

  // Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      switchSection(target);
    });
  });

  // --- 2. Typing Effect for Server Theme ---
  function triggerTypingEffects(container) {
    if (!container) return;
    const typeElements = container.querySelectorAll('.type-effect');
    typeElements.forEach(el => {
      // Very basic reset and re-animation
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = null;
    });
  }
  // Initial typing
  triggerTypingEffects(document.getElementById('home'));

  // --- 3. Server Nodes Canvas Background ---
  const canvas = document.getElementById('digital-tact-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
        ctx.fill();
        // Server node glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 0; // reset
      }
    }

    for (let i = 0; i < 80; i++) {
      nodes.push(new Node());
    }

    // Mouse interaction for the network
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateNetwork() {
      ctx.clearRect(0, 0, width, height);
      
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist / 150})`;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        
        // Mouse connection
        if (mouse.x != null && mouse.y != null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const distMouse = Math.sqrt(dx * dx + dy * dy);
          if (distMouse < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 229, 255, ${1 - distMouse / 200})`; // cyan for mouse track
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            // pull slightly towards mouse
            nodes[i].x -= dx * 0.005;
            nodes[i].y -= dy * 0.005;
          }
        }
      }

      requestAnimationFrame(animateNetwork);
    }
    
    animateNetwork();
  }

  // --- 4. AI Subsidy Diagnosis Wizard ---
  const diagWizard = document.getElementById('ai-diag-wizard');
  if (diagWizard) {
    const diagData = {
      industry: null,
      size: null,
      problems: [],
      status: null
    };

    // Subsidy database
    const subsidyDB = [
      {
        name: '小規模事業者持続化補助金',
        desc: '販路開拓や業務効率化の取り組みを支援する補助金。チラシ・Web制作・広告費用なども対象です。',
        maxAmount: '最大250万円',
        rate: '補助率 2/3',
        keywords: ['売上・集客を増やしたい', 'IT・DXを導入したい', '新商品・新サービスを作りたい'],
        sizeMatch: ['1人（個人事業主）', '2〜5人', '6〜20人'],
        statusMatch: ['創業3年未満', '創業3年以上', '事業転換・新規事業を検討中'],
        industryExclude: []
      },
      {
        name: 'IT導入補助金',
        desc: 'ITツール（ソフトウェア、クラウドサービス等）の導入費用を支援。業務効率化・DX推進に最適。',
        maxAmount: '最大450万円',
        rate: '補助率 1/2〜3/4',
        keywords: ['IT・DXを導入したい', '人手不足を解消したい', '売上・集客を増やしたい'],
        sizeMatch: ['1人（個人事業主）', '2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年未満', '創業3年以上'],
        industryExclude: []
      },
      {
        name: 'ものづくり・商業・サービス補助金',
        desc: '革新的な製品・サービス開発、生産プロセスの改善に対する設備投資等を支援。',
        maxAmount: '最大1,250万円',
        rate: '補助率 1/2〜2/3',
        keywords: ['新商品・新サービスを作りたい', '設備投資・省エネ対策', 'IT・DXを導入したい', '海外展開したい'],
        sizeMatch: ['2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年未満', '創業3年以上', '事業転換・新規事業を検討中'],
        industryExclude: []
      },
      {
        name: '事業再構築補助金',
        desc: '新分野展開、事業転換、業態転換などの思い切った事業再構築を支援する大型補助金。',
        maxAmount: '最大7,000万円',
        rate: '補助率 1/2〜3/4',
        keywords: ['新商品・新サービスを作りたい', '事業承継・M&A', '海外展開したい', '設備投資・省エネ対策'],
        sizeMatch: ['2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['事業転換・新規事業を検討中', '創業3年以上'],
        industryExclude: []
      },
      {
        name: 'キャリアアップ助成金',
        desc: '非正規雇用の従業員を正社員化したり、処遇改善する事業者を支援する助成金。',
        maxAmount: '1人あたり最大80万円',
        rate: '定額支給',
        keywords: ['人手不足を解消したい', '人材育成・研修'],
        sizeMatch: ['2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年未満', '創業3年以上'],
        industryExclude: []
      },
      {
        name: '人材開発支援助成金',
        desc: '従業員のスキルアップ研修・教育訓練に対して経費と賃金の一部を助成。DX人材育成にも対応。',
        maxAmount: '研修内容により変動',
        rate: '経費の最大75%＋賃金助成',
        keywords: ['人材育成・研修', 'IT・DXを導入したい', '人手不足を解消したい'],
        sizeMatch: ['2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年未満', '創業3年以上'],
        industryExclude: []
      },
      {
        name: '創業支援等事業者補助金（各自治体）',
        desc: '創業・開業時の初期費用（設備・広告・家賃等）を支援。自治体独自の制度も多数あり。',
        maxAmount: '自治体により異なる（数十万〜数百万円）',
        rate: '補助率 1/2〜2/3',
        keywords: ['売上・集客を増やしたい', '新商品・新サービスを作りたい', 'IT・DXを導入したい'],
        sizeMatch: ['1人（個人事業主）', '2〜5人', '6〜20人'],
        statusMatch: ['創業予定（まだ開業前）', '創業3年未満'],
        industryExclude: []
      },
      {
        name: '省エネルギー投資促進支援事業費補助金',
        desc: '省エネ設備への更新を支援。空調・照明・生産設備などの高効率化が対象。',
        maxAmount: '最大1億円',
        rate: '補助率 1/3',
        keywords: ['設備投資・省エネ対策'],
        sizeMatch: ['6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年以上'],
        industryExclude: []
      },
      {
        name: '事業承継・引継ぎ補助金',
        desc: '事業承継やM&Aに伴う費用（専門家費用、設備投資等）を支援する補助金。',
        maxAmount: '最大600万円',
        rate: '補助率 1/2〜2/3',
        keywords: ['事業承継・M&A'],
        sizeMatch: ['1人（個人事業主）', '2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年以上'],
        industryExclude: []
      },
      {
        name: '海外展開・事業再編資金（日本政策金融公庫）',
        desc: '海外展開に必要な資金を低利で融資。補助金と併用も可能。',
        maxAmount: '融資制度（最大7,200万円）',
        rate: '低利融資',
        keywords: ['海外展開したい'],
        sizeMatch: ['2〜5人', '6〜20人', '21〜50人', '51〜100人', '101人以上'],
        statusMatch: ['創業3年未満', '創業3年以上'],
        industryExclude: []
      }
    ];

    // Step navigation
    function showStep(stepVal) {
      diagWizard.querySelectorAll('.diag-step').forEach(s => s.classList.remove('active'));
      const target = diagWizard.querySelector(`.diag-step[data-step="${stepVal}"]`);
      if (target) target.classList.add('active');

      // Scroll the section to the top so content is not cut off
      const diagSection = document.getElementById('ai-diagnosis');
      if (diagSection) {
        diagSection.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Single-select steps (1, 2, 4)
    ['diag-industry', 'diag-size', 'diag-status'].forEach(containerId => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll('.diag-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          // Deselect siblings
          container.querySelectorAll('.diag-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          const value = btn.getAttribute('data-value');

          if (containerId === 'diag-industry') {
            diagData.industry = value;
            setTimeout(() => showStep(2), 350);
          } else if (containerId === 'diag-size') {
            diagData.size = value;
            setTimeout(() => showStep(3), 350);
          } else if (containerId === 'diag-status') {
            diagData.status = value;
            setTimeout(() => {
              showStep('result');
              runDiagnosis();
            }, 350);
          }
        });
      });
    });

    // Multi-select step (3)
    const problemsContainer = document.getElementById('diag-problems');
    const step3NextBtn = document.getElementById('diag-step3-next');
    if (problemsContainer && step3NextBtn) {
      problemsContainer.querySelectorAll('.diag-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('selected');
          // Update diagData.problems
          diagData.problems = [];
          problemsContainer.querySelectorAll('.diag-option-btn.selected').forEach(s => {
            diagData.problems.push(s.getAttribute('data-value'));
          });
          step3NextBtn.disabled = diagData.problems.length === 0;
        });
      });

      step3NextBtn.addEventListener('click', () => {
        if (diagData.problems.length > 0) {
          showStep(4);
        }
      });
    }

    // Diagnosis logic
    function runDiagnosis() {
      const loading = document.getElementById('diag-loading');
      const resultsDiv = document.getElementById('diag-results');
      const footer = document.getElementById('diag-result-footer');
      
      loading.classList.remove('hidden');
      resultsDiv.classList.add('hidden');
      footer.classList.add('hidden');

      // Simulate analysis delay
      setTimeout(() => {
        const matches = [];

        subsidyDB.forEach(sub => {
          let score = 0;
          let maxScore = 0;

          // Keyword match (most important)
          const keywordHits = diagData.problems.filter(p => sub.keywords.includes(p)).length;
          score += keywordHits * 3;
          maxScore += diagData.problems.length * 3;

          // Size match
          maxScore += 2;
          if (sub.sizeMatch.includes(diagData.size)) score += 2;

          // Status match
          maxScore += 2;
          if (sub.statusMatch.includes(diagData.status)) score += 2;

          // Industry exclusion penalty
          if (sub.industryExclude.includes(diagData.industry)) score = 0;

          const ratio = maxScore > 0 ? score / maxScore : 0;

          if (ratio > 0.2) {
            let level = 'low';
            if (ratio >= 0.7) level = 'high';
            else if (ratio >= 0.4) level = 'medium';

            matches.push({ ...sub, score, ratio, level });
          }
        });

        // Sort by score descending
        matches.sort((a, b) => b.score - a.score);

        // Render results
        resultsDiv.innerHTML = '';

        if (matches.length === 0) {
          resultsDiv.innerHTML = `
            <div class="system-msg">
              <span class="prompt">> RESULT:</span>
              条件に一致する補助金・助成金が見つかりませんでした。<br>
              お気軽に<span class="cyber-gold">無料相談</span>をご利用ください。個別に最適な制度をお探しします。
            </div>`;
        } else {
          const header = document.createElement('div');
          header.className = 'system-msg mb-20';
          header.innerHTML = `<span class="prompt">> RESULT:</span> <span class="neon-text">${matches.length}件</span>の補助金・助成金が見つかりました。`;
          resultsDiv.appendChild(header);

          matches.forEach(m => {
            const levelLabel = m.level === 'high' ? 'HIGH MATCH' : m.level === 'medium' ? 'MEDIUM' : 'POSSIBLE';
            const card = document.createElement('div');
            card.className = 'diag-result-card';
            card.innerHTML = `
              <div class="result-card-header">
                <span class="result-card-name">${m.name}</span>
                <span class="result-match-badge match-${m.level}">${levelLabel}</span>
              </div>
              <div class="result-card-body">
                <p>${m.desc}</p>
                <div class="result-card-meta">
                  <div class="result-meta-item">MAX: <span>${m.maxAmount}</span></div>
                  <div class="result-meta-item">RATE: <span>${m.rate}</span></div>
                </div>
              </div>`;
            resultsDiv.appendChild(card);
          });
        }

        loading.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        footer.classList.remove('hidden');
      }, 1800);
    }

    // Restart
    const restartBtn = document.getElementById('diag-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        diagData.industry = null;
        diagData.size = null;
        diagData.problems = [];
        diagData.status = null;
        // Deselect all
        diagWizard.querySelectorAll('.diag-option-btn').forEach(b => b.classList.remove('selected'));
        if (step3NextBtn) step3NextBtn.disabled = true;
        showStep(1);
      });
    }

    // Re-bind any trigger-nav buttons inside the diagnosis section
    document.querySelectorAll('#ai-diagnosis .trigger-nav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        switchSection(target);
      });
    });
  }

});
