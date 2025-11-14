// src/App.tsx (React Router v5)
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom"; // v5: Redirect + component

import {
  bookOutline,
  statsChartOutline,
  searchOutline,
  settingsOutline,
} from "ionicons/icons";

import Diario from "./Diario";
import Estadisticas from "./Estadisticas";
import Busqueda from "./Busqueda";
import Ajustes from "./Ajustes";

/* CSS base de Ionic */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Opcionales útiles */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* v5: se usa component={Componente} y exact */}
          <Route exact path="/diario" component={Diario} />
          <Route exact path="/estadisticas" component={Estadisticas} />
          <Route exact path="/busqueda" component={Busqueda} />
          <Route exact path="/ajustes" component={Ajustes} />
          {/* ruta por defecto */}
          <Route exact path="/" render={() => <Redirect to="/diario" />} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="diario" href="/diario">
            <IonIcon icon={bookOutline} />
            <IonLabel>Diario</IonLabel>
          </IonTabButton>
          <IonTabButton tab="estadisticas" href="/estadisticas">
            <IonIcon icon={statsChartOutline} />
            <IonLabel>Estadísticas</IonLabel>
          </IonTabButton>
          <IonTabButton tab="busqueda" href="/busqueda">
            <IonIcon icon={searchOutline} />
            <IonLabel>Búsqueda</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ajustes" href="/ajustes">
            <IonIcon icon={settingsOutline} />
            <IonLabel>Ajustes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
