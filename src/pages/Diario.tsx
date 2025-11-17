// src/pages/Diario.tsx
import "../assets/styles/general.css";  
import "./Diario.css"; 

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal,
  IonTextarea,
  IonFooter,
  IonButtons,
  IonText,
  IonNote,
  IonFab,
  IonFabButton,
  IonRadioGroup,
  IonRadio,
  IonItemDivider,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";
import * as Diary from "../services/diary";
import { Entry, Mood } from "../services/diary";

const Diario: React.FC = () => {
  const [items, setItems] = useState<Entry[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<Entry | null>(null);

  // estado del formulario
  const [text, setText] = useState("");
  const [mood, setMood] = useState<Mood>("feliz");
  const [tagsText, setTagsText] = useState("");

  const pageRef = useRef<HTMLElement | null>(null);

  async function load() { setItems(await Diary.getAll()); }
  useEffect(() => { load(); }, []);

  function resetForm() {
    setText("");
    setMood("feliz");
    setTagsText("");
  }

  function openCreate() {
    resetForm();
    setShowCreate(true);
  }

  function openEdit(e: Entry) {
    setText(e.text);
    setMood(e.mood);
    setTagsText((e.tags || []).join(", "));
    setShowEdit(e);
  }

  async function onCreate() {
    const t = text.trim();
    if (!t) return;
    const tags = tagsText.split(",").map(s => s.trim()).filter(Boolean);
    await Diary.add(t, mood, tags);
    setShowCreate(false);
    resetForm();
    await load();
  }

  async function onUpdate() {
    if (!showEdit) return;
    const t = text.trim();
    if (!t) return;
    const tags = tagsText.split(",").map(s => s.trim()).filter(Boolean);
    await Diary.update({ ...showEdit, text: t, mood, tags });
    setShowEdit(null);
    resetForm();
    await load();
  }

  async function onRemove(e: Entry) {
    await Diary.remove(e.id);
    await load();
  }

  return (
    <IonPage ref={pageRef as any}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="titulo">MindJournal</IonTitle>
          <span className="subtitulo">Tu diario emocional</span>
        </IonToolbar>
      </IonHeader>

      <IonContent className="content" fullscreen>
        {items.length === 0 && (
          <IonNote>
            Crea tu primera entrada con el botón <b>+</b> abajo a la derecha.
          </IonNote>
        )}

        <IonList>
          {items.map((e) => (
            <IonItem key={e.id} button onClick={() => openEdit(e)}>
              <IonLabel>
                <h2>
                  {new Date(e.dateISO).toLocaleString()} •{" "}
                  {{
                    feliz: "😊 Feliz",
                    triste: "😔 Triste",
                    ansioso: "😰 Ansioso",
                    tranquilo: "😌 Tranquilo",
                    motivado: "🚀 Motivado",
                  }[e.mood]}
                </h2>
                <p>{e.text}</p>
                {e.tags?.length ? (
                  <IonText color="medium">
                    <small>Tags: {e.tags.join(", ")}</small>
                  </IonText>
                ) : null}
              </IonLabel>

              <IonButton
                fill="clear"
                color="medium"
                onClick={(ev) => {
                  ev.stopPropagation();
                  openEdit(e);
                }}
              >
                <IonIcon icon={createOutline} />
              </IonButton>
              <IonButton
                fill="clear"
                color="danger"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onRemove(e);
                }}
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* FAB '+' visible y azul */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" onClick={openCreate}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* MODAL CREAR (centrado tipo tarjeta) */}
        <IonModal
          isOpen={showCreate}
          onDidDismiss={() => setShowCreate(false)}
          backdropDismiss={false}
          className="custom-modal"
        >
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Nueva entrada</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCreate(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <div className="modal-body">
            <IonItem lines="full">
              <IonLabel position="stacked">¿Qué quieres escribir hoy?</IonLabel>
              <IonTextarea
                rows={4}
                autoGrow
                placeholder="Escribe aquí..."
                value={text}
                onIonChange={(e) => setText(e.detail.value || "")}
              />
            </IonItem>

            <IonItemDivider>Estado de ánimo</IonItemDivider>
            <IonRadioGroup
              value={mood}
              onIonChange={(e) => setMood(e.detail.value as Mood)}
            >
              <IonItem><IonLabel>😊 Feliz</IonLabel><IonRadio slot="end" value="feliz" /></IonItem>
              <IonItem><IonLabel>😔 Triste</IonLabel><IonRadio slot="end" value="triste" /></IonItem>
              <IonItem><IonLabel>😰 Ansioso</IonLabel><IonRadio slot="end" value="ansioso" /></IonItem>
              <IonItem><IonLabel>😌 Tranquilo</IonLabel><IonRadio slot="end" value="tranquilo" /></IonItem>
              <IonItem><IonLabel>🚀 Motivado</IonLabel><IonRadio slot="end" value="motivado" /></IonItem>
            </IonRadioGroup>

            <IonItem>
              <IonLabel position="stacked">Tags (separadas por coma)</IonLabel>
              <IonTextarea
                rows={2}
                placeholder="ej: estudio, salud, trabajo"
                value={tagsText}
                onIonChange={(e) => setTagsText(e.detail.value || "")}
              />
            </IonItem>
            </div>
          </IonContent>

          <IonFooter className="ion-padding">
            <IonButtons>
              <IonButton fill="outline" onClick={() => setShowCreate(false)}>
                Cancelar
              </IonButton>
              <IonButton color="primary" onClick={onCreate} disabled={!text.trim()}>
                Guardar
              </IonButton>
            </IonButtons>
          </IonFooter>
        </IonModal>

        {/* MODAL EDITAR (centrado tipo tarjeta) */}
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
                <IonButton onClick={() => setShowEdit(null)}>Cerrar</IonButton>
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
              <IonItem><IonLabel>😊 Feliz</IonLabel><IonRadio slot="end" value="feliz" /></IonItem>
              <IonItem><IonLabel>😔 Triste</IonLabel><IonRadio slot="end" value="triste" /></IonItem>
              <IonItem><IonLabel>😰 Ansioso</IonLabel><IonRadio slot="end" value="ansioso" /></IonItem>
              <IonItem><IonLabel>😌 Tranquilo</IonLabel><IonRadio slot="end" value="tranquilo" /></IonItem>
              <IonItem><IonLabel>🚀 Motivado</IonLabel><IonRadio slot="end" value="motivado" /></IonItem>
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
              <IonButton color="primary" onClick={onUpdate} disabled={!text.trim()}>
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
