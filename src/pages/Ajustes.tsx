import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonToggle,
} from "@ionic/react";

import {
  homeOutline,
  barChartOutline,
  searchOutline,
  settingsOutline,
  notificationsOutline,
  lockClosedOutline,
  trashOutline,
  chevronForwardOutline,
} from "ionicons/icons";

import "../assets/styles/ajustes.css";
import { useState } from "react";
import { useHistory } from "react-router";

const Ajustes: React.FC = () => {
  const history = useHistory();

  // ============================
  // ESTADOS
  // ============================
  const [dailyReminder, setDailyReminder] = useState(
    localStorage.getItem("dailyReminder") === "true"
  );

  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem("reminderTime") || "20:00"
  );

  // ============================
  // CAMBIAR HORA
  // ============================
  const handleChangeTime = () => {
    const newTime = prompt(
      "Ingresa la hora del recordatorio (formato HH:MM):",
      reminderTime
    );

    if (newTime && /^\d{2}:\d{2}$/.test(newTime)) {
      setReminderTime(newTime);
      localStorage.setItem("reminderTime", newTime);
    } else if (newTime) {
      alert("Formato inválido. Usa HH:MM");
    }
  };

  // ============================
  // CONFIGURAR PIN
  // ============================
  const handleConfigurePin = () => {
    alert("Aquí iría la configuración del PIN (pendiente por implementar).");
  };

  // ============================
  // BORRAR TODOS LOS DATOS
  // ============================
  const handleDeleteAll = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar todos los datos? Esta acción no se puede deshacer."
    );

    if (confirmDelete) {
      localStorage.clear();
      alert("Todos los datos fueron eliminados correctamente.");
      window.location.reload();
    }
  };

  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar>
          <div className="titulo-container">
            <IonTitle className="titulo">Ajustes</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* CONTENIDO */}
      <IonContent fullscreen className="content">
        <div className="ajustes-wrapper">
          
          {/* ===================== */}
          {/*        SIDEBAR        */}
          {/* ===================== */}
          <div className="left-menu-container">
            <ul>
              <li onClick={() => history.push("/diario")}>
                <IonIcon icon={homeOutline} /> Inicio
              </li>

              <li onClick={() => history.push("/estadisticas")}>
                <IonIcon icon={barChartOutline} /> Estadísticas
              </li>

              <li onClick={() => history.push("/busqueda")}>
                <IonIcon icon={searchOutline} /> Buscar
              </li>

              <li className="active">
                <IonIcon icon={settingsOutline} /> Ajustes
              </li>
            </ul>
          </div>

          {/* ===================== */}
          {/*       CONTENIDO       */}
          {/* ===================== */}
          <div className="ajustes-content">

            {/* TARJETA USUARIO */}
            <IonCard className="user-card">
              <IonCardContent className="user-card-content">
                <div className="user-avatar">U</div>
                <div className="user-info">
                  <p className="user-name">Usuario</p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* ===================== */}
            {/*     GRID 2 COLUMNAS    */}
            {/* ===================== */}
            <div className="settings-row">
              
              {/* -------------------------------- */}
              {/*   COLUMNA IZQUIERDA — NOTIF     */}
              {/* -------------------------------- */}
              <div>
                <p className="section-title">Notificaciones</p>

                {/* Recordatorio diario */}
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
                      onIonChange={(e) => {
                        setDailyReminder(e.detail.checked);
                        localStorage.setItem(
                          "dailyReminder",
                          e.detail.checked.toString()
                        );
                      }}
                    />
                  </IonCardContent>
                </IonCard>

                {/* Configurar horario */}
                <IonCard
                  className="setting-card clickable"
                  onClick={handleChangeTime}
                >
                  <IonCardContent className="setting-grid">
                    <div className="setting-left">
                      <p className="setting-title">Configurar horario</p>
                      <p className="setting-sub-value">{reminderTime}</p>
                    </div>

                    <IonIcon
                      icon={chevronForwardOutline}
                      className="arrow-icon"
                    />
                  </IonCardContent>
                </IonCard>
              </div>

              {/* -------------------------------- */}
              {/*   COLUMNA DERECHA — SEGURIDAD    */}
              {/* -------------------------------- */}
              <div>
                <p className="section-title">Seguridad y Privacidad</p>

                {/* PIN */}
                <IonCard
                  className="setting-card clickable"
                  onClick={handleConfigurePin}
                >
                  <IonCardContent className="setting-grid">
                    <div className="setting-left icon-row">
                      <IonIcon
                        icon={lockClosedOutline}
                        className="setting-icon purple"
                      />
                      <div className="setting-texts">
                        <p className="setting-title">PIN de seguridad</p>
                        <p className="setting-sub">
                          Protege tu diario con un PIN
                        </p>
                      </div>
                    </div>

                    <IonIcon
                      icon={chevronForwardOutline}
                      className="arrow-icon"
                    />
                  </IonCardContent>
                </IonCard>

                {/* Eliminar datos */}
                <IonCard
                  className="setting-card danger clickable"
                  onClick={handleDeleteAll}
                >
                  <IonCardContent className="setting-grid">
                    <div className="setting-left icon-row">
                      <IonIcon
                        icon={trashOutline}
                        className="setting-icon red"
                      />
                      <div className="setting-texts">
                        <p className="setting-title red">Eliminar todos los datos</p>
                        <p className="setting-sub red">
                          Esta acción no se puede deshacer
                        </p>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ajustes;
