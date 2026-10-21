// Animated "video" demos: <div class="video demo-player" data-demo="emi"></div>
// Each demo plays a scripted call (transcript, waveform, outcome chips) on a timeline with
// play/pause, seek and optional voice-over via the browser's speech synthesis.
(function () {
  const DEMOS = {
    emi: {
      title: "EMI reminder call", tag: "Collections · Hinglish", caller: "Ramesh Kumar", company: "Fintrail Finance", initials: "RK",
      lines: [
        ["agent", "Namaste Ramesh ji, main Asha bol rahi hoon Fintrail Finance se.", 4],
        ["agent", "Aapki ₹6,450 ki EMI is mahine 5 tareekh ko due hai.", 4],
        ["user", "Haan pata hai, lekin salary 7 tareekh ko aayegi.", 4],
        ["agent", "Koi baat nahi. Kya main 7 tareekh ko payment note kar loon?", 4.5],
        ["user", "Haan, 7 ko pakka kar dunga.", 3],
        ["agent", "Done! Main abhi WhatsApp par payment link bhej rahi hoon. Dhanyavaad!", 5],
      ],
      events: [[4, "📅 Promise to pay · 7th"], [5, "💬 WhatsApp link sent"], [5, "✅ CRM updated"]],
    },
    realestate: {
      title: "Real estate lead qualification", tag: "Outbound · English", caller: "Priya Sharma", company: "Skyline Homes", initials: "PS",
      lines: [
        ["agent", "Hi Priya, this is BetterPitch calling for Skyline Homes. You enquired about 2BHK flats in Whitefield?", 5.5],
        ["user", "Yes! I'm looking for something ready to move.", 3.5],
        ["agent", "Great. What budget range are you considering?", 3.5],
        ["user", "Around eighty lakh.", 2.5],
        ["agent", "We have two ready-to-move options in that range. Would a site visit this Saturday work?", 5],
        ["user", "Saturday 11 am is perfect.", 3],
        ["agent", "Booked! You'll get the location pin on WhatsApp. See you Saturday.", 4.5],
      ],
      events: [[3, "🔥 Lead score · Hot"], [3, "💰 Budget · ₹80L"], [6, "📅 Site visit · Sat 11:00"], [6, "👤 Assigned to sales rep"]],
    },
    cod: {
      title: "COD order confirmation", tag: "E-commerce · Hindi", caller: "Sunita Verma", company: "Kiranaly", initials: "SV",
      lines: [
        ["agent", "Namaste Sunita ji, Kiranaly se call hai. Aapne ₹1,299 ka cash on delivery order kiya hai.", 5],
        ["agent", "Kya main confirm kar sakti hoon ki order bhejna hai?", 3.5],
        ["user", "Haan, bhej dijiye.", 2.5],
        ["agent", "Address hai: 14, Shanti Nagar, Jaipur. Kya yeh sahi hai?", 4.5],
        ["user", "Haan, bilkul sahi hai.", 2.5],
        ["agent", "Shukriya! Aapka order kal tak dispatch ho jayega.", 4],
      ],
      events: [[2, "✅ Order confirmed"], [4, "📍 Address verified"], [5, "🚚 Released for dispatch"]],
    },
  };

  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  const canSpeak = "speechSynthesis" in window;

  function mount(el) {
    const d = DEMOS[el.dataset.demo];
    if (!d) return;
    // cumulative start time of each line
    let t = 1;
    const starts = d.lines.map((l) => { const s = t; t += l[2]; return s; });
    const total = t + 1.5;

    el.innerHTML = `
      <div class="dp-stage">
        <div class="dp-call">
          <div class="dp-tag">${d.tag}</div>
          <div class="dp-avatar">${d.initials}</div>
          <b>${d.caller}</b><small>${d.company} · BetterPitch agent</small>
          <div class="dp-timer">00:00</div>
          <div class="dp-wave">${"<i></i>".repeat(28)}</div>
        </div>
        <div class="dp-right">
          <div class="dp-lines"></div>
          <div class="dp-chips"></div>
        </div>
      </div>
      <div class="dp-poster">
        <button class="dp-big" aria-label="Play demo"></button>
        <b>${d.title}</b><small>${d.tag} · ${fmt(total)}</small>
      </div>
      <div class="dp-bar">
        <button class="dp-pp" aria-label="Play">▶</button>
        <div class="dp-track"><i></i></div>
        <span class="dp-time">0:00 / ${fmt(total)}</span>
        ${canSpeak ? '<button class="dp-snd" aria-label="Toggle voice">🔇</button>' : ""}
        <button class="dp-rs" aria-label="Restart">↺</button>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const linesBox = $(".dp-lines"), chipsBox = $(".dp-chips"), fill = $(".dp-track i");
    let now = 0, playing = false, last = 0, shown = -1, sound = false;

    function speak(text, who) {
      if (!sound || !canSpeak) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN"; u.rate = 1.02; u.pitch = who === "agent" ? 1.15 : 0.9;
      const v = speechSynthesis.getVoices().find((x) => x.lang === "en-IN" || x.lang === "hi-IN");
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    }

    // rebuild the visible state for time `now` (used for seeking and every frame)
    function render(seek) {
      const idx = starts.filter((s) => s <= now).length - 1;
      if (seek || idx < shown) { linesBox.innerHTML = ""; chipsBox.innerHTML = ""; shown = -1; }
      while (shown < idx) {
        shown++;
        const [who, text] = d.lines[shown];
        const div = document.createElement("div");
        div.className = "dp-line " + who;
        div.innerHTML = `<span>${who === "agent" ? "BetterPitch" : d.caller.split(" ")[0]}</span>${text}`;
        linesBox.appendChild(div);
        if (!seek) speak(text, who);
      }
      // chips for every line already finished
      const done = starts.filter((s, i) => s + d.lines[i][2] <= now).length;
      const want = d.events.filter((e) => e[0] <= done).map((e) => e[1]);
      if (chipsBox.children.length !== want.length) chipsBox.innerHTML = want.map((c) => `<span>${c}</span>`).join("");
      linesBox.scrollTop = linesBox.scrollHeight;
      const talking = idx >= 0 && now < starts[idx] + d.lines[idx][2] - 0.4 ? d.lines[idx][0] : "";
      el.dataset.talking = playing ? talking : "";
      $(".dp-timer").textContent = "00:" + String(Math.floor(now)).padStart(2, "0");
      fill.style.width = (now / total) * 100 + "%";
      $(".dp-time").textContent = fmt(now) + " / " + fmt(total);
    }

    function frame(ts) {
      if (!playing) return;
      now += (ts - last) / 1000; last = ts;
      if (now >= total) { now = total; pause(); el.classList.add("ended"); }
      render(false);
      if (playing) requestAnimationFrame(frame);
    }
    function play() {
      if (now >= total) restart();
      playing = true; el.classList.add("started", "playing"); el.classList.remove("ended");
      $(".dp-pp").textContent = "❚❚"; last = performance.now(); requestAnimationFrame(frame);
    }
    function pause() {
      playing = false; el.classList.remove("playing"); $(".dp-pp").textContent = "▶";
      el.dataset.talking = ""; if (canSpeak) speechSynthesis.cancel();
    }
    function restart() { now = 0; render(true); }

    $(".dp-big").onclick = play;
    $(".dp-pp").onclick = () => (playing ? pause() : play());
    $(".dp-rs").onclick = () => { restart(); play(); };
    if (canSpeak) $(".dp-snd").onclick = () => { sound = !sound; $(".dp-snd").textContent = sound ? "🔊" : "🔇"; if (!sound) speechSynthesis.cancel(); };
    $(".dp-track").onclick = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      now = Math.max(0, Math.min(total, ((e.clientX - r.left) / r.width) * total));
      if (canSpeak) speechSynthesis.cancel();
      el.classList.add("started"); render(true);
    };
    // pause when scrolled out of view
    new IntersectionObserver((es) => es.forEach((x) => !x.isIntersecting && playing && pause())).observe(el);
    render(true);
  }

  document.querySelectorAll(".demo-player").forEach(mount);
})();
