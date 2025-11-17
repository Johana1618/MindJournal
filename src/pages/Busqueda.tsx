import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
} from "@ionic/react";
import "../assets/styles/general.css";  
import "./Busqueda.css";
import * as Diary from "../services/diary";
import { Entry } from "../services/diary";
import { useEffect, useState, useMemo } from "react";

const moodEmoji: Record<string, string> = {
  feliz: "😃",
  enamorado: "🥰",
  ansioso: "😬",
  triste: "😢",
};

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Busqueda: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const data = await Diary.getAll();
      setEntries(data);
    }
    load();
  }, []);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((e) => {
      const text = e.text?.toLowerCase() ?? "";
      const mood = e.mood?.toLowerCase() ?? "";
      const tags = (e.tags ?? []).map((t) => t.toLowerCase());
      return (
        text.includes(q) ||
        mood.includes(q) ||
        tags.some((t) => t.includes(q))
      );
    });
  }, [entries, query]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="titulo">Busqueda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content">
        <div className="busqueda-inner">
  

          {/* Buscador */}
          <IonSearchbar
            className="busqueda-searchbar"
            value={query}
            placeholder="Hoy"
            onIonChange={(e) => setQuery(e.detail.value ?? "")}
            debounce={300}
            showClearButton="always"
          />

          {/* Contador de resultados */}
          <p className="results-text">
            {filteredEntries.length} resultados encontrados
          </p>

          {/* Lista de resultados */}
          <div className="entries-list">
            {filteredEntries.map((entry) => {
              const emoji =
                moodEmoji[entry.mood?.toLowerCase() ?? ""] ?? "🙂";
              const moodLabel =
                entry.mood?.charAt(0).toUpperCase() +
                  entry.mood?.slice(1).toLowerCase() || "Sin estado";
              const preview =
                entry.text.length > 80
                  ? entry.text.slice(0, 80) + "..."
                  : entry.text;

              return (
                <IonCard key={entry.id} className="entry-card">
                  <IonCardHeader className="entry-card-header">
                    <div className="entry-mood">
                      <span className="entry-emoji">{emoji}</span>
                      <span className="entry-mood-label">{moodLabel}</span>
                    </div>
                    <span className="entry-date">
                      {formatDate(entry.dateISO)}
                    </span>
                  </IonCardHeader>
                  <IonCardContent className="entry-card-content">
                    <p className="entry-text">{preview}</p>
                  </IonCardContent>
                </IonCard>
              );
            })}

            {filteredEntries.length === 0 && (
              <p className="empty-text">
                No hay resultados para “{query}”.
              </p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Busqueda;
