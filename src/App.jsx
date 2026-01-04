import { useState, useEffect } from "react";
import {
  Shuffle,
  Users,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Trophy,
} from "lucide-react";

const translations = {
  fr: {
    title: "Taedraw",
    subtitle: "Generateur de tirage pour tournoi",
    tournamentSize: "Taille du tournoi (puissance de 2)",
    participants: "Participants",
    max: "max",
    finalists: "Finalistes prévus (optionnel)",
    finalistsDesc:
      "Deux joueurs qui ne se rencontreront qu'en finale (chemins différents)",
    finalist1: "Finaliste 1",
    finalist2: "Finaliste 2",
    generate: "Générer le tournoi",
    newTournament: "Nouveau tournoi",
    match: "Affiche",
    finished: "Terminé",
    vs: "VS",
    champion: "CHAMPION",
    final: "Finale",
    semiFinal: "Demi-finales",
    quarterFinal: "Quarts de finale",
    eighthFinal: "8èmes de finale",
    sixteenthFinal: "16èmes de finale",
    thirtySecondFinal: "32èmes de finale",
    round: "Tour",
    minParticipants: "Au moins 2 participants requis",
    maxParticipants: "Maximum {0} participants autorisés",
    duplicates: "Attention : Doublons détectés !",
    finalistNotFound: 'Le finaliste "{0}" n\'est pas dans la liste',
    finalistsSame: "Les deux finalistes doivent être différents",
  },
  en: {
    title: "Taedraw",
    subtitle: "Tournament draw generator",
    tournamentSize: "Tournament size (power of 2)",
    participants: "Participants",
    max: "max",
    finalists: "Expected finalists (optional)",
    finalistsDesc:
      "Two players who will only meet in the final (different paths)",
    finalist1: "Finalist 1",
    finalist2: "Finalist 2",
    generate: "Generate tournament",
    newTournament: "New tournament",
    match: "Match",
    finished: "Finished",
    vs: "VS",
    champion: "CHAMPION",
    final: "Final",
    semiFinal: "Semi-finals",
    quarterFinal: "Quarter-finals",
    eighthFinal: "Round of 16",
    sixteenthFinal: "Round of 32",
    thirtySecondFinal: "Round of 64",
    round: "Round",
    minParticipants: "At least 2 participants required",
    maxParticipants: "Maximum {0} participants allowed",
    duplicates: "Warning: Duplicates detected!",
    finalistNotFound: 'Finalist "{0}" not found in the list',
    finalistsSame: "The two finalists must be different",
  },
  es: {
    title: "Taedraw",
    subtitle: "generador de sorteos de torneos",
    tournamentSize: "Tamaño del torneo (potencia de 2)",
    participants: "Participantes",
    max: "máx",
    finalists: "Finalistas previstos (opcional)",
    finalistsDesc:
      "Dos jugadores que solo se enfrentarán en la final (caminos diferentes)",
    finalist1: "Finalista 1",
    finalist2: "Finalista 2",
    generate: "Generar torneo",
    newTournament: "Nuevo torneo",
    match: "Partido",
    finished: "Terminado",
    vs: "VS",
    champion: "CAMPEÓN",
    final: "Final",
    semiFinal: "Semifinales",
    quarterFinal: "Cuartos de final",
    eighthFinal: "Octavos de final",
    sixteenthFinal: "Dieciseisavos",
    thirtySecondFinal: "Treintaidosavos",
    round: "Ronda",
    minParticipants: "Se requieren al menos 2 participantes",
    maxParticipants: "Máximo {0} participantes permitidos",
    duplicates: "¡Advertencia: Duplicados detectados!",
    finalistNotFound: 'Finalista "{0}" no encontrado en la lista',
    finalistsSame: "Los dos finalistas deben ser diferentes",
  },
  ar: {
    title: "تايدرو",
    subtitle: "مولّد قرعة بطولة",
    tournamentSize: "حجم البطولة (قوة 2)",
    participants: "المشاركون",
    max: "الحد الأقصى",
    finalists: "المتأهلون للنهائي المتوقعون (اختياري)",
    finalistsDesc: "لاعبان لن يتقابلا إلا في النهائي (مسارات مختلفة)",
    finalist1: "المتأهل الأول",
    finalist2: "المتأهل الثاني",
    generate: "إنشاء البطولة",
    newTournament: "بطولة جديدة",
    match: "مباراة",
    finished: "انتهت",
    vs: "ضد",
    champion: "البطل",
    final: "النهائي",
    semiFinal: "نصف النهائي",
    quarterFinal: "ربع النهائي",
    eighthFinal: "ثمن النهائي",
    sixteenthFinal: "دور الـ 32",
    thirtySecondFinal: "دور الـ 64",
    round: "الدور",
    minParticipants: "مطلوب على الأقل 2 مشاركين",
    maxParticipants: "الحد الأقصى {0} مشاركين",
    duplicates: "تحذير: تم اكتشاف تكرارات!",
    finalistNotFound: 'المتأهل "{0}" غير موجود في القائمة',
    finalistsSame: "يجب أن يكون المتأهلان مختلفين",
  },
};

function App() {
  const [participants, setParticipants] = useState("");
  const [bracket, setBracket] = useState(null);
  const [finalist1, setFinalist1] = useState("");
  const [finalist2, setFinalist2] = useState("");
  const [tournamentSize, setTournamentSize] = useState(64);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const generateBracket = () => {
    const names = participants
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length < 2) {
      alert(t.minParticipants);
      return;
    }

    if (names.length > tournamentSize) {
      alert(t.maxParticipants.replace("{0}", tournamentSize));
      return;
    }

    const unique = new Set(names);
    if (unique.size !== names.length) {
      alert(t.duplicates);
      return;
    }

    const f1 = finalist1.trim();
    const f2 = finalist2.trim();

    if (f1 && !names.includes(f1)) {
      alert(t.finalistNotFound.replace("{0}", f1));
      return;
    }
    if (f2 && !names.includes(f2)) {
      alert(t.finalistNotFound.replace("{0}", f2));
      return;
    }
    if (f1 && f2 && f1 === f2) {
      alert(t.finalistsSame);
      return;
    }

    let shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    if (f1 && f2) {
      shuffled = shuffled.filter((n) => n !== f1 && n !== f2);
      const halfSize = Math.floor(tournamentSize / 2);
      const upperHalf = shuffled.slice(0, halfSize - 1);
      const lowerHalf = shuffled.slice(halfSize - 1);
      shuffled = [f1, ...upperHalf, f2, ...lowerHalf];
    }

    while (shuffled.length < tournamentSize) {
      shuffled.push("BYE");
    }

    const firstRound = [];
    for (let i = 0; i < tournamentSize; i += 2) {
      firstRound.push({
        id: `r1-${i / 2}`,
        matchNumber: Math.floor(i / 2) + 1,
        player1: shuffled[i],
        player2: shuffled[i + 1],
        winner: null,
      });
    }

    setBracket({ rounds: [firstRound] });
  };

  const advanceWinner = (matchId, winner) => {
    if (!bracket || !winner) return;

    const newBracket = JSON.parse(JSON.stringify(bracket));
    let targetRound = null;
    let roundIndex = -1;

    for (let i = 0; i < newBracket.rounds.length; i++) {
      const match = newBracket.rounds[i].find((m) => m.id === matchId);
      if (match) {
        match.winner = winner;
        targetRound = newBracket.rounds[i];
        roundIndex = i;
        break;
      }
    }

    if (!targetRound) return;

    const allComplete = targetRound.every((m) => m.winner !== null);

    if (allComplete && targetRound.length > 1) {
      if (!newBracket.rounds[roundIndex + 1]) {
        const nextRound = [];
        for (let i = 0; i < targetRound.length; i += 2) {
          if (targetRound[i] && targetRound[i + 1]) {
            nextRound.push({
              id: `r${roundIndex + 2}-${Math.floor(i / 2)}`,
              matchNumber: Math.floor(i / 2) + 1,
              player1: targetRound[i].winner || "BYE",
              player2: targetRound[i + 1].winner || "BYE",
              winner: null,
            });
          }
        }
        if (nextRound.length > 0) {
          newBracket.rounds.push(nextRound);
        }
      } else {
        const nextRound = newBracket.rounds[roundIndex + 1];
        for (let i = 0; i < targetRound.length; i += 2) {
          const nextMatchIndex = Math.floor(i / 2);
          if (
            nextRound[nextMatchIndex] &&
            targetRound[i] &&
            targetRound[i + 1]
          ) {
            nextRound[nextMatchIndex].player1 = targetRound[i].winner || "BYE";
            nextRound[nextMatchIndex].player2 =
              targetRound[i + 1].winner || "BYE";
            nextRound[nextMatchIndex].winner = null;
          }
        }
      }
    }

    setBracket(newBracket);
  };

  const getRoundName = (roundIndex, totalRounds) => {
    const remaining = totalRounds - roundIndex;
    if (remaining === 1) return t.final;
    if (remaining === 2) return t.semiFinal;
    if (remaining === 3) return t.quarterFinal;
    if (remaining === 4) return t.eighthFinal;
    if (remaining === 5) return t.sixteenthFinal;
    if (remaining === 6) return t.thirtySecondFinal;
    return `${t.round} ${roundIndex + 1}`;
  };

  const resetTournament = () => {
    setBracket(null);
    setParticipants("");
    setFinalist1("");
    setFinalist2("");
  };

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => alert("Plein écran non supporté"));
      } else {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    } catch (err) {
      console.error("Erreur fullscreen:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const isRTL = language === "ar";

  return (
    <div
      className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`rounded-2xl shadow-2xl p-6 md:p-8 mb-6 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${darkMode ? "bg-indigo-900/50" : "bg-indigo-100"}`}
              >
                <Users
                  className={`w-8 h-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
                />
              </div>
              <div>
                <h1
                  className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {t.title}
                </h1>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {t.subtitle}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`p-3 rounded-xl transition-all hover:scale-110 cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="ar">🇸🇦 AR</option>
              </select>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className={`p-3 rounded-xl transition-all hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {!bracket ? (
            /* Configuration */
            <div className="space-y-6">
              <div
                className={`p-6 rounded-xl border-2 ${
                  darkMode
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-linear-to-r from-blue-50 to-indigo-50 border-indigo-200"
                }`}
              >
                <label
                  className={`block text-sm font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {t.tournamentSize}
                </label>
                <select
                  value={tournamentSize}
                  onChange={(e) => setTournamentSize(Number(e.target.value))}
                  className={`w-full p-4 border-2 rounded-xl font-semibold text-lg focus:outline-none focus:ring-4 transition-all ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500/50"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-200"
                  }`}
                >
                  <option value={4}>🏆 4</option>
                  <option value={8}>🏆 8</option>
                  <option value={16}>🏆 16</option>
                  <option value={32}>🏆 32</option>
                  <option value={64}>🏆 64</option>
                  <option value={128}>🏆 128</option>
                </select>
              </div>

              <div
                className={`p-6 rounded-xl border-2 ${
                  darkMode
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
              >
                <label
                  className={`block text-sm font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {t.participants} ({t.max} {tournamentSize})
                </label>
                <textarea
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className={`w-full h-48 p-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-indigo-500/50"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-200"
                  }`}
                  placeholder="Participant 1&#10;Participant 2&#10;Participant 3&#10;..."
                />
              </div>

              <div
                className={`p-6 rounded-xl border-2 ${
                  darkMode
                    ? "bg-linear-to-br from-yellow-900/30 to-amber-900/30 border-yellow-700/50"
                    : "bg-linear-to-br from-yellow-50 to-amber-50 border-yellow-300"
                }`}
              >
                <h3
                  className={`font-bold mb-3 text-lg flex items-center gap-2 ${
                    darkMode ? "text-yellow-300" : "text-yellow-800"
                  }`}
                >
                  <Trophy className="w-6 h-6" />
                  {t.finalists}
                </h3>
                <p
                  className={`text-sm mb-4 ${darkMode ? "text-yellow-200/80" : "text-yellow-700"}`}
                >
                  {t.finalistsDesc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={finalist1}
                    onChange={(e) => setFinalist1(e.target.value)}
                    className={`p-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-500/50"
                        : "bg-white border-yellow-200 text-gray-900 focus:ring-yellow-200"
                    }`}
                    placeholder={t.finalist1}
                  />
                  <input
                    type="text"
                    value={finalist2}
                    onChange={(e) => setFinalist2(e.target.value)}
                    className={`p-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-500/50"
                        : "bg-white border-yellow-200 text-gray-900 focus:ring-yellow-200"
                    }`}
                    placeholder={t.finalist2}
                  />
                </div>
              </div>

              <button
                onClick={generateBracket}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl text-lg"
              >
                <Shuffle className="w-6 h-6" />
                {t.generate}
              </button>
            </div>
          ) : (
            /* Bracket */
            <div className="space-y-6">
              <div>
                <button
                  onClick={resetTournament}
                  className={`py-2.5 px-5 rounded-xl font-semibold transition-all hover:scale-105 shadow-md ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  🔄 {t.newTournament}
                </button>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
                  {bracket.rounds.map((round, roundIdx) => (
                    <div key={roundIdx} style={{ minWidth: "300px" }}>
                      <h3
                        className={`font-bold text-xl text-center px-4 py-3 rounded-xl shadow-md mb-6 ${
                          darkMode
                            ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white"
                            : "bg-linear-to-r from-indigo-500 to-purple-500 text-white"
                        }`}
                      >
                        {getRoundName(roundIdx, bracket.rounds.length)}
                      </h3>
                      <div className="space-y-6">
                        {round.map((match) => (
                          <div
                            key={match.id}
                            className={`border-2 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl ${
                              darkMode
                                ? "bg-linear-to-br from-gray-700 to-gray-800 border-gray-600"
                                : "bg-linear-to-br from-white to-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm ${
                                  darkMode
                                    ? "bg-indigo-900/80 text-indigo-300"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {t.match} #{match.matchNumber}
                              </span>
                              {match.winner && (
                                <span className="text-xs px-3 py-1.5 rounded-lg font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-md">
                                  ✓ {t.finished}
                                </span>
                              )}
                            </div>
                            <div className="space-y-3">
                              <button
                                onClick={() =>
                                  advanceWinner(match.id, match.player1)
                                }
                                disabled={match.player1 === "BYE"}
                                className={`w-full p-4 rounded-xl text-left font-semibold transition-all duration-200 ${
                                  match.winner === match.player1
                                    ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-xl ring-4 ring-green-300"
                                    : match.player1 === "BYE"
                                      ? darkMode
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                      : darkMode
                                        ? "bg-gray-600 hover:bg-gray-500 text-white hover:shadow-lg transform hover:scale-105"
                                        : "bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transform hover:scale-105"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">
                                    {match.player1}
                                  </span>
                                  {match.winner === match.player1 && (
                                    <span className="text-2xl ml-2">🏆</span>
                                  )}
                                </div>
                              </button>
                              <div
                                className={`text-center text-sm font-bold ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {t.vs}
                              </div>
                              <button
                                onClick={() =>
                                  advanceWinner(match.id, match.player2)
                                }
                                disabled={match.player2 === "BYE"}
                                className={`w-full p-4 rounded-xl text-left font-semibold transition-all duration-200 ${
                                  match.winner === match.player2
                                    ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-xl ring-4 ring-green-300"
                                    : match.player2 === "BYE"
                                      ? darkMode
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                      : darkMode
                                        ? "bg-gray-600 hover:bg-gray-500 text-white hover:shadow-lg transform hover:scale-105"
                                        : "bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transform hover:scale-105"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate">
                                    {match.player2}
                                  </span>
                                  {match.winner === match.player2 && (
                                    <span className="text-2xl ml-2">🏆</span>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Champion */}
              {bracket.rounds[bracket.rounds.length - 1]?.length === 1 &&
                bracket.rounds[bracket.rounds.length - 1][0]?.winner && (
                  <div className="mt-8 relative overflow-hidden rounded-2xl p-8 text-center shadow-2xl">
                    <div className="absolute inset-0 bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 opacity-90" />
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">🏆</div>
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                        {t.champion}
                      </h2>
                      <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                        {bracket.rounds[bracket.rounds.length - 1][0].winner}
                      </p>
                      <div className="mt-6 flex justify-center gap-2">
                        <span className="text-4xl">🎉</span>
                        <span className="text-4xl">✨</span>
                        <span className="text-4xl">🎊</span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
