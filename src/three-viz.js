window.Viz = {};
(function(){
function fit(cv, h){
  var d = Math.min(2, window.devicePixelRatio || 1);
  var w = cv.clientWidth || cv.parentNode.clientWidth || 600;
  cv.width = Math.round(w * d); cv.height = Math.round(h * d);
  var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
  return {ctx: ctx, w: w, h: h};
}
function live(cv){ var s = cv.closest("section"); return s && s.classList.contains("on"); }
function rotXYZ(p, ax, ay){
  var x = p[0], y = p[1], z = p[2], c, s;
  c = Math.cos(ax); s = Math.sin(ax);
  var y1 = y * c - z * s, z1 = y * s + z * c;
  c = Math.cos(ay); s = Math.sin(ay);
  return [x * c + z1 * s, y1, -x * s + z1 * c];
}
function proj(p, w, h, sc, cx, cy){
  var f = 3.2 / (3.2 + p[2] * 0.55);
  return [cx + p[0] * sc * f, cy - p[1] * sc * f];
}

// ---- N-cube: square(2D) -> cube(3D) -> tesseract(4D) -> 5-cube -> 6-cube ----
window.Viz.initTesseract = function(){
  var cv = document.getElementById("tesCv"); if(!cv) return;
  var dim = 4, spin = true, t = 0, flash = 0;
  function build(n){
    var V = [], E = [], N = 1 << n;
    for(var i = 0; i < N; i++){
      var v = [];
      for(var k = 0; k < n; k++) v.push((i >> k) & 1 ? 1 : -1);
      V.push(v);
    }
    for(var a = 0; a < N; a++) for(var b = a + 1; b < N; b++){
      var d = 0;
      for(var k2 = 0; k2 < n; k2++) if(((a >> k2) & 1) !== ((b >> k2) & 1)) d++;
      if(d === 1) E.push([a, b]);
    }
    return {V: V, E: E};
  }
  var model = build(4);
  document.querySelectorAll("[data-dim]").forEach(function(b){
    b.onclick = function(){
      dim = parseInt(b.getAttribute("data-dim"), 10);
      model = build(dim);
      flash = 1;
      document.querySelectorAll("[data-dim]").forEach(function(x){ x.classList.toggle("on", x === b); });
    };
  });
  var btn = document.getElementById("tesSpin");
  if(btn) btn.onclick = function(){ spin = !spin; btn.classList.toggle("on", spin); };
  cv.addEventListener("click", function(){ spin = !spin; if(btn) btn.classList.toggle("on", spin); });
  function sl(id){ var el = document.getElementById(id); return el ? parseFloat(el.value) : 0; }
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    if(spin) t += 0.008;
    if(flash > 0) flash -= 0.03;
    var angs = [sl("tesXW") + t, sl("tesYW") + t * 0.7, sl("tesZW") + t * 0.4, sl("tesVW") + t * 0.55];
    var planes = [[0, 3], [1, 3], [2, 3], [0, 4], [1, 4], [2, 4], [3, 4], [0, 5], [1, 5]];
    var P = model.V.map(function(v){
      var p = v.slice();
      for(var pi = 0; pi < planes.length; pi++){
        var A = planes[pi];
        if(A[1] >= dim) continue;
        var th = angs[pi % angs.length] * (pi < 4 ? 1 : 0.6);
        var c = Math.cos(th), s = Math.sin(th);
        var u = p[A[0]] * c - p[A[1]] * s, w2 = p[A[0]] * s + p[A[1]] * c;
        p[A[0]] = u; p[A[1]] = w2;
      }
      for(var k = dim - 1; k >= 3; k--){
        var f = 2.6 / (2.6 - p[k] * 0.42);
        for(var j = 0; j < 3; j++) p[j] *= f;
      }
      var p3 = rotXYZ([p[0], p[1], dim > 2 ? p[2] : 0], 0.5, t * 0.3);
      return proj(p3, W, H, Math.min(W, H) * (dim <= 3 ? 0.3 : 0.16), W / 2, H / 2);
    });
    ctx.clearRect(0, 0, W, H);
    var glow = 0.55 + flash * 0.45;
    ctx.strokeStyle = "rgba(94,231,255," + glow.toFixed(2) + ")"; ctx.lineWidth = dim > 5 ? 0.7 : 1.2;
    ctx.beginPath();
    model.E.forEach(function(e){ ctx.moveTo(P[e[0]][0], P[e[0]][1]); ctx.lineTo(P[e[1]][0], P[e[1]][1]); });
    ctx.stroke();
    var step = dim >= 6 ? 4 : dim === 5 ? 2 : 1;
    for(var i = 0; i < P.length; i += step){
      ctx.fillStyle = (i & 8) ? "#a78bfa" : "#5ee7ff";
      ctx.beginPath(); ctx.arc(P[i][0], P[i][1], dim > 5 ? 1.6 : 3, 0, 7); ctx.fill();
    }
    var st = document.getElementById("tesStats");
    if(st){
      var N = 1 << dim, E = dim * N / 2;
      st.textContent = "D=" + dim + " · " + N + " vertices · " + E + " edges · click viz to pause · angles " +
        angs[0].toFixed(2) + " / " + angs[1].toFixed(2) + " / " + angs[2].toFixed(2);
    }
  }
  frame();
};

// ---- topology ----
window.Viz.initTopology = function(){
  var cv = document.getElementById("topoCv"); if(!cv) return;
  var shape = "torus", wire = true, t = 0, drx = 0.9, dry = 0, drag = false, lx = 0, ly = 0;
  cv.style.cursor = "grab";
  cv.addEventListener("pointerdown", function(e){ drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; });
  cv.addEventListener("pointermove", function(e){
    if(!drag) return;
    dry += (e.clientX - lx) * 0.01; drx += (e.clientY - ly) * 0.01;
    drx = Math.max(-1.5, Math.min(1.5, drx));
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener("pointerup", function(){ drag = false; cv.style.cursor = "grab"; });
  document.querySelectorAll("[data-shape]").forEach(function(b){
    b.onclick = function(){
      shape = b.getAttribute("data-shape");
      document.querySelectorAll("[data-shape]").forEach(function(x){ x.classList.toggle("on", x === b); });
      var chi = shape === "torus" ? "0" : shape === "mobius" ? "0 (1 boundary, non-orientable)" : "0 (non-orientable, no inside)";
      var co = document.getElementById("topoChi"); if(co) co.textContent = "χ = " + chi;
      var oo = document.getElementById("topoOrient");
      if(oo) oo.textContent = shape === "torus" ? "orientable: yes (two-sided)" : "orientable: no (one-sided)";
    };
  });
  var wb = document.getElementById("topoWire");
  if(wb) wb.onclick = function(){ wire = !wire; wb.classList.toggle("on", wire); };
  function surf(u, v, R, r){
    if(shape === "torus") return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)];
    if(shape === "mobius"){ var w = v - 0.5; return [(R + w * Math.cos(u / 2)) * Math.cos(u), (R + w * Math.cos(u / 2)) * Math.sin(u), w * Math.sin(u / 2)]; }
    var a = (R * 0.5 + r * Math.cos(u) * Math.cos(u / 2) - r * Math.sin(u) * Math.sin(u / 2)) ;
    return [a * Math.cos(v), a * Math.sin(v), r * Math.sin(u) * Math.cos(u / 2) + r * Math.cos(u) * Math.sin(u / 2)];
  }
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    t += 0.01;
    var R = parseFloat((document.getElementById("topoR") || {}).value || 1.6);
    var r = parseFloat((document.getElementById("topoR2") || {}).value || 0.6);
    var o1 = document.getElementById("topoRO"); if(o1) o1.textContent = R.toFixed(2);
    var o2 = document.getElementById("topoR2O"); if(o2) o2.textContent = r.toFixed(2);
    ctx.clearRect(0, 0, W, H);
    var NU = 40, NV = shape === "mobius" ? 8 : 20, sc = Math.min(W, H) * 0.16;
    function pt(u, v){
      var p = rotXYZ(surf(u, v, R, r), drx, dry + t * 0.4);
      return proj(p, W, H, sc, W / 2, H / 2);
    }
    ctx.lineWidth = 1;
    for(var i = 0; i <= NU; i++){
      var u = i / NU * Math.PI * 2;
      ctx.beginPath();
      for(var j = 0; j <= NV; j++){
        var v = shape === "mobius" ? j / NV : j / NV * Math.PI * 2;
        var q = pt(u, v);
        if(j) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
      }
      ctx.strokeStyle = "rgba(94,231,255," + (wire ? ".5" : ".12") + ")";
      ctx.stroke();
    }
    for(var j2 = 0; j2 <= NV; j2 += 2){
      var v2 = shape === "mobius" ? j2 / NV : j2 / NV * Math.PI * 2;
      ctx.beginPath();
      for(var i2 = 0; i2 <= NU; i2 += 2){
        var q2 = pt(i2 / NU * Math.PI * 2, v2);
        if(i2) ctx.lineTo(q2[0], q2[1]); else ctx.moveTo(q2[0], q2[1]);
      }
      ctx.strokeStyle = "rgba(167,139,250,.5)"; ctx.stroke();
    }
  }
  frame();
};

// ---- lorenz ----
window.Viz.initLorenz = function(){
  var cv = document.getElementById("lorCv"); if(!cv) return;
  var pts = [], x = 1, y = 1, z = 1;
  function par(id, d){ var el = document.getElementById(id); return el ? parseFloat(el.value) : d; }
  var rb = document.getElementById("lorReset");
  if(rb) rb.onclick = function(){ pts = []; x = 1; y = 1; z = 1; };
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 300), ctx = S.ctx, W = S.w, H = S.h;
    var sg = par("lorSigma", 10), rh = par("lorRho", 28), bt = par("lorBeta", 8/3);
    var o1 = document.getElementById("lorSigmaO"); if(o1) o1.textContent = sg.toFixed(1);
    var o2 = document.getElementById("lorRhoO"); if(o2) o2.textContent = rh.toFixed(1);
    var o3 = document.getElementById("lorBetaO"); if(o3) o3.textContent = bt.toFixed(2);
    var dt = 0.008;
    for(var i = 0; i < 6; i++){
      var dx = sg * (y - x), dy = x * (rh - z) - y, dz = x * y - bt * z;
      x += dx * dt; y += dy * dt; z += dz * dt;
      pts.push([x, z]); if(pts.length > 2600) pts.shift();
    }
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(94,231,255,.8)"; ctx.lineWidth = 1.1; ctx.beginPath();
    pts.forEach(function(p, k){
      var px = W / 2 + (p[0] - 2) * W * 0.022, py = H * 0.92 - p[1] * H * 0.02;
      if(k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    });
    ctx.stroke();
    var rg = document.getElementById("lorRegime");
    if(rg) rg.textContent = rh < 1 ? "settles to origin (stable)" : rh < 24.7 ? "spirals to a fixed point" : rh < 100 ? "chaotic butterfly (strange attractor)" : "chaotic, widening lobes";
  }
  frame();
};

// ---- solar ----
window.Viz.initSolar = function(){
  var cv = document.getElementById("solarCv"); if(!cv) return;
  var P = window.COSMOS.PLANETS;
  var ang = P.map(function(_, i){ return i * 0.8; });
  var sel = 2, run = true, labels = true;
  var pb = document.getElementById("solPause");
  if(pb) pb.onclick = function(){ run = !run; pb.textContent = run ? "pause" : "play"; };
  var lb = document.getElementById("solLabels");
  if(lb) lb.onclick = function(){ labels = !labels; lb.classList.toggle("on", labels); };
  if(lb) lb.classList.add("on");
  var box = document.getElementById("planetBtns");
  if(box){
    P.forEach(function(p, i){
      var b = document.createElement("button");
      b.textContent = p.name; if(i === 2) b.classList.add("on");
      b.onclick = function(){
        sel = i;
        box.querySelectorAll("button").forEach(function(x, k){ x.classList.toggle("on", k === i); });
        showInfo(i);
      };
      box.appendChild(b);
    });
  }
  function showInfo(i){
    var p = P[i], el = document.getElementById("planetInfo"); if(!el) return;
    el.innerHTML = "<b>" + p.name + "</b> — " + p.au + " AU · " + p.period + " yr · R " + p.radius.toLocaleString() + " km · " + p.moons + " moons<br><span class='muted'>" + p.fact + "</span>";
  }
  showInfo(2);
  cv.addEventListener("click", function(ev){
    var r = cv.getBoundingClientRect();
    var mx = ev.clientX - r.left, my = ev.clientY - r.top;
    var S = {w: r.width, h: 420}, cx = S.w / 2, cy = S.h / 2, R0 = Math.min(S.w, S.h) * 0.44;
    var best = -1, bd = 1e9;
    P.forEach(function(p, i){
      var rr = 26 + i * ((R0 - 34) / 7);
      var px = cx + Math.cos(ang[i]) * rr, py = cy + Math.sin(ang[i]) * rr * 0.62;
      var d = Math.hypot(mx - px, my - py);
      if(d < 18 && d < bd){ bd = d; best = i; }
    });
    if(best >= 0){
      sel = best;
      if(box) box.querySelectorAll("button").forEach(function(x, k){ x.classList.toggle("on", k === best); });
      showInfo(best);
    }
  });
  var kg = document.getElementById("kepGo");
  if(kg) kg.onclick = function(){
    var a = parseFloat((document.getElementById("kepA") || {}).value || 1);
    var o = document.getElementById("kepOut");
    if(o && a > 0) o.textContent = "T = √a³ = " + Math.sqrt(a * a * a).toFixed(3) + " yr (" + Math.round(Math.sqrt(a*a*a) * 365.25) + " days)";
  };
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    var sp = parseFloat((document.getElementById("solSpeed") || {}).value || 1);
    var so = document.getElementById("solSpeedO"); if(so) so.textContent = sp.toFixed(1) + "×";
    if(run) P.forEach(function(p, i){ ang[i] += 0.0035 * sp / Math.sqrt(Math.pow(p.au, 1.5)); });
    var cx = W / 2, cy = H / 2, R0 = Math.min(W, H) * 0.44;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffd479";
    ctx.shadowColor = "#ffd479"; ctx.shadowBlur = 22;
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
    P.forEach(function(p, i){
      var rr = 26 + i * ((R0 - 34) / 7);
      ctx.strokeStyle = "rgba(140,170,220,.18)";
      ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * 0.62, 0, 0, 7); ctx.stroke();
      var px = cx + Math.cos(ang[i]) * rr, py = cy + Math.sin(ang[i]) * rr * 0.62;
      var sz = 2.5 + Math.sqrt(p.radius) * 0.045;
      if(i === sel){ ctx.strokeStyle = "#5ee7ff"; ctx.beginPath(); ctx.arc(px, py, sz + 5, 0, 7); ctx.stroke(); }
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(px, py, sz, 0, 7); ctx.fill();
      if(p.name === "Saturn"){ ctx.strokeStyle = "rgba(232,211,154,.7)"; ctx.beginPath(); ctx.ellipse(px, py, sz + 5, (sz + 5) * 0.45, -0.4, 0, 7); ctx.stroke(); }
      if(p.name === "Earth"){
        var mx = px + Math.cos(ang[2] * 6) * (sz + 7), my = py + Math.sin(ang[2] * 6) * (sz + 7);
        ctx.fillStyle = "#cfd6e4"; ctx.beginPath(); ctx.arc(mx, my, 1.6, 0, 7); ctx.fill();
      }
      if(labels){ ctx.fillStyle = "rgba(220,232,255,.75)"; ctx.font = "10px sans-serif"; ctx.fillText(p.name, px + sz + 3, py + 3); }
    });
  }
  frame();
};

// ---- black hole ----
window.Viz.initBlackhole = function(){
  var cv = document.getElementById("bhCv"); if(!cv) return;
  var parts = [];
  for(var i = 0; i < 90; i++) parts.push({r: 30 + Math.random() * 130, a: Math.random() * 7, s: 0.5 + Math.random()});
  function frame(){
    requestAnimationFrame(frame);
    if(!live(cv)) return;
    var S = fit(cv, 420), ctx = S.ctx, W = S.w, H = S.h;
    var M = parseFloat((document.getElementById("bhMass") || {}).value || 8);
    var pr = parseFloat((document.getElementById("bhProbe") || {}).value || 6);
    var mo = document.getElementById("bhMassO"); if(mo) mo.textContent = M.toFixed(0) + " M☉";
    var po = document.getElementById("bhProbeO"); if(po) po.textContent = pr.toFixed(1) + " rs";
    var cx = W / 2, cy = H / 2;
    var rs = 6 + M * 2.2;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(120,160,255,.16)"; ctx.lineWidth = 1;
    for(var g = -10; g <= 10; g++){
      ctx.beginPath();
      for(var s = -160; s <= 160; s += 6){
        var X = cx + s * W / 340, Y = cy + g * H / 24;
        var dx = X - cx, dy = Y - cy, d = Math.hypot(dx, dy) || 1;
        var pull = Math.min(80, (M * 30000) / (d * d + 2500));
        X += -dx / d * pull; Y += -dy / d * pull;
        if(s === -160) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.beginPath();
      for(var s2 = -110; s2 <= 110; s2 += 6){
        var Y2 = cy + s2 * H / 240, X2 = cx + g * W / 22;
        var dx2 = X2 - cx, dy2 = Y2 - cy, d2 = Math.hypot(dx2, dy2) || 1;
        var pull2 = Math.min(80, (M * 30000) / (d2 * d2 + 2500));
        X2 += -dx2 / d2 * pull2; Y2 += -dy2 / d2 * pull2;
        if(s2 === -110) ctx.moveTo(X2, Y2); else ctx.lineTo(X2, Y2);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,213,79,.55)"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.arc(cx, cy, rs * 1.5, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    parts.forEach(function(p){
      p.a += 0.02 * p.s * Math.sqrt(M / 8) * (40 / p.r);
      var rr = rs * 1.7 + p.r * 0.55;
      var X = cx + Math.cos(p.a) * rr, Y = cy + Math.sin(p.a) * rr * 0.5;
      ctx.fillStyle = "rgba(255,170,90,.85)";
      ctx.fillRect(X, Y, 2, 2);
    });
    var grad = ctx.createRadialGradient(cx, cy, rs * 0.2, cx, cy, rs);
    grad.addColorStop(0, "#000"); grad.addColorStop(0.85, "#000"); grad.addColorStop(1, "rgba(255,150,80,.9)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, rs, 0, 7); ctx.fill();
    ctx.fillStyle = "rgba(220,232,255,.7)"; ctx.font = "10px sans-serif";
    ctx.fillText("photon sphere 1.5 rs", cx + rs * 1.5 + 5, cy - 4);
    var e1 = document.getElementById("bhRs");
    if(e1) e1.textContent = (2.95 * M).toFixed(1) + " km";
    var f = 1 - 1 / pr, e2 = document.getElementById("bhDil");
    if(e2) e2.textContent = f <= 0 ? "— (inside horizon)" : "×" + Math.sqrt(f).toFixed(3);
    var e3 = document.getElementById("bhEsc");
    if(e3) e3.textContent = pr <= 1 ? "≥ c (trapped)" : (299792 * Math.sqrt(2 / pr) > 299792 ? "≥ c" : Math.round(299792 * Math.sqrt(2 / pr)).toLocaleString() + " km/s");
  }
  frame();
}
})();
