import React, { useState, useEffect } from "react";
import {
  Shuffle,
  Users,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Trophy,
  RefreshCw,
  Check,
  Linkedin,
  Github,
} from "lucide-react";

const translations = {
  fr: {
    title: "TAEDRAW",
    subtitle: "Générateur de tirage pour tournoi",
    generate: "Générer",
    newTournament: "Nouveau tournoi",
    champion: "CHAMPION",
    final: "FINALE",
    semiFinal: "DEMI-FINALES",
    quarterFinal: "QUARTS DE FINALE",
    participants: "Participants",
    size: "Taille",
    finalists: "Finalistes potentiels",
    finalist1: "Finaliste 1",
    finalist2: "Finaliste 2",
    finalistNotFound: 'Le finaliste "{0}" est introuvable',
  },
  en: {
    title: "TAEDRAW",
    subtitle: "Tournament draw generator",
    generate: "Generate",
    newTournament: "New Tournament",
    champion: "CHAMPION",
    final: "FINAL",
    semiFinal: "SEMI-FINALS",
    quarterFinal: "QUARTER-FINALS",
    participants: "Participants",
    size: "Size",
    finalists: "Potential Finalists",
    finalist1: "Finalist 1",
    finalist2: "Finalist 2",
    finalistNotFound: 'Finalist "{0}" not found',
  },
  es: {
    title: "TAEDRAW",
    subtitle: "Generador de sorteos de torneos",
    generate: "Generar",
    newTournament: "Nuevo torneo",
    champion: "CAMPEÓN",
    final: "FINAL",
    semiFinal: "SEMIFINALES",
    quarterFinal: "CUARTOS DE FINAL",
    participants: "Participantes",
    size: "Tamaño",
    finalists: "Finalistas potenciales",
    finalist1: "Finalista 1",
    finalist2: "Finalista 2",
    finalistNotFound: 'No se encontró al finalista "{0}"',
  },
  ar: {
    title: "تايدرو",
    subtitle: "مولّد قرعة بطولة",
    generate: "إنشاء",
    newTournament: "بطولة جديدة",
    champion: "البطل",
    final: "النهائي",
    semiFinal: "نصف النهائي",
    quarterFinal: "ربع النهائي",
    participants: "المشاركون",
    size: "الحجم",
    finalists: "المتأهلون للنهائي",
    finalist1: "المتأهل 1",
    finalist2: "المتأهل 2",
    finalistNotFound: 'المتأهل "{0}" غير موجود',
  },
};

const socialLinks = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/wassim-bakir-617480339/",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/WasssBak",
    label: "Github",
  },
];

function App() {
  const [participants, setParticipants] = useState("");
  const [bracket, setBracket] = useState(null);
  const [tournamentSize, setTournamentSize] = useState(16);
  const [finalist1, setFinalist1] = useState("");
  const [finalist2, setFinalist2] = useState("");
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const t = translations[language];
  const currentYear = new Date().getFullYear();
  const toggleFullscreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const getRoundName = (idx, total) => {
    const rem = total - idx;
    if (rem === 1) return t.final;
    if (rem === 2) return t.semiFinal;
    if (rem === 3) return t.quarterFinal;
    return language === "ar" ? `الدور ${idx + 1}` : `ROUND ${idx + 1}`;
  };

  const generateBracket = () => {
    let names = participants
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");
    if (names.length < 2) return alert("Min 2 participants requis");

    const f1 = finalist1.trim(),
      f2 = finalist2.trim();
    let shuffled = [...names].sort(() => Math.random() - 0.5);

    if (f1 && f2) {
      shuffled = shuffled.filter((n) => n !== f1 && n !== f2);
      shuffled.splice(0, 0, f1);
      shuffled.splice(Math.floor(tournamentSize / 2), 0, f2);
    }

    while (shuffled.length < tournamentSize) shuffled.push("BYE");

    const firstRound = [];
    for (let i = 0; i < tournamentSize; i += 2) {
      const p1 = shuffled[i],
        p2 = shuffled[i + 1];
      firstRound.push({
        id: `r0-m${i / 2}`,
        p1,
        p2,
        winner: p1 === "BYE" ? p2 : p2 === "BYE" ? p1 : null,
      });
    }

    const allRounds = [firstRound];
    let matchesCount = tournamentSize / 4;
    let rIdx = 1;
    while (matchesCount >= 1) {
      allRounds.push(
        Array.from({ length: matchesCount }, (_, i) => ({
          id: `r${rIdx}-m${i}`,
          p1: "",
          p2: "",
          winner: null,
        })),
      );
      matchesCount /= 2;
      rIdx++;
    }
    setBracket({ rounds: allRounds });
  };

  const advanceWinner = (rIdx, mIdx, winner) => {
    if (winner === "BYE" || !winner) return;
    const newRounds = [...bracket.rounds];
    newRounds[rIdx][mIdx].winner = winner;

    if (rIdx < newRounds.length - 1) {
      const nextMatchIdx = Math.floor(mIdx / 2);
      if (mIdx % 2 === 0) newRounds[rIdx + 1][nextMatchIdx].p1 = winner;
      else newRounds[rIdx + 1][nextMatchIdx].p2 = winner;
    }
    setBracket({ ...bracket, rounds: newRounds });
  };

  const champion =
    bracket?.rounds[bracket.rounds.length - 1][0]?.winner || null;

  const MATCH_HEIGHT = 110; // Hauteur fixe d'une boîte de match
  const GAP_ROUND_0 = 32; // Espace entre les matchs au Tour 0

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-500 p-6 font-sans ${darkMode ? "bg-[#050a18] text-white" : "bg-slate-50 text-slate-900"}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-6 gap-x-4 mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border ${darkMode ? "bg-indigo-500/20 border-indigo-500/20 shadow-indigo-500/10" : "bg-indigo-500 text-white border-indigo-400"}`}
            >
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter italic leading-none">
                {t.title}
              </h1>
              <p className="text-[11px] opacity-60 uppercase tracking-widest mt-1 font-bold">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 p-2 rounded-2xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold px-2 outline-none cursor-pointer"
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="ar">🇸🇦 AR</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 hover:bg-slate-500/10 rounded-lg"
            >
              {darkMode ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-slate-500/10 rounded-lg"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </header>

        {!bracket ? (
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 block">
                  {t.size}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[8, 16, 32, 64, 128].map((size) => (
                    <button
                      key={size}
                      onClick={() => setTournamentSize(size)}
                      className={`py-3 rounded-xl font-bold border-2 ${tournamentSize === size ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-500/10 border-transparent"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`p-6 rounded-3xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 block">
                  {t.finalists}
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={t.finalist1}
                    value={finalist1}
                    onChange={(e) => setFinalist1(e.target.value)}
                    className={`w-full border p-3 rounded-xl outline-none text-sm ${darkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`}
                  />
                  <input
                    type="text"
                    placeholder={t.finalist2}
                    value={finalist2}
                    onChange={(e) => setFinalist2(e.target.value)}
                    className={`w-full border p-3 rounded-xl outline-none text-sm ${darkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`}
                  />
                </div>
              </div>
            </div>
            <textarea
              className={`w-full h-48 p-6 rounded-3xl border outline-none font-medium text-lg ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              placeholder="Un nom par ligne..."
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
            <button
              onClick={generateBracket}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Shuffle /> {t.generate}
            </button>
          </section>
        ) : (
          <section className="max-w-full overflow-x-auto pb-32 no-scrollbar">
            <button
              onClick={() => setBracket(null)}
              className="flex items-center gap-2 text-[11px] font-black uppercase opacity-50 hover:opacity-100 mb-10 ml-4"
            >
              <RefreshCw size={14} /> {t.newTournament}
            </button>

            <div className="flex items-start gap-16 px-8 min-w-max relative">
              {bracket.rounds.map((round, rIdx) => {
                // Calcul dynamique de la hauteur d'un "bloc" de match pour ce tour
                const cellHeight =
                  Math.pow(2, rIdx) * (MATCH_HEIGHT + GAP_ROUND_0);

                return (
                  <div key={rIdx} className="flex flex-col">
                    <div className="self-center mb-10">
                      <span
                        className={`px-5 py-2 rounded-full text-[10px] font-black border ${darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200"}`}
                      >
                        {getRoundName(rIdx, bracket.rounds.length)}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1">
                      {round.map((match, mIdx) => (
                        <div
                          key={match.id}
                          className="relative flex items-center justify-center"
                          style={{ height: `${cellHeight}px` }}
                        >
                          {/* Match Card */}
                          <div
                            className={`w-60 h-[110px] rounded-2xl border-2 transition-all relative z-10 overflow-hidden ${match.winner ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : darkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`}
                          >
                            {[match.p1, match.p2].map((p, pIdx) => (
                              <button
                                key={pIdx}
                                disabled={!p || p === "BYE"}
                                onClick={() => advanceWinner(rIdx, mIdx, p)}
                                className={`w-full h-1/2 p-4 text-left text-sm flex justify-between items-center transition-all ${match.winner === p ? "text-emerald-500 bg-emerald-500/10 font-bold" : "opacity-60"} ${pIdx === 0 ? (darkMode ? "border-b border-slate-800" : "border-b border-slate-100") : ""}`}
                              >
                                <span className="truncate pr-2">
                                  {p || "..."}
                                </span>
                                {match.winner === p && (
                                  <div className="p-0.5 bg-emerald-500 rounded-full text-white">
                                    <Check size={10} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>

                          {/* CONNECTEURS (FORKS) CORRIGÉS */}
                          {rIdx < bracket.rounds.length - 1 && (
                            <div
                              className={`absolute ${language === "ar" ? "right-full" : "left-full"} top-1/2 flex items-center pointer-events-none`}
                              style={{ width: "32px" }}
                            >
                              {/* Sortie horizontale du match */}
                              <div
                                className={`w-full h-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                              />

                              {/* Branche verticale du fork : sa hauteur est exactement égale à la moitié d'un cellHeight */}
                              <div
                                className={`absolute ${language === "ar" ? "left-0" : "right-0"} w-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                                style={{
                                  height: `${cellHeight / 2}px`,
                                  top: mIdx % 2 === 0 ? "50%" : "auto",
                                  bottom: mIdx % 2 !== 0 ? "50%" : "auto",
                                }}
                              />

                              {/* Entrée horizontale vers le tour suivant */}
                              {mIdx % 2 === 0 && (
                                <div
                                  className={`absolute ${language === "ar" ? "left-[-32px]" : "right-[-32px]"} w-[32px] h-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                                  style={{
                                    top: `${cellHeight / 2}px`,
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Champion Card */}
              {champion && (
                <div className="self-center px-12 animate-in fade-in zoom-in duration-700">
                  <div className="relative p-[3px] rounded-[40px] bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-2xl">
                    <div
                      className={`rounded-[38px] px-16 py-14 flex flex-col items-center ${darkMode ? "bg-[#0b1224]" : "bg-white"}`}
                    >
                      <div className="p-6 bg-amber-500/10 rounded-2xl mb-6">
                        <Trophy size={64} className="text-amber-500" />
                      </div>
                      <span className="text-[11px] font-black tracking-[0.5em] text-amber-500 mb-4 uppercase">
                        {t.champion}
                      </span>
                      <h2 className="text-5xl font-black italic">{champion}</h2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      <footer
        className={`py-12 border-t transition-colors duration-500 ${darkMode ? "bg-[#050a18] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo & Copyright */}
            <div className="text-center md:text-left">
              <a
                href="https://wassimbakir.netlify.app/"
                className="text-xl font-bold tracking-tight hover:text-indigo-500"
              >
                WB<span className="text-indigo-500">.</span>
              </a>
              <p className="text-sm opacity-60 mt-2">
                © {currentYear} Wassim Bakir. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2 rounded-full border transition-all ${
                    darkMode
                      ? "bg-slate-900/40 border-slate-800 hover:bg-indigo-500/10 hover:text-indigo-400"
                      : "bg-white border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                  }`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
