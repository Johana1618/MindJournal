import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  homeOutline,
  barChartOutline,
  searchOutline,
  settingsOutline,
} from "ionicons/icons";

import * as Diary from "../services/diary";
import { Entry, Mood } from "../services/diary";

import "./Estadisticas.css";

// Letras de los días de la semana (Lunes a Domingo)
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

const moodEmoji: Record<Mood, string> = {
  feliz: "😊",
  triste: "😔",
  ansioso: "😰",
  tranquilo: "😌",
  motivado: "🚀",
};

const moodLabel: Record<Mood, string> = {
  feliz: "Feliz",
  triste: "Triste",
  ansioso: "Ansioso",
  tranquilo: "Tranquilo",
  motivado: "Motivado",
};

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function weekdayIndex(date: Date): number {
  // JS: 0=Domingo ... 6=Sabado  →  queremos 0=Lunes ... 6=Domingo
  const js = date.getDay();
  return js === 0 ? 6 : js - 1;
}

const Estadisticas: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const all = await Diary.getAll();
      setEntries(all);
    })();
  }, []);

  // Últimos 7 días (L a D, de más antiguo a más reciente)
  const last7Days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result: {
      label: string;
      mood: Mood | null;
      iso: string;
    }[] = [];

    for (let diff = 6; diff >= 0; diff--) {
      const d = new Date(today);
      d.setDate(today.getDate() - diff);

      const iso = toISODate(d);
      const dayEntries = entries.filter(
        (e) => e.dateISO.slice(0, 10) === iso
      );
      const lastEntry = dayEntries[dayEntries.length - 1] || null;

      result.push({
        label: WEEKDAY_LABELS[weekdayIndex(d)],
        mood: lastEntry ? lastEntry.mood : null,
        iso,
      });
    }

    return result;
  }, [entries]);

  // Conteo de emociones y días felices
  const stats = useMemo(() => {
    const counts: Record<Mood, number> = {
      feliz: 0,
      triste: 0,
      ansioso: 0,
      tranquilo: 0,
      motivado: 0,
    };

    entries.forEach((e) => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const happyDates = new Set(
      entries.filter((e) => e.mood === "feliz").map((e) => e.dateISO.slice(0, 10))
    );

    return {
      counts,
      total,
      happyDays: happyDates.size,
    };
  }, [entries]);

  const moodsOrder: Mood[] = [
    "feliz",
    "triste",
    "ansioso",
    "tranquilo",
    "motivado",
  ];

  return (
    <IonPage className="estadisticas-page">
      {/* HEADER SUPERIOR: ahora muestra Estadísticas */}
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <div className="app-brand">
            <div className="app-logo">Estadísticas</div>
            <div className="app-subtitle">Analiza tu estado emocional</div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="estadisticas-page">
        <div className="stats-layout">
          {/* MENU LATERAL IZQUIERDO (sin título MindJournal) */}
          <aside className="side-card">
            <nav className="side-nav">
              <button
                className={
                  "side-nav-item" +
                  (location.pathname === "/diario" ? " active" : "")
                }
                onClick={() => history.push("/diario")}
              >
                <IonIcon icon={homeOutline} />
                <span>Inicio</span>
              </button>

              <button
                className={
                  "side-nav-item" +
                  (location.pathname === "/estadisticas" ? " active" : "")
                }
                onClick={() => history.push("/estadisticas")}
              >
                <IonIcon icon={barChartOutline} />
                <span>Estadísticas</span>
              </button>

              <button
                className={
                  "side-nav-item" +
                  (location.pathname === "/busqueda" ? " active" : "")
                }
                onClick={() => history.push("/busqueda")}
              >
                <IonIcon icon={searchOutline} />
                <span>Buscar</span>
              </button>

              <button
                className={
                  "side-nav-item" +
                  (location.pathname === "/ajustes" ? " active" : "")
                }
                onClick={() => history.push("/ajustes")}
              >
                <IonIcon icon={settingsOutline} />
                <span>Ajustes</span>
              </button>
            </nav>

            <div className="side-status">
              <span className="status-dot" />
              <span>Online</span>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL (ya SIN el título duplicado) */}
          <main className="stats-main">
            {/* Tarjeta últimos 7 días */}
            <section className="stats-card stats-week">
              <div className="stats-card-title">Últimos 7 días</div>
              <div className="week-row">
                {last7Days.map((d) => (
                  <div className="week-day" key={d.iso}>
                    <div
                      className={
                        "week-mood-badge" +
                        (d.mood ? ` mood-${d.mood}` : " mood-empty")
                      }
                    >
                      {d.mood ? moodEmoji[d.mood] : "–"}
                    </div>
                    <span className="week-day-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fila inferior: días felices + distribución */}
            <section className="stats-bottom-row">
              <div className="stats-card stats-happy">
                <div className="happy-emoji">😊</div>
                <div className="happy-info">
                  <div className="happy-number">{stats.happyDays}</div>
                  <div className="happy-label">DÍAS FELICES</div>
                </div>
              </div>

              <div className="stats-card stats-distribution">
                <div className="stats-card-title">Distribución de emociones</div>

                <div className="dist-list">
                  {moodsOrder.map((mood) => {
                    const value = stats.counts[mood] || 0;
                    const pct =
                      stats.total > 0
                        ? Math.round((value * 100) / stats.total)
                        : 0;
                    return (
                      <div className="dist-row" key={mood}>
                        <div className="dist-label">
                          <span className="dist-emoji">{moodEmoji[mood]}</span>
                          <span>{moodLabel[mood]}</span>
                        </div>
                        <div className="dist-bar-wrapper">
                          <div
                            className="dist-bar-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="dist-percentage">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Estadisticas;
