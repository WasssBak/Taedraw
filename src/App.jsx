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
    club: "Club",
    avoidSameClub: "Éviter même club au 1er tour",
    participantName: "Nom du participant",
    clubName: "Nom du club (optionnel)",
    addParticipant: "Ajouter participant",
    editParticipants: "Modifier les participants",
    saveParticipants: "Enregistrer",
    cancel: "Annuler",
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
    club: "Club",
    avoidSameClub: "Avoid same club in 1st round",
    participantName: "Participant name",
    clubName: "Club name (optional)",
    addParticipant: "Add participant",
    editParticipants: "Edit participants",
    saveParticipants: "Save",
    cancel: "Cancel",
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
    club: "Club",
    avoidSameClub: "Evitar mismo club en 1ª ronda",
    participantName: "Nombre del participante",
    clubName: "Nombre del club (opcional)",
    addParticipant: "Añadir participante",
    editParticipants: "Editar participantes",
    saveParticipants: "Guardar",
    cancel: "Cancelar",
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
    club: "النادي",
    avoidSameClub: "تجنب نفس النادي في الجولة الأولى",
    participantName: "اسم المشارك",
    clubName: "اسم النادي (اختياري)",
    addParticipant: "إضافة مشارك",
    editParticipants: "تعديل المشاركين",
    saveParticipants: "حفظ",
    cancel: "إلغاء",
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
            participantsList: [], // New: structured participant list with clubs
            bracket: null,
            tournamentSize: 16,
            finalist1: "",
            finalist2: "",
            avoidSameClubFirstRound: true, // New: option to avoid same club in first round
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
  const [showParticipantsEditor, setShowParticipantsEditor] = useState(false);
  const [tempParticipantsList, setTempParticipantsList] = useState([]);
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
      participantsList: [],
      bracket: null,
      tournamentSize: 16,
      finalist1: "",
      finalist2: "",
      avoidSameClubFirstRound: true,
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

  const saveEditingTournament = (id) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: editingName } : t)),
    );
    setEditingTournamentId(null);
    setEditingName("");
  };

  const openParticipantsEditor = () => {
    // Initialize from participantsList if available, otherwise from participants string
    if (
      activeTournament.participantsList &&
      activeTournament.participantsList.length > 0
    ) {
      setTempParticipantsList([...activeTournament.participantsList]);
    } else if (activeTournament.participants) {
      const names = activeTournament.participants
        .split("\n")
        .filter((n) => n.trim());
      setTempParticipantsList(
        names.map((name) => ({ name: name.trim(), club: "" })),
      );
    } else {
      setTempParticipantsList([{ name: "", club: "" }]);
    }
    setShowParticipantsEditor(true);
  };

  const addParticipantRow = () => {
    setTempParticipantsList([...tempParticipantsList, { name: "", club: "" }]);
  };

  const updateParticipantRow = (index, field, value) => {
    const updated = [...tempParticipantsList];
    updated[index][field] = value;
    setTempParticipantsList(updated);
  };

  const removeParticipantRow = (index) => {
    setTempParticipantsList(tempParticipantsList.filter((_, i) => i !== index));
  };

  const saveParticipantsList = () => {
    const validParticipants = tempParticipantsList.filter((p) => p.name.trim());
    const participantsString = validParticipants.map((p) => p.name).join("\n");
    updateTournament({
      participantsList: validParticipants,
      participants: participantsString,
    });
    setShowParticipantsEditor(false);
  };

  const cancelParticipantsEdit = () => {
    setShowParticipantsEditor(false);
    setTempParticipantsList([]);
  };

  const MATCH_HEIGHT = 110;
  const GAP_ROUND_0 = 20;
  const champion = activeTournament.bracket
    ? activeTournament.bracket.rounds[
        activeTournament.bracket.rounds.length - 1
      ][0]?.winner
    : null;

  const getRoundName = (roundIdx, totalRounds) => {
    if (roundIdx === totalRounds - 1) return t.final;
    if (roundIdx === totalRounds - 2) return t.semiFinal;
    if (roundIdx === totalRounds - 3) return t.quarterFinal;
    return `Round ${roundIdx + 1}`;
  };

  // New function to check if two participants are from the same club
  const areFromSameClub = (p1, p2, participantsList) => {
    const participant1 = participantsList.find((p) => p.name === p1);
    const participant2 = participantsList.find((p) => p.name === p2);

    if (!participant1 || !participant2) return false;
    if (!participant1.club || !participant2.club) return false;

    return (
      participant1.club.trim() !== "" &&
      participant1.club.trim().toLowerCase() ===
        participant2.club.trim().toLowerCase()
    );
  };

  // Modified shuffle function with club constraint
  const shuffleWithClubConstraint = (
    array,
    participantsList,
    avoidSameClub,
  ) => {
    if (!avoidSameClub || !participantsList || participantsList.length === 0) {
      // Standard shuffle
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    // Try to create first round pairings that avoid same club
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Check first round pairings (pairs of 2)
      let hasConflict = false;
      for (let i = 0; i < shuffled.length; i += 2) {
        if (i + 1 < shuffled.length) {
          const p1 = shuffled[i];
          const p2 = shuffled[i + 1];
          if (
            p1 !== "BYE" &&
            p2 !== "BYE" &&
            areFromSameClub(p1, p2, participantsList)
          ) {
            hasConflict = true;
            break;
          }
        }
      }

      if (!hasConflict) {
        return shuffled;
      }

      attempts++;
    }

    // If we couldn't find a perfect arrangement, return the last shuffle
    // and optionally warn the user
    console.warn(
      "Could not avoid all same-club matchups in first round after",
      maxAttempts,
      "attempts",
    );
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateBracket = () => {
    const lines = activeTournament.participants
      .split("\n")
      .filter((x) => x.trim());
    if (lines.length < 2)
      return alert(
        language === "fr"
          ? "Au moins 2 participants requis"
          : "At least 2 participants required",
      );

    const size = activeTournament.tournamentSize;
    let pool = [...lines];

    const f1 = activeTournament.finalist1?.trim();
    const f2 = activeTournament.finalist2?.trim();
    if (f1) pool = pool.filter((p) => p !== f1);
    if (f2) pool = pool.filter((p) => p !== f2);

    // Use the new shuffle function with club constraint
    const shuffled = shuffleWithClubConstraint(
      pool,
      activeTournament.participantsList || [],
      activeTournament.avoidSameClubFirstRound,
    );

    const finalList = [];
    if (f1) finalList.push(f1);
    finalList.push(...shuffled);
    if (f2) finalList.push(f2);

    while (finalList.length < size) finalList.push("BYE");

    const firstRound = [];
    for (let i = 0; i < finalList.length; i += 2) {
      firstRound.push({
        id: `r0-m${i / 2}`,
        p1: finalList[i],
        p2: finalList[i + 1],
        winner: null,
      });
    }

    const rounds = [firstRound];
    let currentRound = firstRound;
    let roundIdx = 1;
    while (currentRound.length > 1) {
      const nextRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        nextRound.push({
          id: `r${roundIdx}-m${i / 2}`,
          p1: null,
          p2: null,
          winner: null,
        });
      }
      rounds.push(nextRound);
      currentRound = nextRound;
      roundIdx++;
    }

    updateTournament({ bracket: { rounds } });
  };

  const advanceWinner = (rIdx, mIdx, player) => {
    const newRounds = activeTournament.bracket.rounds.map((r) =>
      r.map((m) => ({ ...m })),
    );
    const match = newRounds[rIdx][mIdx];
    match.winner = player;

    if (rIdx + 1 < newRounds.length) {
      const nextMatchIdx = Math.floor(mIdx / 2);
      const nextMatch = newRounds[rIdx + 1][nextMatchIdx];
      if (mIdx % 2 === 0) nextMatch.p1 = player;
      else nextMatch.p2 = player;

      for (
        let futureRound = rIdx + 1;
        futureRound < newRounds.length;
        futureRound++
      ) {
        newRounds[futureRound].forEach((m) => {
          if (m.p1 === player || m.p2 === player) m.winner = null;
        });
      }
    }

    updateTournament({ bracket: { rounds: newRounds } });
  };

  const exportToCSV = () => {
    if (!activeTournament.bracket) return;
    let csv = "Round,Match,Player 1,Player 2,Winner\n";
    activeTournament.bracket.rounds.forEach((round, rIdx) => {
      round.forEach((match, mIdx) => {
        csv += `${rIdx + 1},${mIdx + 1},${match.p1 || ""},${match.p2 || ""},${match.winner || ""}\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTournament.name}_results.csv`;
    a.click();
    setShowExportMenu(false);
  };

  const exportToPDF = async () => {
    if (!activeTournament.bracket) return;

    try {
      await import(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      );

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Configuration
      const MATCH_BOX_WIDTH = 50;
      const MATCH_BOX_HEIGHT = 20;
      const ROUND_SPACING = 65;
      const VERTICAL_SPACING_BASE = 25;
      const START_X = 15;
      const START_Y = 40;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(activeTournament.name, 148, 15, { align: "center" });

      const rounds = activeTournament.bracket.rounds;

      rounds.forEach((round, rIdx) => {
        const verticalSpacing = VERTICAL_SPACING_BASE * Math.pow(2, rIdx);
        const roundOffset =
          (VERTICAL_SPACING_BASE * (Math.pow(2, rIdx) - 1)) / 2;

        round.forEach((match, mIdx) => {
          const x = START_X + rIdx * ROUND_SPACING;
          const y = START_Y + mIdx * verticalSpacing + roundOffset;

          doc.setDrawColor(200);
          doc.rect(x, y, MATCH_BOX_WIDTH, MATCH_BOX_HEIGHT);

          doc.setFontSize(8);
          doc.setTextColor(60);

          const p1 = match.p1 || "TBD";
          const p2 = match.p2 || "TBD";

          doc.text(p1, x + 5, y + 7);
          doc.text(p2, x + 5, y + 15);

          if (rIdx < rounds.length - 1) {
            const nextX = x + MATCH_BOX_WIDTH;
            const nextRoundX = START_X + (rIdx + 1) * ROUND_SPACING;
            const matchCenterY = y + MATCH_BOX_HEIGHT / 2;

            doc.setDrawColor(180);
            doc.setLineWidth(0.2);
            doc.line(nextX, matchCenterY, nextX + 10, matchCenterY);

            if (mIdx % 2 === 0) {
              const partnerY =
                START_Y + (mIdx + 1) * verticalSpacing + roundOffset;
              const partnerCenterY = partnerY + MATCH_BOX_HEIGHT / 2;

              if (mIdx + 1 < round.length) {
                doc.line(nextX + 10, matchCenterY, nextX + 10, partnerCenterY);
                const midY = (matchCenterY + partnerCenterY) / 2;
                doc.line(nextX + 10, midY, nextRoundX, midY);
              }
            }
          }
        });
      });

      const lastRound = rounds[rounds.length - 1];
      const tournamentWinner = lastRound[0]?.winner;

      const lastRoundIdx = rounds.length - 1;
      const finalRoundOffset =
        (VERTICAL_SPACING_BASE * (Math.pow(2, lastRoundIdx) - 1)) / 2;
      const championY = START_Y + finalRoundOffset + MATCH_BOX_HEIGHT / 2;
      const championX = START_X + rounds.length * ROUND_SPACING;

      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(t.champion, championX, championY - 5);

      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.5);
      doc.rect(championX, championY, MATCH_BOX_WIDTH, MATCH_BOX_HEIGHT);

      doc.setFontSize(9);
      doc.text(tournamentWinner || "TBD", championX + 5, championY + 12);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128);
      doc.text(
        `Generated by TAEDRAW - ${new Date().toLocaleDateString()}`,
        148,
        200,
        { align: "center" },
      );

      doc.save(`${activeTournament.name}_bracket.pdf`);
      setShowExportMenu(false);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error exporting PDF. Please try again.");
      setShowExportMenu(false);
    }
  };

  const importFromFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;

        // Handle JSON files (full tournament data or participants list)
        if (fileName.endsWith(".json")) {
          const imported = JSON.parse(content);

          // Check if it's a full tournament export
          if (Array.isArray(imported)) {
            setTournaments(imported);
            setActiveTournamentId(imported[0]?.id || 1);
            alert("Tournament data imported successfully!");
          }
          // Check if it's a participants list with clubs
          else if (Array.isArray(imported.participants)) {
            const participantsList = imported.participants;
            const participantsString = participantsList
              .map((p) => p.name)
              .join("\n");
            updateTournament({
              participantsList: participantsList,
              participants: participantsString,
            });
            alert(`Imported ${participantsList.length} participants!`);
          } else {
            alert("Invalid JSON format");
          }
        }

        // Handle CSV files (name,club format)
        else if (fileName.endsWith(".csv")) {
          const lines = content.split("\n").filter((line) => line.trim());
          const participantsList = [];

          lines.forEach((line, index) => {
            // Skip header if it exists
            if (
              index === 0 &&
              (line.toLowerCase().includes("name") ||
                line.toLowerCase().includes("participant"))
            ) {
              return;
            }

            const parts = line.split(",").map((p) => p.trim());
            if (parts[0]) {
              participantsList.push({
                name: parts[0],
                club: parts[1] || "",
              });
            }
          });

          if (participantsList.length > 0) {
            const participantsString = participantsList
              .map((p) => p.name)
              .join("\n");
            updateTournament({
              participantsList: participantsList,
              participants: participantsString,
            });
            alert(`Imported ${participantsList.length} participants from CSV!`);
          } else {
            alert("No valid participants found in CSV");
          }
        }

        // Handle TXT files (simple name list or name|club format)
        else if (fileName.endsWith(".txt")) {
          const lines = content.split("\n").filter((line) => line.trim());
          const participantsList = [];

          lines.forEach((line) => {
            if (line.includes("|")) {
              // Format: name|club
              const parts = line.split("|").map((p) => p.trim());
              participantsList.push({
                name: parts[0],
                club: parts[1] || "",
              });
            } else {
              // Format: just name
              participantsList.push({
                name: line.trim(),
                club: "",
              });
            }
          });

          if (participantsList.length > 0) {
            const participantsString = participantsList
              .map((p) => p.name)
              .join("\n");
            updateTournament({
              participantsList: participantsList,
              participants: participantsString,
            });
            alert(`Imported ${participantsList.length} participants from TXT!`);
          } else {
            alert("No valid participants found in TXT");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Error reading file: " + error.message);
      }
    };

    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const exportParticipantsTemplate = () => {
    // Create a sample template file
    const template = {
      participants: [
        { name: "John Doe", club: "Club A" },
        { name: "Jane Smith", club: "Club A" },
        { name: "Bob Johnson", club: "Club B" },
        { name: "Alice Williams", club: "Club B" },
        { name: "Charlie Brown", club: "Club C" },
      ],
    };

    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants_template.json";
    a.click();
  };

  const exportToFile = () => {
    const dataStr = JSON.stringify(tournaments, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taedraw_tournaments.json";
    a.click();
  };

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0b1224] text-white" : "bg-slate-50 text-slate-900"}`}
      >
        <nav
          className={`border-b backdrop-blur-lg sticky top-0 z-50 ${darkMode ? "bg-[#050a18]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}
        >
          <div className="container mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-black tracking-tight">
                {t.title}
                <span className="text-indigo-500">.</span>
              </h1>
              <div className="relative">
                <button
                  onClick={() => setShowTournamentMenu(!showTournamentMenu)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-50"}`}
                >
                  {activeTournament?.name}
                  <ChevronDown size={16} />
                </button>
                {showTournamentMenu && (
                  <div
                    className={`absolute top-full mt-2 left-0 w-64 rounded-xl border shadow-xl overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {tournaments.map((tour) => (
                        <div
                          key={tour.id}
                          className={`flex items-center justify-between p-3 border-b ${darkMode ? "border-slate-800 hover:bg-slate-800" : "border-slate-100 hover:bg-slate-50"}`}
                        >
                          {editingTournamentId === tour.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  saveEditingTournament(tour.id);
                                if (e.key === "Escape")
                                  setEditingTournamentId(null);
                              }}
                              className={`flex-1 px-2 py-1 rounded text-sm ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
                              autoFocus
                            />
                          ) : (
                            <button
                              onClick={() => {
                                setActiveTournamentId(tour.id);
                                setShowTournamentMenu(false);
                              }}
                              className="flex-1 text-left text-sm font-medium"
                            >
                              {tour.name}
                            </button>
                          )}
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                startEditingTournament(tour.id, tour.name)
                              }
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteTournament(tour.id)}
                              className="p-1 hover:bg-red-500/20 text-red-500 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={createNewTournament}
                      className={`w-full p-3 flex items-center justify-center gap-2 text-sm font-bold border-t ${darkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-slate-800" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-slate-200"}`}
                    >
                      <Plus size={16} />
                      {t.createTournament}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 rounded-xl text-sm font-bold border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
                <option value="ar">AR</option>
              </select>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-50"}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-50"}`}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              <button
                onClick={exportToFile}
                className={`p-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-50"}`}
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </nav>

        {!activeTournament.bracket ? (
          <section className="container mx-auto px-6 py-12 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-3">{t.subtitle}</h2>
              <p className="opacity-60 text-sm">{activeTournament.name}</p>
            </div>

            {/* Participants Editor Modal */}
            {showParticipantsEditor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div
                  className={`w-full max-w-2xl max-h-[80vh] rounded-2xl ${darkMode ? "bg-slate-900" : "bg-white"} overflow-hidden flex flex-col`}
                >
                  <div
                    className={`p-6 border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                  >
                    <h3 className="text-xl font-bold">{t.editParticipants}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-3">
                      {tempParticipantsList.map((participant, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={participant.name}
                              onChange={(e) =>
                                updateParticipantRow(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder={t.participantName}
                              className={`w-full px-4 py-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                            />
                            <input
                              type="text"
                              value={participant.club}
                              onChange={(e) =>
                                updateParticipantRow(
                                  index,
                                  "club",
                                  e.target.value,
                                )
                              }
                              placeholder={t.clubName}
                              className={`w-full px-4 py-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                            />
                          </div>
                          <button
                            onClick={() => removeParticipantRow(index)}
                            className={`p-2 rounded-xl hover:bg-red-500/20 text-red-500`}
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addParticipantRow}
                      className={`w-full mt-4 py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 font-bold ${darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-50"}`}
                    >
                      <Plus size={20} />
                      {t.addParticipant}
                    </button>
                  </div>
                  <div
                    className={`p-6 border-t ${darkMode ? "border-slate-800" : "border-slate-200"} flex gap-3`}
                  >
                    <button
                      onClick={cancelParticipantsEdit}
                      className={`flex-1 py-3 rounded-xl font-bold ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"}`}
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={saveParticipantsList}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                    >
                      {t.saveParticipants}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`rounded-3xl border p-8 mb-8 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-sm font-bold opacity-60">
                  <Users size={16} />
                  {t.participants}
                </label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={importFromFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold ${darkMode ? "bg-slate-800 hover:bg-slate-700 border border-slate-700" : "bg-slate-100 hover:bg-slate-200 border border-slate-300"}`}
                  >
                    <Upload size={16} />
                    {t.importFile}
                  </button>
                  <button
                    onClick={openParticipantsEditor}
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                  >
                    {t.editParticipants}
                  </button>
                </div>
              </div>
              <textarea
                value={activeTournament.participants}
                onChange={(e) =>
                  updateTournament({ participants: e.target.value })
                }
                placeholder="Enter participants (one per line) or use Import/Edit buttons"
                className={`w-full h-48 px-6 py-4 rounded-2xl border resize-none font-mono text-sm ${darkMode ? "bg-slate-800 border-slate-700 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 placeholder:text-slate-400"}`}
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs opacity-50">
                  {
                    activeTournament.participants
                      .split("\n")
                      .filter((x) => x.trim()).length
                  }{" "}
                  participant(s)
                  {activeTournament.participantsList &&
                    activeTournament.participantsList.length > 0 &&
                    ` • ${activeTournament.participantsList.filter((p) => p.club && p.club.trim()).length} with clubs`}
                </div>
                <button
                  onClick={exportParticipantsTemplate}
                  className={`text-xs font-medium opacity-60 hover:opacity-100 flex items-center gap-1`}
                >
                  <Download size={12} />
                  Download template
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div
                className={`rounded-3xl border p-6 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <label className="block text-sm font-bold opacity-60 mb-3">
                  {t.size}
                </label>
                <select
                  value={activeTournament.tournamentSize}
                  onChange={(e) =>
                    updateTournament({ tournamentSize: +e.target.value })
                  }
                  className={`w-full px-5 py-3 rounded-xl border font-bold ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300"}`}
                >
                  {[4, 8, 16, 32, 64].map((s) => (
                    <option key={s} value={s}>
                      {s} {t.participants}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`rounded-3xl border p-6 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <label className="flex items-center gap-2 text-sm font-bold opacity-60 mb-3">
                  <input
                    type="checkbox"
                    checked={activeTournament.avoidSameClubFirstRound}
                    onChange={(e) =>
                      updateTournament({
                        avoidSameClubFirstRound: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded accent-indigo-500"
                  />
                  {t.avoidSameClub}
                </label>
                <p className="text-xs opacity-50">
                  {language === "fr"
                    ? "Lorsque activé, les participants du même club ne se rencontreront pas au premier tour (si possible)"
                    : "When enabled, participants from the same club will not face each other in the first round (if possible)"}
                </p>
              </div>
            </div>

            <div
              className={`rounded-3xl border p-6 mb-8 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <label className="block text-sm font-bold opacity-60 mb-4">
                {t.finalists}
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={activeTournament.finalist1}
                  onChange={(e) =>
                    updateTournament({ finalist1: e.target.value })
                  }
                  placeholder={t.finalist1}
                  className={`px-5 py-3 rounded-xl border font-mono text-sm ${darkMode ? "bg-slate-800 border-slate-700 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 placeholder:text-slate-400"}`}
                />
                <input
                  type="text"
                  value={activeTournament.finalist2}
                  onChange={(e) =>
                    updateTournament({ finalist2: e.target.value })
                  }
                  placeholder={t.finalist2}
                  className={`px-5 py-3 rounded-xl border font-mono text-sm ${darkMode ? "bg-slate-800 border-slate-700 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 placeholder:text-slate-400"}`}
                />
              </div>
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
