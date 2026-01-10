import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Download,
  FileText,
  Plus,
  X,
  ChevronDown,
  Pencil,
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
    importFile: "Importer",
    exportResults: "Exporter",
    createTournament: "Créer tournoi",
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
    importFile: "Import",
    exportResults: "Export",
    createTournament: "Create Tournament",
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
    importFile: "Importar",
    exportResults: "Exportar",
    createTournament: "Crear torneo",
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
    importFile: "استيراد",
    exportResults: "تصدير",
    createTournament: "إنشاء بطولة",
  },
};

const socialLinks = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/wassim-bakir-617480339/",
    label: "LinkedIn",
  },
  { icon: Github, href: "https://github.com/WasssBak", label: "Github" },
];

function App() {
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem("taedraw_data");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Tournament 1",
            participants: "",
            bracket: null,
            tournamentSize: 16,
            finalist1: "",
            finalist2: "",
          },
        ];
  });
  const [activeTournamentId, setActiveTournamentId] = useState(1);
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTournamentMenu, setShowTournamentMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef(null);
  const exportMenuRef = useRef(null);

  const activeTournament = tournaments.find((t) => t.id === activeTournamentId);
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem("taedraw_data", JSON.stringify(tournaments));
  }, [tournaments]);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateTournament = (updates) => {
    setTournaments((prev) =>
      prev.map((tour) =>
        tour.id === activeTournamentId ? { ...tour, ...updates } : tour,
      ),
    );
  };

  const createNewTournament = () => {
    const newId = Math.max(...tournaments.map((t) => t.id)) + 1;
    const newTournament = {
      id: newId,
      name: `Tournament ${newId}`,
      participants: "",
      bracket: null,
      tournamentSize: 16,
      finalist1: "",
      finalist2: "",
    };
    setTournaments([...tournaments, newTournament]);
    setActiveTournamentId(newId);
    setShowTournamentMenu(false);
  };

  const deleteTournament = (id) => {
    if (tournaments.length === 1)
      return alert("Cannot delete the last tournament");
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    if (activeTournamentId === id) {
      setActiveTournamentId(tournaments.find((t) => t.id !== id).id);
    }
  };

  const startEditingTournament = (id, currentName) => {
    setEditingTournamentId(id);
    setEditingName(currentName);
  };

  const saveTournamentName = (id) => {
    if (editingName.trim()) {
      setTournaments((prev) =>
        prev.map((tour) =>
          tour.id === id ? { ...tour, name: editingName.trim() } : tour,
        ),
      );
    }
    setEditingTournamentId(null);
    setEditingName("");
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const names = text
        .split(/\r?\n/)
        .map((line) => line.split(",")[0].trim())
        .filter((n) => n !== "");
      if (names.length > 0)
        updateTournament({ participants: names.join("\n") });
      else alert("No valid names found");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const exportToPDF = () => {
    const { bracket, name } = activeTournament;
    if (!bracket) return;
    const w = window.open("", "_blank");
    let html = `<html><head><title>${name}</title><style>body{font-family:Arial;padding:20px}h1{text-align:center;color:#4F46E5}h2{margin-top:30px;color:#1F2937;border-bottom:2px solid #E5E7EB;padding-bottom:5px}.match{margin:10px 0;padding:10px;background:#F9FAFB;border-radius:8px}.winner{color:#10B981;font-weight:bold}.champion{text-align:center;margin-top:40px;padding:20px;background:#FEF3C7;border:3px solid #F59E0B;border-radius:12px}@media print{button{display:none}}</style></head><body><h1>${name}</h1>`;
    bracket.rounds.forEach((round, rIdx) => {
      html += `<h2>${getRoundName(rIdx, bracket.rounds.length)}</h2>`;
      round.forEach((match, mIdx) => {
        html += `<div class="match"><strong>Match ${mIdx + 1}:</strong> ${match.p1 || "..."} vs ${match.p2 || "..."} ${match.winner ? `→ <span class="winner">${match.winner}</span>` : "→ TBD"}</div>`;
      });
    });
    const champion = bracket.rounds[bracket.rounds.length - 1][0]?.winner;
    if (champion)
      html += `<div class="champion"><h1>🏆 CHAMPION: ${champion} 🏆</h1></div>`;
    html += `<div style="text-align:center;margin-top:30px"><button onclick="window.print()" style="padding:12px 24px;background:#4F46E5;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer">Print / Save as PDF</button></div></body></html>`;
    w.document.write(html);
    w.document.close();
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const { bracket, name } = activeTournament;
    if (!bracket) return;
    let csv = "Round,Match,Player 1,Player 2,Winner\n";
    bracket.rounds.forEach((round, rIdx) => {
      round.forEach((match, mIdx) => {
        csv += `"${getRoundName(rIdx, bracket.rounds.length)}","Match ${mIdx + 1}","${match.p1 || "..."}","${match.p2 || "..."}","${match.winner || "TBD"}"\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToXLSX = () => {
    const { bracket, name } = activeTournament;
    if (!bracket) return;
    let html = `<html><head><meta charset="utf-8"></head><body><table border="1"><tr><th>Round</th><th>Match</th><th>Player 1</th><th>Player 2</th><th>Winner</th></tr>`;
    bracket.rounds.forEach((round, rIdx) => {
      round.forEach((match, mIdx) => {
        html += `<tr><td>${getRoundName(rIdx, bracket.rounds.length)}</td><td>Match ${mIdx + 1}</td><td>${match.p1 || "..."}</td><td>${match.p2 || "..."}</td><td>${match.winner || "TBD"}</td></tr>`;
      });
    });
    html += `</table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const getRoundName = (idx, total) => {
    const rem = total - idx;
    if (rem === 1) return t.final;
    if (rem === 2) return t.semiFinal;
    if (rem === 3) return t.quarterFinal;
    return language === "ar" ? `الدور ${idx + 1}` : `ROUND ${idx + 1}`;
  };

  const generateBracket = () => {
    const { participants, tournamentSize, finalist1, finalist2 } =
      activeTournament;
    let names = participants
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");
    if (names.length < 2) return alert("Min 2 participants required");
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
    let matchesCount = tournamentSize / 4,
      rIdx = 1;
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
    updateTournament({ bracket: { rounds: allRounds } });
  };

  const advanceWinner = (rIdx, mIdx, winner) => {
    if (winner === "BYE" || !winner) return;
    const { bracket } = activeTournament;
    const newRounds = [...bracket.rounds];
    newRounds[rIdx][mIdx].winner = winner;
    if (rIdx < newRounds.length - 1) {
      const nextMatchIdx = Math.floor(mIdx / 2);
      if (mIdx % 2 === 0) newRounds[rIdx + 1][nextMatchIdx].p1 = winner;
      else newRounds[rIdx + 1][nextMatchIdx].p2 = winner;
    }
    updateTournament({ bracket: { ...bracket, rounds: newRounds } });
  };

  const champion =
    activeTournament?.bracket?.rounds[
      activeTournament.bracket.rounds.length - 1
    ][0]?.winner || null;
  const MATCH_HEIGHT = 110,
    GAP_ROUND_0 = 32;

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-500 p-6 font-sans ${darkMode ? "bg-[#050a18] text-white" : "bg-slate-50 text-slate-900"}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-6 gap-x-4 mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border ${darkMode ? "bg-indigo-500/20 border-indigo-500/20" : "bg-indigo-500 text-white border-indigo-400"}`}
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
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowTournamentMenu(!showTournamentMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60" : "bg-white border-slate-200 hover:bg-slate-50 shadow-sm"}`}
              >
                <Trophy size={16} />
                <span className="text-sm font-bold">
                  {activeTournament?.name}
                </span>
                <ChevronDown size={16} />
              </button>
              {showTournamentMenu && (
                <div
                  className={`absolute top-full mt-2 right-0 w-64 rounded-2xl border shadow-xl overflow-hidden z-50 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {tournaments.map((tour) => (
                      <div
                        key={tour.id}
                        className={`flex items-center gap-2 p-2 rounded-xl ${tour.id === activeTournamentId ? (darkMode ? "bg-indigo-500/20" : "bg-indigo-50") : "hover:bg-slate-500/10"}`}
                      >
                        {editingTournamentId === tour.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => saveTournamentName(tour.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveTournamentName(tour.id);
                              if (e.key === "Escape") {
                                setEditingTournamentId(null);
                                setEditingName("");
                              }
                            }}
                            autoFocus
                            className={`flex-1 text-sm font-medium px-2 py-1 rounded outline-none border ${darkMode ? "bg-slate-800 border-indigo-500" : "bg-white border-indigo-400"}`}
                          />
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setActiveTournamentId(tour.id);
                                setShowTournamentMenu(false);
                              }}
                              className="flex-1 text-left text-sm font-medium"
                            >
                              {tour.name}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTournament(tour.id, tour.name);
                              }}
                              className="p-1 hover:bg-indigo-500/20 rounded-lg"
                            >
                              <Pencil size={14} className="text-indigo-400" />
                            </button>
                          </>
                        )}
                        {tournaments.length > 1 && (
                          <button
                            onClick={() => deleteTournament(tour.id)}
                            className="p-1 hover:bg-red-500/20 rounded-lg"
                          >
                            <X size={14} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={createNewTournament}
                    className={`w-full p-3 border-t flex items-center justify-center gap-2 text-sm font-bold ${darkMode ? "border-slate-800 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400" : "border-slate-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600"}`}
                  >
                    <Plus size={16} />
                    {t.createTournament}
                  </button>
                </div>
              )}
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
          </div>
        </header>

        {!activeTournament?.bracket ? (
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
                      onClick={() => updateTournament({ tournamentSize: size })}
                      className={`py-3 rounded-xl font-bold border-2 ${activeTournament.tournamentSize === size ? "bg-indigo-600 border-indigo-400 text-white" : "bg-slate-500/10 border-transparent"}`}
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
                    value={activeTournament.finalist1}
                    onChange={(e) =>
                      updateTournament({ finalist1: e.target.value })
                    }
                    className={`w-full border p-3 rounded-xl outline-none text-sm ${darkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`}
                  />
                  <input
                    type="text"
                    placeholder={t.finalist2}
                    value={activeTournament.finalist2}
                    onChange={(e) =>
                      updateTournament({ finalist2: e.target.value })
                    }
                    className={`w-full border p-3 rounded-xl outline-none text-sm ${darkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`}
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                className={`w-full h-48 p-6 rounded-3xl border outline-none font-medium text-lg ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
                placeholder="One name per line..."
                value={activeTournament.participants}
                onChange={(e) =>
                  updateTournament({ participants: e.target.value })
                }
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`absolute top-4 right-4 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold ${darkMode ? "bg-slate-800 hover:bg-slate-700 border border-slate-700" : "bg-slate-100 hover:bg-slate-200 border border-slate-300"}`}
              >
                <Upload size={16} />
                {t.importFile}
              </button>
            </div>
            <button
              onClick={generateBracket}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Shuffle /> {t.generate}
            </button>
          </section>
        ) : (
          <section className="max-w-full overflow-x-auto pb-32 no-scrollbar">
            <div className="flex items-center justify-between mb-10 px-4">
              <button
                onClick={() => updateTournament({ bracket: null })}
                className="flex items-center gap-2 text-[11px] font-black uppercase opacity-50 hover:opacity-100"
              >
                <RefreshCw size={14} /> {t.newTournament}
              </button>
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${darkMode ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"}`}
                >
                  <Download size={16} />
                  {t.exportResults}
                  <ChevronDown size={16} />
                </button>
                {showExportMenu && (
                  <div
                    className={`absolute top-full mt-2 right-0 w-48 rounded-xl border shadow-xl overflow-hidden z-50 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <button
                      onClick={exportToPDF}
                      className={`w-full p-3 flex items-center gap-3 text-sm font-medium ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                    >
                      <FileText size={16} />
                      PDF
                    </button>
                    <button
                      onClick={exportToCSV}
                      className={`w-full p-3 flex items-center gap-3 text-sm font-medium border-t ${darkMode ? "hover:bg-slate-800 border-slate-800" : "hover:bg-slate-50 border-slate-200"}`}
                    >
                      <FileText size={16} />
                      CSV
                    </button>
                    <button
                      onClick={exportToXLSX}
                      className={`w-full p-3 flex items-center gap-3 text-sm font-medium border-t ${darkMode ? "hover:bg-slate-800 border-slate-800" : "hover:bg-slate-50 border-slate-200"}`}
                    >
                      <FileText size={16} />
                      XLSX
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-16 px-8 min-w-max relative">
              {activeTournament.bracket.rounds.map((round, rIdx) => {
                const cellHeight =
                  Math.pow(2, rIdx) * (MATCH_HEIGHT + GAP_ROUND_0);
                return (
                  <div key={rIdx} className="flex flex-col">
                    <div className="self-center mb-10">
                      <span
                        className={`px-5 py-2 rounded-full text-[10px] font-black border ${darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200"}`}
                      >
                        {getRoundName(
                          rIdx,
                          activeTournament.bracket.rounds.length,
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1">
                      {round.map((match, mIdx) => (
                        <div
                          key={match.id}
                          className="relative flex items-center justify-center"
                          style={{ height: `${cellHeight}px` }}
                        >
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
                          {rIdx <
                            activeTournament.bracket.rounds.length - 1 && (
                            <div
                              className={`absolute ${language === "ar" ? "right-full" : "left-full"} top-1/2 flex items-center pointer-events-none`}
                              style={{ width: "32px" }}
                            >
                              <div
                                className={`w-full h-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                              />
                              <div
                                className={`absolute ${language === "ar" ? "left-0" : "right-0"} w-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                                style={{
                                  height: `${cellHeight / 2}px`,
                                  top: mIdx % 2 === 0 ? "50%" : "auto",
                                  bottom: mIdx % 2 !== 0 ? "50%" : "auto",
                                }}
                              />
                              {mIdx % 2 === 0 && (
                                <div
                                  className={`absolute ${language === "ar" ? "left-[-32px]" : "right-[-32px]"} w-[32px] h-[2px] ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                                  style={{ top: `${cellHeight / 2}px` }}
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
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2 rounded-full border transition-all ${darkMode ? "bg-slate-900/40 border-slate-800 hover:bg-indigo-500/10 hover:text-indigo-400" : "bg-white border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"}`}
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
