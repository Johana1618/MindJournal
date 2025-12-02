import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonIcon,
  IonItem,
  IonButtons
} from "@ionic/react";

import {
  searchOutline,
  closeOutline,
  homeOutline,
  barChartOutline,
  settingsOutline,
} from "ionicons/icons";

import { useEffect, useMemo, useState } from "react";
import * as Diary from "../services/diary";
import { Entry } from "../services/diary";

import "./Busqueda.css";

const Busqueda: React.FC = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Entry[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = await Diary.getAll();
      setItems(all);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((e) => {
      const text = (e.text || "").toLowerCase();
      const mood = (e.mood || "").toLowerCase();
      const tags = (e.tags || []).join(", ").toLowerCase();
      const date = new Date(e.dateISO).toLocaleDateString();

      return (
        text.includes(q) ||
        mood.includes(q) ||
        tags.includes(q) ||
        date.includes(q)
      );
    });
  }, [items, query]);

  return (
    <IonPage>
      {/* -------------- HEADER -------------- */}
      <IonHeader className="main-header">
        <IonToolbar>

          <div className="search-header">
            <h1 className="search-header-title">Búsqueda</h1>
          </div>

          {/* WIFI OFFLINE AQUÍ — SIEMPRE VISIBLE */}
          <IonButtons slot="end">
            <div className="status-badge">
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

      {/* -------------- CONTENIDO -------------- */}
      <IonContent fullscreen className="search-page">
        <div className="search-layout">

          {/* -------- SIDEBAR (sin wifi) -------- */}
          <aside className="search-sidebar">
            <div className="sidebar-card">

              <nav className="sidebar-nav">

                <a href="/diario" className="sidebar-link">
                  <IonIcon icon={homeOutline} />
                  <span>Inicio</span>
                </a>

                <a href="/estadisticas" className="sidebar-link">
                  <IonIcon icon={barChartOutline} />
                  <span>Estadísticas</span>
                </a>

                <a href="/busqueda" className="sidebar-link active">
                  <IonIcon icon={searchOutline} />
                  <span>Buscar</span>
                </a>

                <a href="/ajustes" className="sidebar-link">
                  <IonIcon icon={settingsOutline} />
                  <span>Ajustes</span>
                </a>

              </nav>

            </div>
          </aside>

          {/* -------- CONTENIDO PRINCIPAL -------- */}
          <main className="search-main">

            {/* BUSCADOR */}
            <div className="search-bar-wrapper">
              <IonItem className="search-bar" lines="none">
                <IonIcon icon={searchOutline} slot="start" />

                <IonInput
                  value={query}
                  placeholder="Hoy"
                  onIonChange={(e) => setQuery(e.detail.value || "")}
                />

                {query && (
                  <IonIcon
                    icon={closeOutline}
                    slot="end"
                    className="search-clear"
                    onClick={() => setQuery("")}
                  />
                )}
              </IonItem>
            </div>

            {/* INFO DE RESULTADOS */}
            <div className="search-results-info">
              {filtered.length === 1
                ? "1 resultado encontrado"
                : `${filtered.length} resultados encontrados`}
            </div>

            {/* TARJETAS DE RESULTADOS */}
            <div className="search-results">
              {filtered.map((e) => (
                <div key={e.id} className="search-card">

                  <div className="search-card-header">
                    <span className="search-card-mood">
                      {{
                        feliz: "😊 Feliz",
                        triste: "😔 Triste",
                        ansioso: "😰 Ansioso",
                        tranquilo: "😌 Tranquilo",
                        motivado: "🚀 Motivado",
                        enamorado: "😍 Enamorado",
                      }[e.mood] || "😊"}
                    </span>

                    <span className="search-card-date">
                      {new Date(e.dateISO).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="search-card-text">{e.text}</p>

                  {e.tags?.length > 0 && (
                    <p className="search-card-tags">
                      Tags: <span>{e.tags.join(", ")}</span>
                    </p>
                  )}

                </div>
              ))}

              {filtered.length === 0 && (
                <p className="search-empty">
                  No se encontraron resultados para “{query}”.
                </p>
              )}
            </div>

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Busqueda;
