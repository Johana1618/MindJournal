import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  homeOutline,
  barChartOutline,
  searchOutline,
  settingsOutline,
  wifiOutline,
} from "ionicons/icons";

import * as Diary from "../services/diary";
import { Entry, Mood } from "../services/diary";

import "./Estadisticas.css";

// Letras de los días de la semana (Lunes a Domingo)
const WEEKDAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

const moodEmoji: Record<Mood, string> = {
  feliz: "😊",
  triste: "😔",
  ansioso: "😰",
  tranquilo: "😌",
  enamorado: "😍",
};

const moodLabel: Record<Mood, string> = {
  feliz: "Feliz",
  triste: "Triste",
  ansioso: "Ansioso",
  tranquilo: "Tranquilo",
  enamorado: "Enamorado",
};

function toISODate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekdayIndex(date: Date): number {
  return (date.getDay() + 5) % 7;
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

  // Últimos 7 días
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

  const stats = useMemo(() => {
    const counts: Record<Mood, number> = {
      feliz: 0,
      triste: 0,
      ansioso: 0,
      tranquilo: 0,
      enamorado: 0,
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
    "enamorado",
  ];

  return (
    <IonPage className="estadisticas-page">

      {/* ------------ HEADER CON WIFI NUEVO ------------- */}
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <div className="app-brand">
            <div className="app-logo">Estadísticas</div>
            <div className="app-subtitle">Analiza tu estado emocional</div>
          </div>

          <IonButtons slot="end">
            <div className="status-badge">
              {/* ÍCONO WIFI OFF (SVG NUEVO) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="#00542c"
              >
                <path d="M12 20c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4.9-3.9l.7-.7c.2-.2.2-.5 0-.7-1.4-1.4-3.3-2.2-5.3-2.2s-3.9.8-5.3 2.2c-.2.2-.2.5 0 .7l.7.7c.2.2.5.2.7 0 1-1 2.4-1.6 3.9-1.6s2.9.6 3.9 1.6c.2.2.6.2.8 0zm2.8-2.8l.7-.7c.2-.2.2-.5 0-.7C17.8 9.2 15 8 12 8s-5.8 1.2-7.7 3.1c-.2.2-.2.5 0 .7l.7.7c.2.2.5.2.7 0C7.1 10.7 9.4 10 12 10s4.9.7 6.3 2.1c.3.2.6.2.8 0zm2.8-2.8l.7-.7c.2-.2.2-.5 0-.7C19.6 6 16 4.5 12 4.5S4.4 6 2.6 7.9c-.2.2-.2.5 0 .7l.7.7c.2.2.5.2.7 0C5.5 7.1 8.6 6 12 6s6.5 1.1 8 3.3c.2.3.5.3.7 0z" />
                <line
                  x1="3"
                  y1="21"
                  x2="21"
                  y2="3"
                  stroke="#00542c"
                  strokeWidth="2"
                />
              </svg>

              <span className="status-text">Offline</span>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ------------ CONTENIDO ------------- */}
      <IonContent fullscreen className="estadisticas-page">
        <div className="stats-layout">

          {/* MENU LATERAL IZQUIERDO */}
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
                <span>Inicijhiohoho</span>
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

            {/* SIDEBAR - ESTADO OFFLINE */}
            <div className="sidebar-status">
              <span className="status-icon-with-slash">
                <IonIcon icon={wifiOutline} />
                <span className="icon-slash" />
              </span>
              <span>Offlinessss</span>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <main className="stats-main">

            {/* DISTRIBUCIÓN DE EMOCIONES */}
            <div className="stats-card stats-distribution big-distribution">
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

            {/* ULTIMOS 7 DIAS */}
            <section className="stats-card stats-week big-week">
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

            {/* DÍAS FELICES */}
            <section className="stats-grid-row">
              <div className="stats-card stats-happy big-happy">
                <div className="happy-emoji">😁</div>
                <div className="happy-info">
                  <div className="happy-number">{stats.happyDays}</div>
                  <div className="happy-label">Días felices</div>
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
