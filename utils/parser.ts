import { SpaceSection, ParseResult } from '../types';

// Regex to match header: ⫻name/type:place
// ⫻ is the anchor.
// name: required
// /type: optional
// :place: optional
const HEADER_REGEX = /^⫻([a-zA-Z0-9_\-]+)(?:\/([a-zA-Z0-9_\-]+))?(?::([a-zA-Z0-9_\-]+))?$/;

export const parseSpaceFormat = (text: string): ParseResult => {
  const lines = text.split('\n');
  const sections: SpaceSection[] = [];
  let preambleLines: string[] = [];
  
  let currentSection: Partial<SpaceSection> | null = null;
  let currentContentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts with ⫻
    if (line.startsWith('⫻')) {
      // If we were building a section, save it
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentContentLines.join('\n').trim(),
        } as SpaceSection);
      } else if (currentContentLines.length > 0) {
        // If we hadn't started a section yet, it's preamble
        preambleLines = [...currentContentLines];
      }

      // Reset for new section
      currentContentLines = [];
      
      const headerContent = line.trim();
      const match = headerContent.match(HEADER_REGEX);
      
      if (match) {
        // Valid header
        currentSection = {
          id: `sec-${Date.now()}-${i}`, // Simple ID
          rawHeader: headerContent,
          name: match[1] || 'unknown',
          type: match[2] || 'std',
          place: match[3] || '0',
        };
      } else {
        // Invalid header format, treat as malformed section or text
        // For strictness, we might treat it as a section with errors, 
        // but here we force a fallback structure.
        currentSection = {
            id: `sec-err-${Date.now()}-${i}`,
            rawHeader: headerContent,
            name: 'parse-error',
            type: 'raw',
            place: 'err',
        };
      }
    } else {
      // Content line
      currentContentLines.push(line);
    }
  }

  // Push the final section
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentContentLines.join('\n').trim(),
    } as SpaceSection);
  } else if (currentContentLines.length > 0) {
     preambleLines = [...preambleLines, ...currentContentLines];
  }

  return {
    preamble: preambleLines.join('\n').trim(),
    sections,
  };
};

export const formatSpaceString = (sections: SpaceSection[]): string => {
    return sections.map(s => `${s.rawHeader}\n${s.content}`).join('\n\n');
};