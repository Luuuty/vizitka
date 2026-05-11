// ── MOBILE MENU ──
function toggleMobile(){
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobile(){
  document.getElementById('mobileMenu').classList.remove('open');
}

// ── AURORA BEAMS — динамические пятна ──
function spawnAuroraBeams(section) {
  const layer = document.createElement('div');
  layer.className = 'aurora-layer';
  const colors = [
    'rgba(40,180,80,VAL)','rgba(60,220,100,VAL)',
    'rgba(30,140,70,VAL)','rgba(80,255,140,VAL)',
    'rgba(20,100,50,VAL)'
  ];
  for(let i = 0; i < 6; i++){
    const beam = document.createElement('div');
    beam.className = 'aurora-beam';
    const size = 200 + Math.random()*400;
    const op = (0.08 + Math.random()*0.12).toFixed(2);
    const color = colors[i%colors.length].replace('VAL', op);
    const x1 = (Math.random()*120 - 10)+'%';
    const y1 = (Math.random()*120 - 10)+'%';
    const x2 = (Math.random()*120 - 10)+'%';
    const y2 = (Math.random()*120 - 10)+'%';
    const dur = (6 + Math.random()*10).toFixed(1)+'s';
    const delay = (Math.random()*8).toFixed(1)+'s';
    beam.style.cssText = `
      width:${size}px; height:${size}px;
      background:radial-gradient(ellipse, ${color} 0%, transparent 70%);
      --x1:${x1}; --y1:${y1}; --x2:${x2}; --y2:${y2};
      --dur:${dur}; --delay:${delay}; --op:${op};
      left:${Math.random()*80}%; top:${Math.random()*80}%;
      transform:translate(-50%,-50%);
    `;
    layer.appendChild(beam);
  }
  section.appendChild(layer);
}
document.querySelectorAll('#about, #contact').forEach(spawnAuroraBeams);

// ── SCROLL REVEAL ──
const allReveal = document.querySelectorAll(
  '.reveal,.reveal-up,.reveal-left,.reveal-right,.reveal-scale,.reveal-fade'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
      const num = e.target.querySelector('.stat-num[data-target]') ||
                  (e.target.classList.contains('stat-item') ? e.target.querySelector('.stat-num') : null);
      if(num && num.dataset.target) animateCounter(num);
    }
  });
},{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
allReveal.forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el){
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now){
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(ease * target);
    el.textContent = prefix + current + suffix;
    if(progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(update);
}

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if(window.scrollY > 60){
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ── FORM SUBMIT ──
function submitForm(){
  const input = document.getElementById('phoneInput');
  const val = input.value.trim();
  if(!val || val.length < 6){
    input.style.borderColor = 'rgba(255,80,80,0.5)';
    input.placeholder = 'Введите номер телефона';
    setTimeout(()=>{ input.style.borderColor=''; input.placeholder='+7 (___) ___-__-__' },2000);
    return;
  }
  const btn = document.querySelector('.contact-submit');
  btn.textContent = 'Отправлено ✓';
  btn.style.background = '#2d7a4f';
  input.value = '';
  input.placeholder = 'Мы свяжемся с вами!';
  setTimeout(() => {
    btn.textContent = 'Отправить →';
    btn.style.background = '';
    input.placeholder = '+7 (___) ___-__-__';
  }, 3500);
}

// ── PRICING FEATURED CTA ──
const featured = document.querySelector('.price-card.featured');
if(featured && !featured.querySelector('.price-cta')){
  featured.insertAdjacentHTML('beforeend','<a href="#contact" class="price-cta dark" style="margin-top:0">Выбрать тариф →</a>');
}

// ── STAGGER DELAYS ──
document.querySelectorAll('.pain-cards .pain-card').forEach((el,i) => {
  el.style.transitionDelay = `${i*0.12}s`;
});
document.querySelectorAll('.process-cards .process-card').forEach((el,i) => {
  el.style.transitionDelay = `${i*0.12}s`;
});
document.querySelectorAll('.pricing-grid .price-card').forEach((el,i) => {
  el.style.transitionDelay = `${i*0.14}s`;
});

// ── ROBOT BG REMOVAL ──
function removeRobotBg(){
  const img = document.querySelector('.robot-img');
  if(!img) return;
  const doRemove = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      const bgR=80, bgG=94, bgB=78;
      const hardThresh = 32;
      const softThresh = 52;
      for(let i = 0; i < d.length; i += 4){
        const r=d[i], g=d[i+1], b=d[i+2];
        const isGreenGrey = g > r-8 && g > b-5 && r < 160 && b < 160;
        const dist = Math.sqrt((r-bgR)**2+(g-bgG)**2+(b-bgB)**2);
        if(isGreenGrey && dist < hardThresh){
          d[i+3] = 0;
        } else if(isGreenGrey && dist < softThresh){
          const alpha = Math.round(((dist-hardThresh)/(softThresh-hardThresh))*255);
          d[i+3] = Math.min(d[i+3], alpha);
        }
      }
      ctx.putImageData(data, 0, 0);
      img.style.mixBlendMode = 'normal';
      img.style.filter = 'none';
      img.src = canvas.toDataURL('image/png');
    } catch(e){ console.log('Canvas unavailable') }
  };
  if(img.complete && img.naturalWidth > 0) doRemove();
  else img.addEventListener('load', doRemove);
}
removeRobotBg();