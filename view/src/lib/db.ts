import { openDB, type IDBPDatabase } from 'idb';
import type { SavedState, Criterion } from '../types';

const DB_NAME = 'CriteriEvaluatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'appState';

let db: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (db) return db;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  return db;
}

export async function saveState(state: SavedState): Promise<void> {
  const database = await initDB();
  await database.put(STORE_NAME, state, 'currentState');
}

export async function loadState(): Promise<SavedState | null> {
  const database = await initDB();
  const state = await database.get(STORE_NAME, 'currentState');
  return state || null;
}

export function getDefaultCriteria(): Criterion[] {
  return [
    {
      id: 'clarity',
      title: 'Clareza',
      prompt: 'Avalie a clareza do texto. O texto é fácil de entender? As ideias são apresentadas de forma clara e direta?'
    },
    {
      id: 'coherence',
      title: 'Coerência',
      prompt: 'Avalie a coerência do texto. As ideias estão logicamente conectadas? Há uma sequência lógica de pensamentos?'
    },
    {
      id: 'grammar',
      title: 'Gramática',
      prompt: 'Avalie a gramática e ortografia do texto. Há erros gramaticais, ortográficos ou de pontuação?'
    },
    {
      id: 'creativity',
      title: 'Criatividade',
      prompt: 'Avalie a criatividade do texto. O texto apresenta ideias originais, inovadoras ou perspectivas interessantes?'
    }
  ];
} 