import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonTextarea,
  IonFooter,
  IonButtons,
  IonNote,
  IonFab,
  IonFabButton,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonDatetime,
} from "@ionic/react";

import { useEffect, useState, useRef } from "react";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";

import * as Diary from "../services/diary";
import { Entry, Mood } from "../services/diary";

import "./Diario.css";

/* ------------------ CONSTANTES ------------------ */

const MOOD_LABEL: Record<Mood, string> = {
  feliz: "Feliz",
  triste: "Triste",
  ansioso: "Ansioso",
  tranquilo: "Tranquilo",
  motivado: "Enamorado",
};

const MOOD_EMOJI: Record<Mood, string> = {
  feliz: "😀",
  triste: "😰",
  ansioso: "😨",
  tranquilo: "😌",
  motivado: "😍",
};

/* ------------------ COMPONENTE ------------------ */

const Diario: React.FC = () => {
  const [items, setItems] = useState<Entry[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Entry | null>(null);

  const [text, setText] = useState("");
  const [mood, setMood] = useState<Mood>("feliz");
  const [tagsText, setTagsText] = useState("");
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString());

  const pageRef = useRef<HTMLElement | null>(null);

  /* ------------------ CARGA INICIAL ------------------ */

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

  /* ------------------ FORM ------------------ */

  function resetForm() {
    setText("");
    setMood("feliz");
    setTagsText("");
  }

  function openCreate() {
    resetForm();
    setEntryDate(new Date().toISOString());
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
    const tags = tagsText.split(",").map((s) => s.trim()).filter(Boolean);

    await Diary.add(t, mood, tags, entryDate);
    setShowCreate(false);
    resetForm();
    await load();
  }

  async function onUpdate() {
    if (!showEdit) return;
    const t = text.trim();
    if (!t) return;
    const tags = tagsText.split(",").map((s) => s.trim()).filter(Boolean);

    await Diary.update({
      ...showEdit,
      text: t,
      mood,
      tags,
      dateISO: entryDate,
    });

    setShowEdit(null);
    resetForm();
    await load();
  }

  async function onRemove(e: Entry) {
    await Diary.remove(e.id);
    await load();
  }

  /* ------------------ DATOS DEL DÍA ------------------ */

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayEntry =
    items.find((e) => e.dateISO.slice(0, 10) === todayISO) || items[0] || null;

  const recentEntries = items.slice(0, 3);

  /* ------------------ RENDER ------------------ */

  return (
    <IonPage ref={pageRef as any}>
      <IonHeader>
        <IonToolbar className="diario-toolbar">
          <IonTitle className="diario-logo">
            <div className="diario-logo-title">MindJournal</div>
            <div className="diario-logo-subtitle">Tu diario emocional</div>
          </IonTitle>

          {/* BADGE OFFLINE */}
          <IonButtons slot="end">
            <div className="status-badge">
              {/* Ícono Wifi OFF (SVG) */}
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

      {/* ----------- CONTENIDO ----------- */}
      <IonContent className="diario-page ion-padding">
        {items.length === 0 && <IonNote className="diario-empty"></IonNote>}

        {/* ESTADO DE HOY */}
        <IonCard className="estado-hoy-card">
          <IonCardHeader className="Titulos">
            <div className="header-content">
              <IonCardTitle>Estado de hoy</IonCardTitle>
              <IonCardTitle className="calendar-icon">🗓️</IonCardTitle>
            </div>
          </IonCardHeader>

          <IonCardContent>
            <div className="mood-scroll-container">
              {(Object.keys(MOOD_LABEL) as Mood[]).map((m) => (
                <div key={m} className="mood-item">
                  <div
                    className={`mood-circle ${
                      m === (todayEntry?.mood ?? mood) ? "selected" : ""
                    }`}
                  >
                    <span className="mood-emoji-large">
                      {MOOD_EMOJI[m]}
                    </span>
                  </div>
                  <span className="mood-label-text">{MOOD_LABEL[m]}</span>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>

        {/* ENTRADAS RECIENTES */}
        {items.length > 0 && (
          <>
            <div className="section-header">
              <h2>Mis entradas</h2>
              <h2>
                <a href="">Ver todas</a>
              </h2>
            </div>

            {recentEntries.map((e) => (
              <IonCard key={e.id} className="entrada-card">
                <div className="entrada-actions">
                  <div
                    className="entrada-action-btn-edit"
                    onClick={() => openEdit(e)}
                  >
                    <IonIcon icon={createOutline} />
                  </div>

                  <div
                    className="entrada-action-btn-remove"
                    onClick={() => onRemove(e)}
                  >
                    <IonIcon icon={trashOutline} />
                  </div>
                </div>

                <IonCardContent>
                  <div className="entrada-header">
                    <span className="entrada-mood">{MOOD_EMOJI[e.mood]}</span>
                    <span className="entrada-label">{MOOD_LABEL[e.mood]}</span>
                    <span className="entrada-date">
                      {new Date(e.dateISO).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="entrada-text">{e.text}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}

        {/* FAB AGREGAR */}
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
              <IonTitle className="entry-modal-title">Cómo estás hoy?</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCreate(false)}>
                  Cerrar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding entry-modal-content">
            <IonItem lines="full">
              <IonLabel position="stacked" className="entry-modal-label">
                Qué quieres escribir hoy?
              </IonLabel>
              <IonTextarea
                rows={3}
                autoGrow
                placeholder="Escribe aquí..."
                value={text}
                onIonChange={(e) => setText(e.detail.value || "")}
              />
            </IonItem>

            <IonItemDivider className="entry-modal-divider">
              Estado de ánimo
            </IonItemDivider>

            <IonRadioGroup
              value={mood}
              onIonChange={(e) => setMood(e.detail.value as Mood)}
            >
              {["feliz", "triste", "ansioso", "tranquilo", "motivado"].map(
                (m) => (
                  <IonItem key={m} className="entry-mood-item">
                    <IonLabel>
                      <span className="mood-emoji">{MOOD_EMOJI[m]}</span>{" "}
                      {MOOD_LABEL[m]}
                    </IonLabel>
                    <IonRadio slot="end" value={m} />
                  </IonItem>
                )
              )}
            </IonRadioGroup>

            <div className="entry-modal-calendar">
              <IonDatetime
                presentation="date"
                preferWheel={false}
                showDefaultTitle={false}
                showDefaultButtons={false}
                value={entryDate}
                onIonChange={(ev) => {
                  const val = ev.detail.value;
                  if (typeof val === "string") setEntryDate(val);
                  else if (Array.isArray(val) && val[0])
                    setEntryDate(val[0] as string);
                }}
              />
            </div>
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
              {["feliz", "triste", "ansioso", "tranquilo", "motivado"].map(
                (m) => (
                  <IonItem key={m}>
                    <IonLabel>
                      {MOOD_EMOJI[m]} {MOOD_LABEL[m]}
                    </IonLabel>
                    <IonRadio slot="end" value={m} />
                  </IonItem>
                )
              )}
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
