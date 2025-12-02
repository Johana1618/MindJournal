// src/services/diary.ts

const STORAGE_KEY = "mindjournal_entries_v1";

export type Mood = "feliz" | "triste" | "ansioso" | "tranquilo" | "enamorado";

export interface Entry {
  id: string;
  text: string;
  mood: Mood;
  dateISO: string;   // fecha completa en ISO
  tags?: string[];
}

// Cargar desde localStorage
function loadAll(): Entry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Entry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Guardar en localStorage
function saveAll(entries: Entry[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Obtener todas las entradas
export async function getAll(): Promise<Entry[]> {
  return loadAll();
}

// Crear nueva entrada (con fecha opcional)
export async function add(
  text: string,
  mood: Mood,
  tags: string[] = [],
  dateISO?: string
): Promise<void> {
  const entries = loadAll();

  const nowISO = dateISO ?? new Date().toISOString();

  const entry: Entry = {
    id:
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString()) + "-" + entries.length,
    text,
    mood,
    tags,
    dateISO: nowISO,
  };

  entries.push(entry);
  saveAll(entries);
}

// Actualizar entrada existente
export async function update(updated: Entry): Promise<void> {
  const entries = loadAll();
  const idx = entries.findIndex((e) => e.id === updated.id);
  if (idx !== -1) {
    entries[idx] = { ...updated };
    saveAll(entries);
  }
}

// Eliminar entrada
export async function remove(id: string): Promise<void> {
  const entries = loadAll().filter((e) => e.id !== id);
  saveAll(entries);
}
