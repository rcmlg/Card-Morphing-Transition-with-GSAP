const cards = document.querySelectorAll('.card');
const circle = document.getElementById('circle-overlay');
const whiteCircle = document.getElementById('white-overlay');
const detailsPage = document.getElementById('details-page');
const detailsTitle = document.getElementById('details-title');
const detailsDesc = document.getElementById('details-desc');
const closeBtn = document.getElementById('close-details');
let animating = false;

function getScaleToCoverScreen(centerX, centerY, elWidth, elHeight) {
  const w = window.innerWidth, h = window.innerHeight;
  const maxX = Math.max(centerX, w - centerX);
  const maxY = Math.max(centerY, h - centerY);
  const r = Math.sqrt(maxX * maxX + maxY * maxY);
  const finalDiameter = r * 2;
  return finalDiameter / Math.max(elWidth, elHeight);
}

function resetOverlays() {
  [circle, whiteCircle].forEach(overlay => {
    overlay.style.display = 'none';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.width = '240px';
    overlay.style.height = '240px';
    overlay.style.transform = 'translate(-50%,-50%) scale(0.5)';
    gsap.set(overlay, {scale: 0.5});
  });
}

cards.forEach(card => {
  card.addEventListener('click', e => {
    if (animating) return;
    animating = true;
    resetOverlays();

    circle.style.display = 'block';
    whiteCircle.style.display = 'block';
    circle.style.zIndex = 100;
    whiteCircle.style.zIndex = 101;

    const baseSize = 240;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const scale = getScaleToCoverScreen(cx, cy, baseSize, baseSize);

    gsap.to(circle, {
      scale: scale,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(whiteCircle, {
          scale: scale,
          duration: 0.38,
          ease: "power2.inOut",
          onComplete: () => {
            detailsTitle.textContent = card.dataset.title;
            detailsDesc.textContent = card.dataset.desc;
            detailsPage.classList.add('active');
            setTimeout(() => {
              resetOverlays();
              animating = false;
            }, 250);
          }
        });
      }
    });
  });
});

closeBtn.addEventListener('click', () => {
  if (animating) return;
  animating = true;
  resetOverlays();
  const baseSize = 240;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  whiteCircle.style.display = 'block';
  whiteCircle.style.left = '50%';
  whiteCircle.style.top = '50%';
  whiteCircle.style.width = `${baseSize}px`;
  whiteCircle.style.height = `${baseSize}px`;
  whiteCircle.style.transform = 'translate(-50%,-50%) scale(0.5)';
  whiteCircle.style.zIndex = 101;
  gsap.set(whiteCircle, {scale: 0.5});

  const scale = getScaleToCoverScreen(cx, cy, baseSize, baseSize);

  gsap.to(whiteCircle, {
    scale: scale,
    duration: 0.4,
    ease: "power2.inOut",
    onStart: () => {
      detailsPage.classList.remove('active');
    },
    onComplete: () => {
      gsap.to(whiteCircle, {
        scale: 0.5,
        duration: 0.32,
        delay: 0.07,
        onComplete: () => {
          resetOverlays();
          animating = false;
        }
      });
    }
  });
});

window.addEventListener('resize', resetOverlays);
resetOverlays();
