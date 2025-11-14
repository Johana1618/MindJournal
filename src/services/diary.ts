import { Storage } from "@ionic/storage";
import { v4 as uuid } from "uuid";

export type Mood = "feliz" | "triste" | "ansioso" | "tranquilo" | "motivado";

export interface Entry {
  id: string;
  dateISO: string;
  mood: Mood;
  text: string;
  tags?: string[];
}

const STORAGE_KEY = "mj_entries";
let storage: Storage | null = null;

async function getStore() {
  if (!storage) {
    storage = new Storage({ name: "mindjournal" });
    await storage.create();
  }
  return storage;
}

export async function getAll(): Promise<Entry[]> {
  const s = await getStore();
  return (await s.get(STORAGE_KEY)) || [];
}
async function saveAll(list: Entry[]) {
  const s = await getStore();
  await s.set(STORAGE_KEY, list);
}

export async function add(text: string, mood: Mood = "feliz", tags: string[] = []) {
  const list = await getAll();
  const e: Entry = { id: uuid(), dateISO: new Date().toISOString(), mood, text, tags };
  list.push(e);
  await saveAll(list);
  return e;
}

export async function update(entry: Entry) {
  const list = await getAll();
  const i = list.findIndex(x => x.id === entry.id);
  if (i >= 0) { list[i] = entry; await saveAll(list); }
}

export async function remove(id: string) {
  const list = await getAll();
  await saveAll(list.filter(x => x.id !== id));
}

export async function search(q: string) {
  const s = q.toLowerCase();
  const list = await getAll();
  return list.filter(e =>
    e.text.toLowerCase().includes(s) ||
    (e.tags || []).some(t => t.toLowerCase().includes(s))
  );
}
