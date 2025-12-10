export interface VocabularyItem {
  id: string;
  word: string;
  example: string;
  date: string;
}

const STORAGE_KEY = 'ai-english-vocabulary';

export function getVocabulary(): VocabularyItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveToVocabulary(item: Omit<VocabularyItem, 'id'>): void {
  const vocabulary = getVocabulary();
  const newItem: VocabularyItem = {
    ...item,
    id: Date.now().toString(),
  };
  vocabulary.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vocabulary));
}

export function removeFromVocabulary(id: string): void {
  const vocabulary = getVocabulary();
  const filtered = vocabulary.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
