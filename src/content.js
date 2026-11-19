window.COSMOS = {
PLANETS: [
 {name:"Mercury", au:0.387, period:0.241, radius:2440, color:"#b8a89a", moons:0, fact:"A year on Mercury lasts 88 days, but a single solar day lasts 176 — two Mercurian years per day."},
 {name:"Venus", au:0.723, period:0.615, radius:6052, color:"#e0aa6e", moons:0, fact:"Venus spins backwards, and its day (243 Earth days) is longer than its year (225 days)."},
 {name:"Earth", au:1.0, period:1.0, radius:6371, color:"#4da6ff", moons:1, fact:"The only known world with life — and liquid-water oceans covering 71% of its surface."},
 {name:"Mars", au:1.524, period:1.881, radius:3390, color:"#ff6b47", moons:2, fact:"Olympus Mons on Mars is ~22 km high, nearly 3x Everest — the tallest volcano known."},
 {name:"Jupiter", au:5.203, period:11.86, radius:69911, color:"#d8a86e", moons:95, fact:"The Great Red Spot is a storm wider than Earth that has raged for centuries."},
 {name:"Saturn", au:9.537, period:29.45, radius:58232, color:"#e8d39a", moons:146, fact:"Saturn's rings span ~280,000 km yet are only ~10 m thick in places."},
 {name:"Uranus", au:19.19, period:84.02, radius:25362, color:"#8fe3e8", moons:28, fact:"Uranus rolls around the Sun on its side, tilted 98° — likely from a giant impact."},
 {name:"Neptune", au:30.07, period:164.8, radius:24622, color:"#5e7bff", moons:16, fact:"Neptune's supersonic winds reach 2,100 km/h — the fastest in the solar system."}
],
PARTICLES: [
 {s:"u", nm:"up quark", cls:"q", mass:"2.2 MeV/c²", charge:"+2/3", spin:"1/2", fact:"Two up quarks + one down quark make a proton."},
 {s:"d", nm:"down quark", cls:"q", mass:"4.7 MeV/c²", charge:"−1/3", spin:"1/2", fact:"Two downs + one up make a neutron."},
 {s:"c", nm:"charm quark", cls:"q", mass:"1.28 GeV/c²", charge:"+2/3", spin:"1/2", fact:"Predicted in 1970, found in 1974 — the 'November revolution'."},
 {s:"s", nm:"strange quark", cls:"q", mass:"95 MeV/c²", charge:"−1/3", spin:"1/2", fact:"Its 'strangeness' is conserved in strong decays, not weak ones."},
 {s:"t", nm:"top quark", cls:"q", mass:"173 GeV/c²", charge:"+2/3", spin:"1/2", fact:"Heaviest known particle — as heavy as a gold atom."},
 {s:"b", nm:"bottom quark", cls:"q", mass:"4.18 GeV/c²", charge:"−1/3", spin:"1/2", fact:"B-meson decays are a top lab for matter–antimatter asymmetry."},
 {s:"e", nm:"electron", cls:"l", mass:"511 keV/c²", charge:"−1", spin:"1/2", fact:"Stable, and chemistry is basically applied electron physics."},
 {s:"νₑ", nm:"electron neutrino", cls:"l", mass:"< 1 eV/c²", charge:"0", spin:"1/2", fact:" trillions pass through you every second, unnoticed."},
 {s:"μ", nm:"muon", cls:"l", mass:"106 MeV/c²", charge:"−1", spin:"1/2", fact:"Lives 2.2 μs — yet reaches the ground thanks to time dilation."},
 {s:"ν_μ", nm:"muon neutrino", cls:"l", mass:"< 1 eV/c²", charge:"0", spin:"1/2", fact:"Made in showers when cosmic rays hit the atmosphere."},
 {s:"τ", nm:"tau", cls:"l", mass:"1.78 GeV/c²", charge:"−1", spin:"1/2", fact:"Decays in 10⁻¹³ s into hadrons or lighter leptons."},
 {s:"ν_τ", nm:"tau neutrino", cls:"l", mass:"< 1 eV/c²", charge:"0", spin:"1/2", fact:"Last Standard Model particle found (2000, DONUT)."},
 {s:"γ", nm:"photon", cls:"b", mass:"0", charge:"0", spin:"1", fact:"Force carrier of electromagnetism; always moves at c."},
 {s:"g", nm:"gluon", cls:"b", mass:"0", charge:"0", spin:"1", fact:"Carries the strong force — and itself carries color charge."},
 {s:"W", nm:"W boson", cls:"b", mass:"80.4 GeV/c²", charge:"±1", spin:"1", fact:"Mediates beta decay: d → u + W⁻ inside neutrons."},
 {s:"Z", nm:"Z boson", cls:"b", mass:"91.2 GeV/c²", charge:"0", spin:"1", fact:"Neutral weak current — discovered at CERN in 1983."},
 {s:"H", nm:"Higgs boson", cls:"b", mass:"125 GeV/c²", charge:"0", spin:"0", fact:"Its field gives mass to W/Z and fermions; found 2012."}
],
GUIDE: [
 {t:"Dimensions — the full picture", b:[
 "<b>Projection is the core idea.</b> A 3D cube casts a 2D shadow; a 4D cube casts a 3D 'shadow' that we then draw in 2D. Every viz here is a shadow of a shadow — the math (rotation matrices, perspective divide f = d/(d−w)) is what makes it honest. <i>Pitfall: the inner cube is NOT smaller — it is farther in W.</i>",
 "<b>Count everything with powers of 2.</b> An n-cube has 2ⁿ vertices (each coordinate ±1) and n·2ⁿ⁻¹ edges (n directions per vertex, shared by 2). So 5D → 32 verts/80 edges, 6D → 64/192 — check the live counter. <i>Faces follow binomial coefficients C(n,2)·2ⁿ⁻².</i>",
 "<b>4D rotations have 6 planes.</b> Rotations happen in planes, not around axes: C(4,2) = XY, XZ, XW, YZ, YW, ZW. The XW/YW/ZW/VW sliders rotate in planes touching the 4th+ dimensions. <i>A 4D being could spin two planes at once (Clifford rotation) — try two sliders together.</i>",
 "<b>Slices beat projections for intuition.</b> A 3D sphere passing through Flatland looks like a growing-then-shrinking circle. Likewise a hypersphere x²+y²+z²+w²=r² sliced at fixed w shows our 3D ball growing then shrinking. <i>Set all sliders to 0 and drag one slowly: watch the inner cube breathe.</i>",
 "<b>Why it matters.</b> Spacetime is 4D; string theory uses 10–11; data science routinely embeds in hundreds of dimensions. The n-cube counting you did here is baby combinatorics for machine learning."]},
 {t:"Topology — the full picture", b:[
 "<b>Homeomorphism = bend, don't glue or cut.</b> Coffee cup ≅ donut (one hole each); sphere ≇ torus. The invariant that proves it: Euler characteristic χ = V − E + F (sphere 2, torus 0). Count it on the viz: a 4×4 wrapped grid gives 16−32+16 = 0. <i>χ survives every stretch — that is what 'topological' means.</i>",
 "<b>Orientability is one-sidedness.</b> The Möbius ant returns mirrored; the torus ant doesn't. Test: flip the shape to Möbius, trace a loop with your eye. <i>Non-orientable also means no consistent 'clockwise' — compasses break.</i>",
 "<b>Intrinsic vs extrinsic curvature.</b> A flat torus (video-game screen wrap) has zero curvature but the donut embedding curves — same topology, different geometry. Einstein's trick: gravity is intrinsic curvature of 4D spacetime, no outside needed. <i>The BH tab's funnel is extrinsic illustration of intrinsic truth.</i>",
 "<b>Klein bottles need 4D.</b> The bottle passing through itself is a 3D-projection artifact — in 4D it never self-intersects, just as a figure-8 immersion of a circle needs the plane crossing. <i>Its χ = 0 like the torus, but non-orientable like Möbius.</i>",
 "<b>Classify surfaces.</b> Every closed surface = sphere + g handles + k crosscaps. χ = 2 − 2g − k. Torus: g=1 → χ=0. Say it from memory and you own the topic."]},
 {t:"Trigonometry — the full picture", b:[
 "<b>Unit circle first, triangles second.</b> sin θ and cos θ are the y/x coordinates of a point riding the circle — the triangle ratios SOHCAHTOA are just similar-triangle consequences. Drag the dot: every identity is visible. <i>Signed coordinates kill 'which quadrant' confusion.</i>",
 "<b>One identity rules them all.</b> sin²θ + cos²θ = 1 is Pythagoras on the radius (x²+y²=1). Divide by cos² → tan²+1 = sec². Sum formulas fall out of rotation matrices. <i>Memorize the circle; derive the rest under exam pressure.</i>",
 "<b>Radians are the natural unit.</b> 180° = π because arc length = rθ with r=1. Calculus (d/dθ sin θ = cos θ) only works in radians. <i>If a formula has a stray π/180, you are in degree mode.</i>",
 "<b>Phase turns circles into waves.</b> y = sin x is the shadow of circular motion — that is why springs, sound, light, and AC current all obey it. The tree-height example (20·tan35° ≈ 14 m) is the same triangle unrolled. <i>Amplitude = radius, frequency = spin speed.</i>",
 "<b>Laws that solve any triangle.</b> Law of sines a/sin A = 2R links sides to the circumradius; law of cosines c² = a²+b²−2ab·cos C is Pythagoras with a correction term. <i>Ambiguous SSA case → 0, 1, or 2 triangles; draw it.</i>"]},
 {t:"Abstract algebra — the full picture", b:[
 "<b>Groups = symmetries with rules.</b> Closure, associativity, identity, inverses — that is the whole contract. Z₆ addition passes; subtraction fails (no identity behavior). <i>Check all four every time until it is reflex.</i>",
 "<b>Generators are the efficient few.</b> k generates Zₙ iff gcd(k,n)=1 — so Z₆ has generators 1, 5 (φ(6)=2). One element rebuilding the whole group is why cyclic groups model clocks, roots of unity, and RSA. <i>φ(n) counts them — Euler is everywhere.</i>",
 "<b>Non-abelian = order matters.</b> In D₃, r·s ≠ s·r: rotate-then-flip lands differently than flip-then-rotate. The Cayley table makes it undeniable — find an asymmetric pair. <i>Most of physics (rotations, matrices, quantum gates) is non-abelian.</i>",
 "<b>Lagrange constrains everything.</b> Subgroup size divides group size: D₃ (order 6) can only have subgroups of size 1, 2, 3, 6. No subgroup of order 4 — proof by counting. <i>Use it to rule out structures before hunting for them.</i>",
 "<b>Homomorphisms preserve structure.</b> The map Z → Zₙ (wrap around) sends + to + and kernels measure what collapses. Quotient D₃/{e,r,r²} ≅ flip-group: that is the First Isomorphism Theorem in one line. <i>Normal subgroups are exactly the collapsible ones.</i>"]},
 {t:"Determinism & chaos — the full picture", b:[
 "<b>Deterministic ≠ predictable.</b> Lorenz has zero randomness — yet two starts 0.001 apart diverge exponentially (positive Lyapunov exponent). Laplace's demon needs infinite precision; we get ~15 decimal digits. <i>Prediction horizon ≈ (digits)/(Lyapunov exponent).</i>",
 "<b>ρ = 28 is the edge.</b> Below ρ≈24.7 trajectories spiral into fixed points; above, the fixed points go unstable and the butterfly appears. Slide ρ slowly through the boundary in the viz. <i>Bifurcation = qualitative change at a parameter value.</i>",
 "<b>The logistic map is chaos in one line.</b> xₙ₊₁ = rxₙ(1−xₙ): period-doubling 2→4→8… then chaos at r≈3.57, with periodic windows inside chaos (e.g. period-3 at r≈3.83 — 'period three implies chaos'). <i>Feigenbaum's constant 4.669… governs every doubling cascade in nature.</i>",
 "<b>Strange attractors are fractal.</b> Lorenz's butterfly (≈2.06 dimensions) traps trajectories forever without ever repeating — bounded but aperiodic. Weather lives on one; that is why 14-day forecasts are fantasy but climate (the attractor's shape) is predictable. <i>Eclipses are clockwork; weather is chaos — both Newtonian.</i>",
 "<b>Sensitivity is measurable.</b> Double the initial gap and the divergence time barely moves (logarithmic). That is the real lesson: error bars grow exponentially, so quantify horizons instead of demanding certainty."]},
 {t:"Solar system — the full picture", b:[
 "<b>Kepler's third law is a clock.</b> T² = a³ (years, AU): Mars at 1.524 AU → T = √3.54 ≈ 1.88 yr. It falls out of gravity + circular motion in three lines — do the derivation once and never forget it. <i>Use the calculator, then verify against the viz speeds.</i>",
 "<b>Retrograde is a frame trick.</b> Mars loops backward because Earth laps it on the inside lane — no epicycle needed, just relative motion. Click planets and watch from the Sun's frame vs Earth's. <i>All 'weird' loops are viewpoint artifacts.</i>",
 "<b>Earth is a three-way coincidence.</b> Right distance (liquid water) + magnetic shield (deflects solar wind) + large Moon (stabilizes tilt, drives tides). Remove any one and biosphere odds crash. <i>Goldilocks zone shifts with star type — red dwarfs hug close.</i>",
 "<b>Gas giants are failed stars.</b> Jupiter is 318 Earth masses but needs ~13× more for deuterium fusion (brown dwarf) and ~80× for true stardom. The asteroid belt is leftover construction rubble Jupiter's gravity prevented from merging. <i>Count moons: Saturn leads at 146.</i>",
 "<b>Scales that humble.</b> Light takes 8 min from the Sun, 4 h from Neptune; the nearest star is 4.2 light-years — 7,000× farther than Neptune. The viz compresses distances 1000×; reality is mostly emptiness."]},
 {t:"Black holes — the full picture", b:[
 "<b>Schwarzschild radius is the point of no return.</b> r_s = 2GM/c² ≈ 2.95 km per solar mass: 10 M☉ → 29.5 km. Nothing about the surface is special locally — the horizon is a global causal boundary. <i>Escape velocity there is exactly c.</i>",
 "<b>Time stops at the horizon (from outside).</b> dτ = dt√(1−r_s/r): the probe readout hits zero at r = r_s. An infaller crosses in finite proper time; distant observers never see it happen — frozen, redshifted away. <i>Both views are correct; simultaneity is relative.</i>",
 "<b>The photon sphere is light's last orbit.</b> At 1.5 r_s light itself circles — the dashed ring in the viz. The glowing disk is infalling gas heated to X-ray temperatures; the shadow is ~2.6× r_s wide (M87* photo, 2019). <i>Interstellar's Gargantua got the lensing right.</i>",
 "<b>Spaghettification is tidal force.</b> Δg ∝ M/r³ stretches you head-to-toe while squeezing sides. Stellar holes kill before the horizon; supermassive ones (M87*: 6.5 billion M☉) are gentle at crossing — horizon curvature is mild. <i>Small holes: violent. Big holes: serene. Then the singularity.</i>",
 "<b>Hawking radiation leaks mass.</b> T ∝ 1/M: stellar holes are colder than the CMB (they grow!); only tiny primordial ones would glow. Evaporation takes 10⁶⁷+ years — the slowest show in physics."]},
 {t:"Neutron stars — the full picture", b:[
 "<b>A city with a Sun's mass.</b> Collapse halts at nuclear density (~4×10¹⁷ kg/m³) via neutron degeneracy + strong force. Radius ≈ 13.5 − 1.8·(M−1) km: heavier means smaller, until ~2.2 M☉ (TOV limit) where nothing holds — black hole. <i>A teaspoon weighs ~2 billion tons.</i>",
 "<b>Compactness near the limit.</b> 2GM/Rc² ≈ 0.3–0.4 vs a black hole's 1.0. Escape velocity ≈ half of c. Light bends visibly; you could see the star's far side. <i>Compare with the BH probe tab at 2 r_s.</i>",
 "<b>Pulsars are lighthouses, not blinkers.</b> Beams fixed to magnetic poles misaligned with spin sweep past us once per rotation — up to 716 Hz (J1748−2446ad). The light-curve viz shows exactly this: one spike per sweep. <i>1967: 'LGM-1' (Little Green Men) → pulsars, + Nobel 1974.</i>",
 "<b>Glitches are starquakes.</b> Spin-up jumps when crust cracks or superfluid vortices unpin — click the star to fire one. Timing rivals atomic clocks between glitches; arrays of pulsars form a galaxy-sized gravitational-wave detector (NANOGrav, 2023 signal). <i>Pulsars detect spacetime ripples.</i>",
 "<b>Births and mergers.</b> Born in supernovae (Crab Nebula, 1054 AD); die merging (GW170817, 2017) — forging gold/platinum in kilonovae and calibrating the cosmic distance ladder. <i>Your jewelry is neutron-star debris.</i>"]},
 {t:"Elements & gases — the full picture", b:[
 "<b>The table is organized by electrons.</b> Periods = shells, groups = outer-shell count: group 1 wants to lose an electron (alkali fireworks), group 17 wants one more (halogen fury), group 18 wants nothing (noble aloofness). <i>Position predicts personality.</i>",
 "<b>Only 11 gases, 2 liquids.</b> H, N, O, F, Cl + He, Ne, Ar, Kr, Xe, Rn are gases; Br and Hg are liquids; everything else is solid at STP. Filter by state in the table to see how rare gases are. <i>Air is ~78% N₂, 21% O₂, 1% Ar.</i>",
 "<b>Trends run diagonally.</b> Atomic radius shrinks left→right (nuclear pull) and grows top→down (new shells); electronegativity does the opposite. Fluorine is the greediest; francium the most generous. <i>Explains all of chemistry's 'why'.</i>",
 "<b>Synthetics fill the bottom row.</b> Elements past uranium (93+) are lab-made, atom-by-atom, decaying in milliseconds — Oganesson (118) completes period 7. <i>Island of stability: theorized longer-lived superheavies near Z≈114–126.</i>",
 "<b>You are stardust, itemized.</b> H from the Big Bang; C–Fe fused in stellar cores; everything heavier (Ag, Au, U) from supernovae and neutron-star mergers. The table is a census of cosmic violence."]},
 {t:"Aerodynamics — the full picture", b:[
 "<b>Lift is pressure + downwash.</b> Wings deflect air downward (Newton) via lower pressure above (Bernoulli): Cl ≈ 2π(α−α₀). Camber shifts α₀ negative so symmetric wings lift at α=0; the viz colors fast air white, slow blue. <i>Both explanations are the same physics in different frames.</i>",
 "<b>Stall is separation, not 'too slow'.</b> Past ~15° the boundary layer detaches, lift collapses, drag spikes — the wing turns red. Recovery: pitch DOWN, not up. <i>Every stall accident is this sentence ignored.</i>",
 "<b>Drag has two budgets.</b> Parasite drag (friction + shape, ∝ V²) dominates fast; induced drag (price of lift, ∝ Cl²) dominates slow. Best glide (max L/D ≈ 14:1 here) sits where they cross. <i>Albatrosses: 20:1. Paper plane: ~4:1.</i>",
 "<b>Reynolds number rules scaling.</b> Re = ρVL/μ decides whether flow is smooth or turbulent — paper planes and airliners live in different fluid worlds, which is why presets change everything. <i>Wind tunnels match Re, not size.</i>",
 "<b>The polar tells the story.</b> The Cl–α curve's slope (2π/radian), its peak (Cl_max), and the drop after are the wing's résumé. Fighter: thin, sharp stall. Cessna: docile, forgiving. <i>Read polars before cockpits.</i>"]},
 {t:"Particles — the full picture", b:[
 "<b>Three families, one rulebook.</b> Quarks feel all forces, leptons skip the strong force, bosons carry forces. Spin-½ = matter, integer spin = messenger (except Higgs, spin 0: congealed field). Filter the zoo by family. <i>Every atom: uud + udd + electrons — the rest is decoration.</i>",
 "<b>Charge arithmetic builds the world.</b> Proton = +2/3+2/3−1/3 = +1; neutron = +2/3−1/3−1/3 = 0. Gluons (color-charged themselves) glue with a force that GROWS with distance — pull quarks apart and new ones condense. <i>Quark confinement: solo quarks don't exist.</i>",
 "<b>The weak force transmutes elements.</b> d → u + W⁻ turns neutrons into protons — beta decay, sunshine (pp chain), and supernovae. It is the only interaction that changes flavor. <i>Without it: no fusion, no heavy elements, no you.</i>",
 "<b>Mass comes from drag, not stuff.</b> The Higgs field resists W/Z and fermions like cosmic molasses (2012 discovery); most of YOUR mass is actually gluon binding energy (E=mc²) inside protons. <i>Top quark: as heavy as gold, dead in 10⁻²⁵ s.</i>",
 "<b>Neutrinos are ghosts with leverage.</b> 10¹⁴ pass through you yearly; their tiny mass (oscillations, Nobel 2015) breaks the original Standard Model and may explain matter beating antimatter. <i>We are mostly empty space haunted by neutrinos.</i>"]}
]
};
