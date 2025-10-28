/**
 * Design Store
 * Manages storage and retrieval of note templates and designs
 */

import type { NoteDesign, NoteTemplate, DesignPreset } from '@/types/design';
import type { StorageAdapter } from '@/types/storage';

export class DesignStore {
  private storage: StorageAdapter;
  private readonly TEMPLATES_KEY = 'note-templates';
  private readonly DESIGNS_KEY = 'note-designs';
  private readonly PRESETS_KEY = 'design-presets';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // Template Management
  async saveTemplate(template: NoteTemplate): Promise<void> {
    const templates = await this.getAllTemplates();
    const index = templates.findIndex(t => t.id === template.id);

    if (index >= 0) {
      templates[index] = { ...template, updatedAt: Date.now() };
    } else {
      templates.push(template);
    }

    await this.storage.set(this.TEMPLATES_KEY, templates);
  }

  async getTemplate(id: string): Promise<NoteTemplate | null> {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.id === id) || null;
  }

  async getAllTemplates(): Promise<NoteTemplate[]> {
    return await this.storage.get<NoteTemplate[]>(this.TEMPLATES_KEY) || [];
  }

  async deleteTemplate(id: string): Promise<void> {
    const templates = await this.getAllTemplates();
    const filtered = templates.filter(t => t.id !== id);
    await this.storage.set(this.TEMPLATES_KEY, filtered);
  }

  // Design Management
  async saveDesign(design: NoteDesign): Promise<void> {
    const designs = await this.getAllDesigns();
    const index = designs.findIndex(d => d.templateId === design.templateId);

    if (index >= 0) {
      designs[index] = design;
    } else {
      designs.push(design);
    }

    await this.storage.set(this.DESIGNS_KEY, designs);
  }

  async getDesign(templateId: string): Promise<NoteDesign | null> {
    const designs = await this.getAllDesigns();
    return designs.find(d => d.templateId === templateId) || null;
  }

  async getAllDesigns(): Promise<NoteDesign[]> {
    return await this.storage.get<NoteDesign[]>(this.DESIGNS_KEY) || [];
  }

  async deleteDesign(templateId: string): Promise<void> {
    const designs = await this.getAllDesigns();
    const filtered = designs.filter(d => d.templateId !== templateId);
    await this.storage.set(this.DESIGNS_KEY, filtered);
  }

  // Preset Management
  async savePreset(preset: DesignPreset): Promise<void> {
    const presets = await this.getAllPresets();
    const index = presets.findIndex(p => p.id === preset.id);

    if (index >= 0) {
      presets[index] = { ...preset, updatedAt: Date.now() };
    } else {
      presets.push(preset);
    }

    await this.storage.set(this.PRESETS_KEY, presets);
  }

  async getPreset(id: string): Promise<DesignPreset | null> {
    const presets = await this.getAllPresets();
    return presets.find(p => p.id === id) || null;
  }

  async getAllPresets(): Promise<DesignPreset[]> {
    return await this.storage.get<DesignPreset[]>(this.PRESETS_KEY) || [];
  }

  async deletePreset(id: string): Promise<void> {
    const presets = await this.getAllPresets();
    const filtered = presets.filter(p => p.id !== id);
    await this.storage.set(this.PRESETS_KEY, filtered);
  }

  // Import/Export
  async exportDesign(design: NoteDesign): Promise<string> {
    return JSON.stringify(design, null, 2);
  }

  async importDesign(json: string): Promise<NoteDesign> {
    const design = JSON.parse(json) as NoteDesign;
    await this.saveDesign(design);
    return design;
  }

  async exportTemplate(template: NoteTemplate): Promise<string> {
    return JSON.stringify(template, null, 2);
  }

  async importTemplate(json: string): Promise<NoteTemplate> {
    const template = JSON.parse(json) as NoteTemplate;
    await this.saveTemplate(template);
    return template;
  }

  async exportPreset(preset: DesignPreset): Promise<string> {
    return JSON.stringify(preset, null, 2);
  }

  async importPreset(json: string): Promise<DesignPreset> {
    const preset = JSON.parse(json) as DesignPreset;
    await this.savePreset(preset);
    return preset;
  }
}
