import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonChip,
  IonIcon,
  IonCard,
  IonCardContent,
  IonToggle,
} from "@ionic/react";

import {
  wifiOutline,
  notificationsOutline,
  lockClosedOutline,
  trashOutline,
  chevronForwardOutline,
} from "ionicons/icons";

import "../assets/styles/general.css";
import "../assets/styles/ajustes.css";
import { useState } from "react";

const Ajustes: React.FC = () => {
  const [dailyReminder, setDailyReminder] = useState(true);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="titulo">Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content">
        {/* Fila superior: Ajustes + chip Offline */}
        <div className="ajustes-top-row">
          <h1 className="ajustes-title">Ajustes</h1>
          <IonChip className="status-chip" color="success">
            <IonIcon icon={wifiOutline} />
            <span>Offline</span>
          </IonChip>
        </div>

        {/* USER CARD */}
        <IonCard className="user-card">
          <IonCardContent className="user-card-content">
            <div className="user-avatar">U</div>
            <div className="user-info">
              <p className="user-name">Usuario</p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* SECTION: NOTIFICACIONES */}
        <p className="section-title">Notificaciones</p>

        {/* DAILY REMINDER */}
        <IonCard className="setting-card">
          <IonCardContent className="setting-grid">
            <div className="setting-left icon-row">
              <IonIcon
                icon={notificationsOutline}
                className="setting-icon purple"
              />
              <div className="setting-texts">
                <p className="setting-title">Recordatorio diario</p>
                <p className="setting-sub">
                  Recibe recordatorios para escribir
                </p>
              </div>
            </div>

            <IonToggle
              className="setting-toggle"
              checked={dailyReminder}
              onIonChange={(e) => setDailyReminder(e.detail.checked)}
            />
          </IonCardContent>
        </IonCard>

        {/* CONFIGURAR HORARIO */}
        <IonCard className="setting-card clickable setting-card-time">
          <IonCardContent className="setting-grid">
            <div className="setting-left">
              <p className="setting-title">Configurar horario</p>
              <p className="setting-sub-value">20:00</p>
            </div>

            <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
          </IonCardContent>
        </IonCard>

        {/* SECTION: SEGURIDAD */}
        <p className="section-title">Seguridad y Privacidad</p>

        {/* PIN DE SEGURIDAD */}
        <IonCard className="setting-card clickable">
          <IonCardContent className="setting-grid">
            <div className="setting-left icon-row">
              <IonIcon
                icon={lockClosedOutline}
                className="setting-icon purple"
              />
              <div className="setting-texts">
                <p className="setting-title">PIN de seguridad</p>
                <p className="setting-sub">Protege tu diario con un PIN</p>
              </div>
            </div>

            <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
          </IonCardContent>
        </IonCard>

        {/* DELETE ALL */}
        <IonCard className="setting-card danger clickable">
          <IonCardContent className="setting-grid">
            <div className="setting-left icon-row">
              <IonIcon icon={trashOutline} className="setting-icon red" />
              <div className="setting-texts">
                <p className="setting-title red">Eliminar todos los datos</p>
                <p className="setting-sub red">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Ajustes;
