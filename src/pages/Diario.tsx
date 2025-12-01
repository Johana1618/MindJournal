import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonTextarea,
  IonFooter,
  IonButtons,
  IonText,
  IonFab,
  IonFabButton,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonNote,
  IonChip,
  IonDatetime,
} from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import {
  addOutline,
  createOutline,
  trashOutline,
  homeOutline,
  barChartOutline,
  searchOutline,
  settingsOutline,
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";

import * as Diary from "../services/diary";
import { Entry, Mood } from "../services/diary";

import "./Diario.css";

const MOOD_LABEL: Record<Mood, string> = {
  feliz: "Feliz",
  triste: "Triste",
  ansioso: "Ansioso",
  tranquilo: "Tranquilo",
  motivado: "Motivado",
};

const MOOD_EMOJI: Record<Mood, string> = {
  feliz: "😊",
  triste: "😔",
  ansioso: "😰",
  tranquilo: "😌",
  motivado: "🚀",
};

const Diario: React.FC = () => {
  const [items, setItems] = useState<Entry[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Entry | null>(null);

  const [text, setText] = useState("");
  const [mood, setMood] = useState<Mood>("feliz");
  const [tagsText, setTagsText] = useState("");
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString());

  const pageRef = useRef<HTMLElement | null>(null);

  const history = useHistory();
  const location = useLocation();
  const currentPath = location.pathname;

  async function load() {
    const all = await Diary.getAll();
    setItems(
      [...all].sort(
        (a, b) =>
          new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
      )
    );
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setText("");
    setMood("feliz");
    setTagsText("");
  }

  function openCreate() {
    resetForm();
    setEntryDate(new Date().toISOString()); // hoy
    setShowCreate(true);
  }

  function openEdit(e: Entry) {
    setText(e.text);
    setMood(e.mood);
    setTagsText((e.tags || []).join(", "));
    setEntryDate(e.dateISO);
    setShowEdit(e);
  }

  async function onCreate() {
    const t = text.trim();
    if (!t) return;
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await Diary.add(t, mood, tags, entryDate);
    setShowCreate(false);
    resetForm();
    await load();
  }

  async function onUpdate() {
    if (!showEdit) return;
    const t = text.trim();
    if (!t) return;
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

      await Diary.update({
    ...showEdit,
    text: t,
    mood,
    tags,
    dateISO: entryDate,                     // ⬅ actualizamos fecha
  });
    setShowEdit(null);
    resetForm();
    await load();
  }

  async function onRemove(e: Entry) {
    await Diary.remove(e.id);
    await load();
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayEntry =
    items.find((e) => e.dateISO.slice(0, 10) === todayISO) || items[0] || null;

  const recentEntries = items.slice(0, 3);

  const goTo = (path: string) => {
    if (currentPath !== path) {
      history.push(path);
    }
  };

  return (
    <IonPage ref={pageRef as any}>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar className="diario-toolbar">
          <IonTitle className="diario-logo">
            <div className="diario-logo-title">MindJournal</div>
            <div className="diario-logo-subtitle">Tu diario emocional</div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* CONTENIDO PRINCIPAL */}
      <IonContent className="diario-page ion-padding">
        <div className="diario-inner">
          <IonGrid>
            <IonRow>
              {/* SIDEBAR: SOLO ESCRITORIO */}
              <IonCol size="0" sizeMd="3" className="sidebar-col">
                <div className="sidebar">
                  <div>
                    <div className="sidebar-menu">
                      <div
                        className={
                          "sidebar-item" +
                          (currentPath === "/diario" ? " active" : "")
                        }
                        onClick={() => goTo("/diario")}
                      >
                        <IonIcon icon={homeOutline} className="sidebar-icon" />
                        <span>Inicio</span>
                      </div>

                      <div
                        className={
                          "sidebar-item" +
                          (currentPath === "/estadisticas" ? " active" : "")
                        }
                        onClick={() => goTo("/estadisticas")}
                      >
                        <IonIcon
                          icon={barChartOutline}
                          className="sidebar-icon"
                        />
                        <span>Estadísticas</span>
                      </div>

                      <div
                        className={
                          "sidebar-item" +
                          (currentPath === "/busqueda" ? " active" : "")
                        }
                        onClick={() => goTo("/busqueda")}
                      >
                        <IonIcon
                          icon={searchOutline}
                          className="sidebar-icon"
                        />
                        <span>Buscar</span>
                      </div>

                      <div
                        className={
                          "sidebar-item" +
                          (currentPath === "/ajustes" ? " active" : "")
                        }
                        onClick={() => goTo("/ajustes")}
                      >
                        <IonIcon
                          icon={settingsOutline}
                          className="sidebar-icon"
                        />
                        <span>Ajustes</span>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-status">
                    <span className="sidebar-status-pill">● Online</span>
                  </div>
                </div>
              </IonCol>

              {/* COLUMNA PRINCIPAL (ESTADO DE HOY + ENTRADAS) */}
              <IonCol size="12" sizeMd="9">
                {items.length === 0 && (
                  <IonNote className="diario-empty">
                    Aún no tienes entradas. Crea tu primera entrada con el botón{" "}
                    <b>+</b> en la parte inferior.
                  </IonNote>
                )}

                <IonGrid fixed>
                  {/* Estado de hoy */}
                  <IonRow>
                    <IonCol size="12">
                      <IonCard className="estado-hoy-card">
                        <IonCardHeader>
                          <IonCardTitle>Estado de hoy</IonCardTitle>
                          {todayEntry && (
                            <IonCardSubtitle>
                              {MOOD_EMOJI[todayEntry.mood]}{" "}
                              {MOOD_LABEL[todayEntry.mood]}
                            </IonCardSubtitle>
                          )}
                          {!todayEntry && (
                            <IonCardSubtitle>
                              Aún no has registrado tu estado de ánimo hoy.
                            </IonCardSubtitle>
                          )}
                        </IonCardHeader>
                        <IonCardContent>
                          <div className="mood-row">
                            {(Object.keys(MOOD_LABEL) as Mood[]).map((m) => (
                              <IonChip
                                key={m}
                                outline={
                                  m !== (todayEntry?.mood ?? mood)
                                }
                                color={
                                  m === (todayEntry?.mood ?? mood)
                                    ? "primary"
                                    : "medium"
                                }
                                className="mood-chip"
                              >
                                <span className="mood-emoji">
                                  {MOOD_EMOJI[m]}
                                </span>
                                <span>{MOOD_LABEL[m]}</span>
                              </IonChip>
                            ))}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>

                  {/* Mis entradas */}
                  {items.length > 0 && (
                    <IonRow>
                      <IonCol size="12">
                        <div className="section-header">
                          <h2>Mis entradas</h2>
                          {/* Futuro: "Ver todas" */}
                        </div>
                      </IonCol>

                      {recentEntries.map((e) => (
                        <IonCol
                          size="12"
                          sizeMd="6"
                          key={e.id}
                          className="entrada-col"
                        >
                          <IonCard
                            button
                            onClick={() => openEdit(e)}
                            className="entrada-card"
                          >
                            <IonCardContent>
                              <div className="entrada-header">
                                <span className="entrada-mood">
                                  {MOOD_EMOJI[e.mood]} {MOOD_LABEL[e.mood]}
                                </span>
                                <span className="entrada-date">
                                  {new Date(
                                    e.dateISO
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="entrada-text">{e.text}</p>
                              {e.tags?.length ? (
                                <IonText
                                  color="medium"
                                  className="entrada-tags"
                                >
                                  <small>Tags: {e.tags.join(", ")}</small>
                                </IonText>
                              ) : null}

                              <div className="entrada-actions">
                                <IonButton
                                  fill="clear"
                                  size="small"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    openEdit(e);
                                  }}
                                >
                                  <IonIcon
                                    slot="icon-only"
                                    icon={createOutline}
                                  />
                                </IonButton>
                                <IonButton
                                  fill="clear"
                                  size="small"
                                  color="danger"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    onRemove(e);
                                  }}
                                >
                                  <IonIcon
                                    slot="icon-only"
                                    icon={trashOutline}
                                  />
                                </IonButton>
                              </div>
                            </IonCardContent>
                          </IonCard>
                        </IonCol>
                      ))}
                    </IonRow>
                  )}
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* FAB + */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" onClick={openCreate}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        {/* MODAL CREAR */}
        <IonModal
          isOpen={showCreate}
          onDidDismiss={() => setShowCreate(false)}
          backdropDismiss={false}
          className="custom-modal"
        >
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle className="entry-modal-title">¿Cómo estás hoy ?</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCreate(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
        
          <IonContent className="ion-padding entry-modal-content">
            {/* Pregunta de texto */}
            <IonItem lines="full">
              <IonLabel position="stacked" className="entry-modal-label">
                ¿Qué quieres escribir hoy ?
              </IonLabel>
              <IonTextarea
                rows={3}
                autoGrow
                placeholder="Escribe aquí..."
                value={text}
                onIonChange={(e) => setText(e.detail.value || "")}
              />
            </IonItem>
        
            {/* Estado de ánimo */}
            <IonItemDivider className="entry-modal-divider">
              Estado de ánimo
            </IonItemDivider>
            <IonRadioGroup
              value={mood}
              onIonChange={(e) => setMood(e.detail.value as Mood)}
            >
              <IonItem className="entry-mood-item">
                <IonLabel>
                  <span className="mood-emoji">😊</span> Feliz
                </IonLabel>
                <IonRadio slot="end" value="feliz" />
              </IonItem>
              <IonItem className="entry-mood-item">
                <IonLabel>
                  <span className="mood-emoji">😔</span> Triste
                </IonLabel>
                <IonRadio slot="end" value="triste" />
              </IonItem>
              <IonItem className="entry-mood-item">
                <IonLabel>
                  <span className="mood-emoji">😰</span> Ansioso
                </IonLabel>
                <IonRadio slot="end" value="ansioso" />
              </IonItem>
              <IonItem className="entry-mood-item">
                <IonLabel>
                  <span className="mood-emoji">😌</span> Tranquilo
                </IonLabel>
                <IonRadio slot="end" value="tranquilo" />
              </IonItem>
              <IonItem className="entry-mood-item">
                <IonLabel>
                  <span className="mood-emoji">🚀</span> Motivado
                </IonLabel>
                <IonRadio slot="end" value="motivado" />
              </IonItem>
            </IonRadioGroup>
        
            {/* Calendario  */}
            <div className="entry-modal-calendar">
              <IonDatetime
                presentation="date"
                preferWheel={false}
                showDefaultTitle={false}
                showDefaultButtons={false}
                value={entryDate}
                onIonChange={(ev) => {
                  const val = ev.detail.value;
                  if (typeof val === "string") {
                    setEntryDate(val);
                  } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
                    setEntryDate(val[0]);
                  }
                }}
              />
            </div>
        
            {/* Tags opcionales */}
            <IonItem lines="none" className="entry-modal-tags">
              <IonLabel position="stacked">Tags (separadas por coma)</IonLabel>
              <IonTextarea
                rows={2}
                placeholder="ej: estudio, salud, trabajo"
                value={tagsText}
                onIonChange={(e) => setTagsText(e.detail.value || "")}
              />
            </IonItem>
          </IonContent>
        
          <IonFooter className="ion-padding entry-modal-footer">
            <IonButtons>
              <IonButton fill="outline" onClick={() => setShowCreate(false)}>
                Cancelar
              </IonButton>
              <IonButton
                color="primary"
                onClick={onCreate}
                disabled={!text.trim()}
              >
                Guardar
              </IonButton>
            </IonButtons>
          </IonFooter>
        </IonModal>

        {/* MODAL EDITAR */}
        <IonModal
          isOpen={!!showEdit}
          onDidDismiss={() => setShowEdit(null)}
          backdropDismiss={false}
          className="custom-modal"
        >
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Editar entrada</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEdit(null)}>
                  Cerrar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem lines="full">
              <IonLabel position="stacked">Texto</IonLabel>
              <IonTextarea
                rows={4}
                autoGrow
                value={text}
                onIonChange={(e) => setText(e.detail.value || "")}
              />
            </IonItem>

            <IonItemDivider>Estado de ánimo</IonItemDivider>
            <IonRadioGroup
              value={mood}
              onIonChange={(e) => setMood(e.detail.value as Mood)}
            >
              <IonItem>
                <IonLabel>😊 Feliz</IonLabel>
                <IonRadio slot="end" value="feliz" />
              </IonItem>
              <IonItem>
                <IonLabel>😔 Triste</IonLabel>
                <IonRadio slot="end" value="triste" />
              </IonItem>
              <IonItem>
                <IonLabel>😰 Ansioso</IonLabel>
                <IonRadio slot="end" value="ansioso" />
              </IonItem>
              <IonItem>
                <IonLabel>😌 Tranquilo</IonLabel>
                <IonRadio slot="end" value="tranquilo" />
              </IonItem>
              <IonItem>
                <IonLabel>🚀 Motivado</IonLabel>
                <IonRadio slot="end" value="motivado" />
              </IonItem>
            </IonRadioGroup>

            <IonItem>
              <IonLabel position="stacked">Tags</IonLabel>
              <IonTextarea
                rows={2}
                placeholder="ej: estudio, salud, trabajo"
                value={tagsText}
                onIonChange={(e) => setTagsText(e.detail.value || "")}
              />
            </IonItem>
          </IonContent>

          <IonFooter className="ion-padding">
            <IonButtons>
              <IonButton fill="outline" onClick={() => setShowEdit(null)}>
                Cancelar
              </IonButton>
              <IonButton
                color="primary"
                onClick={onUpdate}
                disabled={!text.trim()}
              >
                Actualizar
              </IonButton>
            </IonButtons>
          </IonFooter>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Diario;
