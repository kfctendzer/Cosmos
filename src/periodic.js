window.Periodic = {};
(function(){
function pos(Z){
  if(Z === 1) return [1, 1];
  if(Z === 2) return [1, 18];
  if(Z <= 4) return [2, Z - 2];
  if(Z <= 10) return [2, Z + 8];
  if(Z <= 12) return [3, Z - 10];
  if(Z <= 18) return [3, Z + 8];
  if(Z <= 36) return [4, Z - 18];
  if(Z <= 54) return [5, Z - 36];
  if(Z === 55) return [6, 1];
  if(Z === 56) return [6, 2];
  if(Z <= 71) return ["f0", Z - 57];
  if(Z <= 86) return [6, Z - 68];
  if(Z === 87) return [7, 1];
  if(Z === 88) return [7, 2];
  if(Z <= 103) return ["f1", Z - 89];
  return [7, Z - 100];
}
window.Periodic.init = function(){
  var grid = document.getElementById("elGrid"); if(!grid || !window.COSMOS.ELEMENTS) return;
  var detail = document.getElementById("elDetail");
  var search = document.getElementById("elSearch");
  var catSel = document.getElementById("elCat");
  var cats = window.COSMOS.CATS;
  Object.keys(cats).forEach(function(k){
    var o = document.createElement("option");
    o.value = k; o.textContent = cats[k][0];
    catSel.appendChild(o);
  });
  var cells = {};
  window.COSMOS.ELEMENTS.forEach(function(e){
    var Z = e[0], p = pos(Z), d = document.createElement("div");
    d.className = "el cat-" + e[4];
    d.innerHTML = "<span class='z'>" + Z + "</span><span class='sym'>" + e[1] + "</span>";
    d.title = e[2];
    d.onclick = function(){ show(e); };
    cells[Z] = d;
  });
  function show(e){
    grid.querySelectorAll(".el").forEach(function(x){ x.classList.remove("on"); });
    if(cells[e[0]]) cells[e[0]].classList.add("on");
    var st = e[5] === "g" ? "gas" : e[5] === "l" ? "liquid" : e[5] === "u" ? "unknown (synthetic)" : "solid";
    detail.innerHTML = "<b>" + e[1] + " — " + e[2] + " (#" + e[0] + ")</b><br>mass " + e[3] + " u · " + cats[e[4]][0] + " · " + st + " at STP" +
      "<br><span class='muted'>" + fact(e) + "</span>";
  }
  function fact(e){
    var Z = e[0], n = e[2];
    if(Z === 1) return "Lightest element; fuels the Sun via fusion and 75% of all normal matter.";
    if(Z === 2) return "Inert party gas; first type of fusion ash in stars.";
    if(Z === 6) return "Backbone of life: diamond, graphite, graphene, DNA.";
    if(Z === 7) return "78% of the air you breathe; laughing gas is its oxide.";
    if(Z === 8) return "You inhale it every 4 seconds; it makes fire possible.";
    if(Z === 26) return "Core of Earth, blood hemoglobin, and civilization's first metal age upgrade.";
    if(Z === 79) return "Never tarnishes — money, mummies, and spacecraft visors.";
    if(Z === 92) return "Heaviest natural element; powers reactors and once colored glass green.";
    if(e[4] === "ng") return "Noble: full electron shell, refuses to react — glowing signs love them.";
    if(e[4] === "hal") return "Halogen: one electron from happiness — viciously reactive (see: chlorine, fluorine).";
    if(e[4] === "alk") return "Alkali: explodes in water, melts in your hand (Cs), colors fireworks.";
    if(e[5] === "g") return "One of only 11 gases at STP — it floats free in the air around you.";
    if(e[5] === "l") return "One of only 2 liquid elements at room temperature (with " + (e[1] === "Br" ? "mercury" : "bromine") + ").";
    if(e[4] === "lan" || e[4] === "act") return "f-block " + (e[4] === "lan" ? "lanthanide" : "actinide") + ": buried f-electrons give magnets, phosphors" + (e[4] === "act" ? ", and radioactivity" : "") + ".";
    if(e[4] === "unk") return "Made atom-by-atom in accelerators; decays in milliseconds.";
    return n + ": atomic number " + Z + ", molar mass ≈ " + e[3] + " g/mol.";
  }
  function layout(){
    var q = (search.value || "").toLowerCase(), cf = catSel.value, sf = document.querySelector("[data-st].on");
    var stf = sf ? sf.getAttribute("data-st") : "";
    grid.innerHTML = "";
    var main = document.createElement("div"); main.className = "ptable";
    for(var r = 1; r <= 7; r++) for(var c = 1; c <= 18; c++){
      var slot = document.createElement("div");
      slot.className = "slot";
      slot.style.gridRow = r; slot.style.gridColumn = c;
      main.appendChild(slot);
    }
    var f0 = document.createElement("div"); f0.className = "ptable fblock";
    var f1 = document.createElement("div"); f1.className = "ptable fblock";
    for(var i = 0; i < 15; i++){
      var s0 = document.createElement("div"); s0.className = "slot"; s0.style.gridRow = 1; s0.style.gridColumn = i + 4; f0.appendChild(s0);
      var s1 = document.createElement("div"); s1.className = "slot"; s1.style.gridRow = 1; s1.style.gridColumn = i + 4; f1.appendChild(s1);
    }
    var shown = 0;
    window.COSMOS.ELEMENTS.forEach(function(e){
      var Z = e[0], p = pos(Z);
      var okQ = !q || e[1].toLowerCase().includes(q) || e[2].toLowerCase().includes(q) || String(Z) === q;
      var okC = !cf || e[4] === cf;
      var okS = !stf || e[5] === stf;
      var cell = cells[Z];
      if(okQ && okC && okS){
        shown++;
        cell.style.display = "";
        if(p[0] === "f0") f0.children[p[1]].appendChild(cell);
        else if(p[0] === "f1") f1.children[p[1]].appendChild(cell);
        else main.children[(p[0] - 1) * 18 + (p[1] - 1)].appendChild(cell);
      } else cell.style.display = "none";
    });
    grid.appendChild(main); grid.appendChild(f0); grid.appendChild(f1);
    var cnt = document.getElementById("elCount");
    if(cnt) cnt.textContent = shown + " / 118 shown — " + window.COSMOS.GASNOTE;
  }
  search.oninput = layout;
  catSel.onchange = layout;
  document.querySelectorAll("[data-st]").forEach(function(b){
    b.onclick = function(){
      var was = b.classList.contains("on");
      document.querySelectorAll("[data-st]").forEach(function(x){ x.classList.remove("on"); });
      if(!was) b.classList.add("on");
      layout();
    };
  });
  layout();
  show(window.COSMOS.ELEMENTS[5]);
};
})();
