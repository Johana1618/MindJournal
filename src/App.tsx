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
import { Route, Redirect } from "react-router-dom";
import {
  homeOutline,
  statsChartOutline,
  searchOutline,
  settingsOutline,
} from "ionicons/icons";
import Diario from "./pages/Diario";
import Estadisticas from "./pages/Estadisticas";
import Busqueda from "./pages/Busqueda";
import Ajustes from "./pages/Ajustes";

import "@ionic/react/css/core.css";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/diario" component={Diario} />
          <Route exact path="/estadisticas" component={Estadisticas} />
          <Route exact path="/busqueda" component={Busqueda} />
          <Route exact path="/ajustes" component={Ajustes} />
          <Redirect exact from="/" to="/diario" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="diario" href="/diario">
            <IonIcon icon={homeOutline} />
            <IonLabel>Inicio</IonLabel>
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
