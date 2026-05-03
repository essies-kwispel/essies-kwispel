/* ============================================
   Essie's Kwispel Service — JavaScript

   !! VEREIST AANPASSEN !!
   Vul hieronder jouw eigen gegevens in.
   Zie HANDLEIDING-SEO-REVIEWS.md voor stappen.
============================================ */

const GOOGLE_API_KEY = 'JOUW_API_KEY_HIER';
const PLACE_ID       = 'JOUW_PLACE_ID_HIER';

/* ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── SCROLL REVEAL ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('v'), i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ── ACTIVE NAV ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  /* ── CONTACT FORM (Netlify) ── */
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('.sub-btn');
      submitBtn.textContent = 'Versturen...';
      submitBtn.disabled = true;
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (response.ok) {
          form.style.display = 'none';
          successMsg.classList.add('show');
        } else { throw new Error(); }
      } catch {
        submitBtn.textContent = 'Probeer opnieuw';
        submitBtn.disabled = false;
        alert('Er ging iets mis. Stuur een WhatsApp naar Essie of probeer opnieuw.');
      }
    });
  }

  /* ── GOOGLE REVIEWS ── */
  if (GOOGLE_API_KEY !== 'JOUW_API_KEY_HIER' && PLACE_ID !== 'JOUW_PLACE_ID_HIER') {
    loadGoogleReviews();
  } else {
    showFallbackReviews();
  }

});

function loadGoogleReviews() {
  window.initGoogleReviews = function () {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      { placeId: PLACE_ID, fields: ['name','rating','user_ratings_total','reviews','url'], language: 'nl' },
      function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          renderReviews(place);
        } else {
          showFallbackReviews();
        }
      }
    );
  };
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initGoogleReviews`;
  script.async = true;
  script.onerror = () => showFallbackReviews();
  document.head.appendChild(script);
}

function renderReviews(place) {
  const container = document.getElementById('reviews-container');
  const summary   = document.getElementById('rating-summary');
  if (!container) return;

  const reviews = (place.reviews || []).filter(r => r.rating >= 4).slice(0, 6);
  if (reviews.length === 0) { showFallbackReviews(); return; }

  container.innerHTML = reviews.map((review, i) => {
    const stars    = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const initials = review.author_name.charAt(0).toUpperCase();
    const photo    = review.profile_photo_url
      ? `<img src="${review.profile_photo_url}" alt="${review.author_name}" class="reviewer-photo">`
      : `<div class="avatar">${initials}</div>`;
    const maxLen = 180;
    const tekst  = review.text.length > maxLen ? review.text.substring(0, maxLen) + '…' : review.text;
    return `
      <div class="rcard reveal" style="animation-delay:${i * 80}ms">
        <div class="stars">${stars}</div>
        <div class="bigq">"</div>
        <p>${tekst}</p>
        <div class="rauthor">
          ${photo}
          <div>
            <div class="aname">${review.author_name}</div>
            <div class="adog">Google Review</div>
          </div>
        </div>
      </div>`;
  }).join('');

  if (summary && place.rating) {
    document.getElementById('rating-score').textContent = place.rating.toFixed(1);
    document.getElementById('rating-stars').textContent = '★'.repeat(Math.round(place.rating)) + '☆'.repeat(5 - Math.round(place.rating));
    document.getElementById('rating-count').textContent = `${place.user_ratings_total} beoordelingen`;
    if (place.url) document.getElementById('reviews-link').href = place.url;
    summary.style.display = 'flex';
  }

  activateReveal(container);
}

function showFallbackReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;
  container.innerHTML = `
    <div class="rcard reveal">
      <div class="stars">★★★★★</div><div class="bigq">"</div>
      <p>Max komt altijd super blij thuis van Essie. Ze stuurt elke dag mooie foto's — je merkt echt dat ze van honden houdt. Absoluut aanrader!</p>
      <div class="rauthor"><div class="avatar">👩</div><div><div class="aname">Lisa de Vries</div><div class="adog">🐕 Max, Labrador</div></div></div>
    </div>
    <div class="rcard reveal">
      <div class="stars">★★★★★</div><div class="bigq">"</div>
      <p>Onze Bella is erg verlegen maar bij Essie was ze meteen op haar gemak. Ze heeft echt een speciale band met honden!</p>
      <div class="rauthor"><div class="avatar">👨</div><div><div class="aname">Thomas &amp; Sandra</div><div class="adog">🐩 Bella, Poedel</div></div></div>
    </div>
    <div class="rcard reveal">
      <div class="stars">★★★★★</div><div class="bigq">"</div>
      <p>Ik werk lange dagen en zonder Essie's Kwispel Service zou dat niet lukken. Ze zorgt voor Finn met dezelfde liefde als ikzelf!</p>
      <div class="rauthor"><div class="avatar">👩‍💼</div><div><div class="aname">Marieke Smit</div><div class="adog">🦊 Finn, Shiba Inu</div></div></div>
    </div>`;
  activateReveal(container);
}

function activateReveal(container) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('v'), i * 90); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  container.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
