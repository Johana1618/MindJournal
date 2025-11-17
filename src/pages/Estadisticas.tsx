import "./Estadisticas.css"
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
  IonSpinner,
} from "@ionic/react";
import { useEffect, useState } from "react";
import * as Diary from "../services/diary";
import { Entry } from "../services/diary";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#34c759", "#ff3b30", "#ffcc00", "#5ac8fa", "#5856d6"];

const Estadisticas: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await Diary.getAll();
      setEntries(data);
      setLoading(false);
    }
    load();
  }, []);

  const moodCounts = entries.reduce(
    (acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = Object.keys(moodCounts).map((mood) => ({
    name:
      {
        feliz: "😊 Feliz",
        triste: "😔 Triste",
        ansioso: "😰 Ansioso",
        tranquilo: "😌 Tranquilo",
        motivado: "🚀 Motivado",
      }[mood] || mood,
    value: moodCounts[mood],
  }));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="titulo">Estadísticas</IonTitle>
          <span className="subtitulo">Analiza tu estado emocional</span>
        </IonToolbar>
      </IonHeader>

      <IonContent className="content" fullscreen>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <IonSpinner name="crescent" />
          </div>
        ) : entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>
            Aún no tienes entradas registradas.
          </p>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Distribución de estados de ánimo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Estadisticas;
