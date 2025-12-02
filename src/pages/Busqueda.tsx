import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInput,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { searchOutline, closeOutline, homeOutline, barChartOutline, searchOutline as searchIcon, settingsOutline } from "ionicons/icons";
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
      {/* CABECERA PRINCIPAL */}
      <IonHeader className="main-header">
        <IonToolbar>
          <div className="search-header">
            <h1 className="search-header-title">Búsqueda</h1>
           
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="search-page">
        <div className="search-layout">
          {/* MENÚ LATERAL SOLO ESCRITORIO */}
          <aside className="search-sidebar">
            <div className="sidebar-card">

              <nav className="sidebar-nav">
                <a href="/diario" className="sidebar-link">
                  <IonIcon icon={homeOutline} slot="start" />
                  <span>Inicio</span>
                </a>

                <a href="/estadisticas" className="sidebar-link">
                  <IonIcon icon={barChartOutline} slot="start" />
                  <span>Estadísticas</span>
                </a>

                <a href="/busqueda" className="sidebar-link active">
                  <IonIcon icon={searchIcon} slot="start" />
                  <span>Buscar</span>
                </a>

                <a href="/ajustes" className="sidebar-link">
                  <IonIcon icon={settingsOutline} slot="start" />
                  <span>Ajustes</span>
                </a>
              </nav>

              <div className="sidebar-status">
                <span className="status-dot" />
                <span>Online</span>
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
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

            {/* RESULTADOS */}
            <div className="search-results-info">
              {filtered.length === 1
                ? "1 resultado encontrado"
                : `${filtered.length} resultados encontrados`}
            </div>

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

                  {e.tags?.length ? (
                    <p className="search-card-tags">
                      Tags: <span>{e.tags.join(", ")}</span>
                    </p>
                  ) : null}
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
