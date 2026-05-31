// =========================
// 粒子动画系统
// =========================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 60;
  const COLORS = ['#1e3a8a', '#d4af37', '#dc2626'];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 22500) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 14400) {
          ctx.beginPath();
          ctx.strokeStyle = '#1e3a8a';
          ctx.globalAlpha = 0.08 * (1 - distSq / 14400);
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

// =========================
// 滚动进度条
// =========================
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });
}

// =========================
// 鼠标光晕效果
// =========================
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let isMoving = false;
  let hideTimeout;

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';

    isMoving = true;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      glow.style.opacity = '0';
    }, 2000);
  }, { passive: true });
}

// =========================
// 导航栏滚动效果
// =========================
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// =========================
// 返回顶部按钮
// =========================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =========================
// 汉堡菜单
// =========================
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================
// 滚动显示动画
// =========================
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// =========================
// 数字动画计数器
// =========================
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target, prefersReducedMotion);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, reducedMotion) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = reducedMotion ? 0 : 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(easeOutQuart * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  if (duration > 0) {
    requestAnimationFrame(update);
  } else {
    element.textContent = target.toLocaleString();
  }
}

// =========================
// 浮动装饰元素
// =========================
function initFloatingElements() {
  const container = document.querySelector('.floating-decorations');
  if (!container) return;

  const types = ['type-1', 'type-2', 'type-3', 'type-4'];
  const elementCount = 15;

  for (let i = 0; i < elementCount; i++) {
    const el = document.createElement('div');
    const type = types[Math.floor(Math.random() * types.length)];
    el.className = `floating-element ${type}`;

    const left = Math.random() * 100;
    const duration = 20 + Math.random() * 30;
    const delay = Math.random() * 20;
    const size = 0.5 + Math.random() * 1;

    el.style.left = `${left}%`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.transform = `scale(${size})`;

    container.appendChild(el);
  }
}

// =========================
// 卡片 3D 倾斜效果
// =========================
function init3DTilt() {
  const cards = document.querySelectorAll('.story-card, .ethic-card, .quote-card, .reflection-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// =========================
// 互动思考卡片
// =========================
function initReflectionCards() {
  const cards = document.querySelectorAll('.reflection-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      const hint = card.querySelector('.reflection-hint');
      if (hint) {
        hint.style.opacity = '0';
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('revealed');
        const hint = card.querySelector('.reflection-hint');
        if (hint) {
          hint.style.opacity = '0';
        }
      }
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });
}

// =========================
// 彩纸动画系统
// =========================
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let animationId;
  let isActive = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = Math.random() * 3 + 2;
      this.width = Math.random() * 10 + 5;
      this.height = Math.random() * 6 + 3;
      this.gravity = 0.1;
      this.opacity = 1;
      this.fadeSpeed = 0.003 + Math.random() * 0.002;

      const colors = ['#1e3a8a', '#d4af37', '#dc2626', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.fadeSpeed;

      if (this.opacity <= 0) {
        this.opacity = 0;
      }
    }

    draw() {
      if (this.opacity <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function launch(count = 150) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece());
    }
    if (!isActive) {
      isActive = true;
      animate();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces = confettiPieces.filter(p => p.opacity > 0);

    confettiPieces.forEach(p => {
      p.update();
      p.draw();
    });

    if (confettiPieces.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      isActive = false;
    }
  }

  window.launchConfetti = launch;
}

// =========================
// 知识问答
// =========================
function initQuiz() {
  const quizCard = document.getElementById('quizCard');
  const quizProgress = document.getElementById('quizProgress');
  if (!quizCard || !quizProgress) return;

  const quizData = [
    {
      question: '以下哪位历史人物以"不持一砚归"的廉洁事迹闻名？',
      options: ['包拯', '于谦', '杨震', '海瑞'],
      correct: 0
    },
    {
      question: '技术伦理中的"算法公正"指的是什么？',
      options: [
        '算法运行速度要快',
        '算法设计要避免偏见，确保公平',
        '算法代码要公开',
        '算法结果要保密'
      ],
      correct: 1
    },
    {
      question: '以下哪种行为违反了学术诚信原则？',
      options: [
        '独立完成作业',
        '引用他人成果时规范标注',
        '直接复制他人代码作为自己的作品',
        '使用 AI 辅助工具时如实说明'
      ],
      correct: 2
    },
    {
      question: '"四知"故事"天知、神知、我知、子知"出自哪位历史人物？',
      options: ['子罕', '杨震', '包拯', '于谦'],
      correct: 1
    },
    {
      question: '在开发过程中发现系统漏洞，正确的做法是？',
      options: [
        '利用漏洞获取利益',
        '忽略漏洞不管',
        '立即通过正规渠道报告并协助修复',
        '将漏洞信息私下出售'
      ],
      correct: 2
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  const letters = ['A', 'B', 'C', 'D'];

  function createProgressDots() {
    quizProgress.innerHTML = '';
    quizData.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'quiz-progress-dot';
      if (i < currentQuestion) dot.classList.add('done');
      if (i === currentQuestion) dot.classList.add('current');
      quizProgress.appendChild(dot);
    });
  }

  function showQuestion() {
    if (currentQuestion >= quizData.length) {
      showResult();
      return;
    }

    const data = quizData[currentQuestion];
    quizCard.innerHTML = `
      <div class="quiz-question-num">问题 ${currentQuestion + 1}/${quizData.length}</div>
      <div class="quiz-question">${data.question}</div>
      <div class="quiz-options">
        ${data.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">
            <span class="option-letter">${letters[i]}</span>
            ${opt}
          </button>
        `).join('')}
      </div>
    `;

    quizCard.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index), data.correct));
    });

    createProgressDots();
  }

  function handleAnswer(selected, correct) {
    const options = quizCard.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.classList.add('disabled');
      const idx = parseInt(opt.dataset.index);
      if (idx === correct) opt.classList.add('correct');
      if (idx === selected && idx !== correct) opt.classList.add('wrong');
    });

    if (selected === correct) score++;

    let advanceTimer = setTimeout(() => {
      currentQuestion++;
      showQuestion();
    }, 1200);

    quizCard.addEventListener('click', function interrupt() {
      clearTimeout(advanceTimer);
      currentQuestion++;
      showQuestion();
      quizCard.removeEventListener('click', interrupt);
    }, { once: true });
  }

  function showResult() {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = '';
    if (percentage === 100) message = '满分！你对廉洁文化知识掌握得非常好！';
    else if (percentage >= 80) message = '优秀！继续保持，你是廉洁文化的传播者！';
    else if (percentage >= 60) message = '不错，但还可以更进一步哦！';
    else message = '建议多了解廉洁文化知识，再接再厉！';

    quizCard.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-score">${score}/${quizData.length}</div>
        <div class="quiz-score-label">正确率 ${percentage}%</div>
        <div class="quiz-message">${message}</div>
        <button class="btn btn-primary quiz-retry" id="quizRetry">重新测试</button>
      </div>
    `;

    document.getElementById('quizRetry').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      showQuestion();
    });

    createProgressDots();

    if (percentage === 100 && window.launchConfetti) {
      window.launchConfetti(200);

      setTimeout(() => {
        if (window.launchConfetti) {
          window.launchConfetti(100);
        }
      }, 1000);
    }
  }

  showQuestion();
}

// =========================
// 廉洁承诺卡
// =========================
function initPledgeCard() {
  const form = document.getElementById('pledgeForm');
  const generateBtn = document.getElementById('pledgeGenerate');
  const resetBtn = document.getElementById('pledgeReset');
  const nameInput = document.getElementById('pledgeName');
  const textInput = document.getElementById('pledgeText');
  const card = document.getElementById('pledgeCard');
  const cardName = document.getElementById('pledgeCardName');
  const cardText = document.getElementById('pledgeCardText');
  const cardDate = document.getElementById('pledgeCardDate');

  if (!form || !generateBtn || !resetBtn || !nameInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }

    const text = textInput.value.trim() || '我承诺：在未来的学习和工作中，坚守廉洁底线，恪守技术伦理，做清正廉洁的技术守护者！';
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);

    cardName.textContent = name;
    cardText.textContent = text;
    cardDate.textContent = dateStr;

    card.classList.add('show');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  resetBtn.addEventListener('click', () => {
    card.classList.remove('show');
    nameInput.focus();
  });
}

// =========================
// 背景图案动画
// =========================
function initAnimatedBackgrounds() {
  const sections = document.querySelectorAll('section:not(.hero)');
  sections.forEach(section => {
    const bgPattern = document.createElement('div');
    bgPattern.className = 'animated-bg-pattern';
    section.style.position = 'relative';
    section.style.overflow = 'hidden';
    section.insertBefore(bgPattern, section.firstChild);
  });
}

// =========================
// 导航高亮
// =========================
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// =========================
// 初始化
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollProgress();
  initCursorGlow();
  initNavScroll();
  initBackToTop();
  initHamburger();
  initRevealAnimations();
  initAnimatedCounters();
  initFloatingElements();
  init3DTilt();
  initReflectionCards();
  initConfetti();
  initQuiz();
  initPledgeCard();
  initAnimatedBackgrounds();
  initActiveNavHighlight();
});
