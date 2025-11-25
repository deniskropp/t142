export interface SpaceSection {
  id: string;
  rawHeader: string;
  name: string;
  type: string;
  place: string;
  content: string;
}

export interface ParseResult {
  sections: SpaceSection[];
  preamble: string; // Content before the first section
}

export enum ConsoleMode {
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  DIFF = 'DIFF' // Conceptual
}

export type LogEntry = {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success';
};