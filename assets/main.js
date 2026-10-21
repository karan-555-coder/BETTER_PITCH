// Shared header, footer and small interactions for every BetterPitch page.
// Each page loads this with data-root pointing at the site root ("./" or "../").
(function () {
  const root = document.currentScript.dataset.root || "./";
  const here = location.pathname.split("/").pop() || "index.html";
  const u = (p) => root + p;
  const act = (f) => (here === f ? ' class="active"' : "");

  const logo = `<a href="${u("index.html")}" class="logo"><svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="bpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><path d="M6 3h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H13l-6 5v-5H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" fill="url(#bpg)"/><g stroke="#0b0b14" stroke-width="2.4" stroke-linecap="round"><path d="M10 11v6"/><path d="M14 8v12"/><path d="M18 10v8"/><path d="M22 12v4"/></g></svg>Better<b>Pitch</b></a>`;

  const header = `
<div class="announce">BetterPitch voice agents from ₹3/minute · Now in 20+ Indian languages · <a href="${u("pricing.html")}">See plans →</a></div>
<nav>
  <div class="wrap">
    ${logo}
    <div class="menu">
      <div class="dd"><a href="${u("product-voice.html")}"${act("product-voice.html")}>Product ▾</a>
        <div class="dd-panel">
          <a href="${u("product-voice.html")}">🎙 Voice Agent<small>Answers and makes phone calls</small></a>
          <a href="${u("product-chat.html")}">💬 WhatsApp Follow-ups<small>Messages that continue after the call</small></a>
        </div></div>
      <a href="${u("solutions.html")}"${act("solutions.html")}>Solutions</a>
      <a href="${u("pricing.html")}"${act("pricing.html")}>Pricing</a>
      <a href="${u("case-studies.html")}"${act("case-studies.html")}>Customers</a>
      <div class="dd"><a href="${u("blog.html")}"${act("blog.html")}>Resources ▾</a>
        <div class="dd-panel">
          <a href="${u("blog.html")}">📝 Blog<small>Guides for growing teams</small></a>
          <a href="${u("compare/vs-call-center.html")}">⚖️ Compare<small>BetterPitch vs the alternatives</small></a>
        </div></div>
    </div>
    <div class="nav-right">
      <a class="hide-m" href="tel:+910000000000">+91 00000 00000</a>
      <a class="btn btn-primary hide-m" href="${u("contact.html")}">Book a demo</a>
      <button class="burger" aria-label="Open menu">☰</button>
    </div>
  </div>
  <div class="mobile-menu">
    <a href="${u("product-voice.html")}">Voice Agent</a><a href="${u("product-chat.html")}">WhatsApp Follow-ups</a>
    <a href="${u("solutions.html")}">Solutions</a><a href="${u("pricing.html")}">Pricing</a>
    <a href="${u("case-studies.html")}">Customers</a><a href="${u("blog.html")}">Blog</a>
    <a href="${u("contact.html")}" style="color:var(--accent)">Book a demo →</a>
  </div>
</nav>`;

  const footer = `
<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>${logo}<p style="margin-top:12px;max-width:260px">Voice AI agents that call, qualify and follow up in your customer's language. Made in India for Indian businesses.</p>
        <div class="social"><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="X">𝕏</a><a href="#" aria-label="YouTube">▶</a></div></div>
      <div><h4>Product</h4><ul><li><a href="${u("product-voice.html")}">Voice Agent</a></li><li><a href="${u("product-chat.html")}">WhatsApp Follow-ups</a></li><li><a href="${u("pricing.html")}">Pricing</a></li></ul></div>
      <div><h4>Solutions</h4><ul><li><a href="${u("solutions.html#bfsi")}">Banking &amp; NBFC</a></li><li><a href="${u("solutions.html#ecommerce")}">E-commerce &amp; D2C</a></li><li><a href="${u("solutions.html#real-estate")}">Real estate</a></li><li><a href="${u("solutions.html#education")}">Education</a></li><li><a href="${u("solutions.html#healthcare")}">Healthcare</a></li></ul></div>
      <div><h4>Resources</h4><ul><li><a href="${u("blog.html")}">Blog</a></li><li><a href="${u("case-studies.html")}">Case studies</a></li><li><a href="${u("compare/vs-call-center.html")}">vs Call center</a></li><li><a href="${u("compare/vs-ivr.html")}">vs IVR menus</a></li><li><a href="${u("compare/vs-in-house.html")}">vs In-house hire</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="${u("contact.html")}">Contact</a></li><li><a href="${u("privacy-policy.html")}">Privacy</a></li><li><a href="${u("terms.html")}">Terms</a></li></ul></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} BetterPitch · Demo project</span><span><a href="${u("privacy-policy.html")}">Privacy</a> · <a href="${u("terms.html")}">Terms</a></span></div>
  </div>
</footer>`;

  document.getElementById("site-header").outerHTML = header;
  document.getElementById("site-footer").outerHTML = footer;

  // mobile menu
  const mm = document.querySelector(".mobile-menu");
  document.querySelector(".burger").onclick = () => mm.classList.toggle("open");

  // logo marquee: duplicate items for a seamless loop
  document.querySelectorAll(".track").forEach((t) => (t.innerHTML += t.innerHTML));

  // scroll reveal
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // demo-only forms: show a thank-you message instead of submitting
  document.querySelectorAll("form[data-demo]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      f.querySelector(".ok-msg").style.display = "block";
      f.reset();
    })
  );
})();
