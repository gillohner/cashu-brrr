/**
 * Design Store
 * Manages note design state using Svelte 5 runes
 */

import { writable } from 'svelte/store';
import type { NoteDesign, NoteTemplate } from '@/types/design';

interface DesignState {
  currentTemplate: NoteTemplate | null;
  currentDesign: NoteDesign | null;
  availableTemplates: NoteTemplate[];
  isDirty: boolean;
}

const initialState: DesignState = {
  currentTemplate: null,
  currentDesign: null,
  availableTemplates: [],
  isDirty: false,
};

function createDesignStore() {
  const { subscribe, set, update } = writable<DesignState>(initialState);

  return {
    subscribe,

    setTemplate: (template: NoteTemplate) =>
      update(state => ({ ...state, currentTemplate: template, isDirty: true })),

    setDesign: (design: NoteDesign) =>
      update(state => ({ ...state, currentDesign: design, isDirty: true })),

    updateDesign: (updater: (design: NoteDesign) => NoteDesign) =>
      update(state => ({
        ...state,
        currentDesign: state.currentDesign ? updater(state.currentDesign) : null,
        isDirty: true,
      })),

    setTemplates: (templates: NoteTemplate[]) =>
      update(state => ({ ...state, availableTemplates: templates })),

    addTemplate: (template: NoteTemplate) =>
      update(state => ({
        ...state,
        availableTemplates: [...state.availableTemplates, template],
      })),

    markClean: () =>
      update(state => ({ ...state, isDirty: false })),

    reset: () => set(initialState),
  };
}

export const designStore = createDesignStore();
