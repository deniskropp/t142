import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a console tool like 'cat' or 'sed'.
RULES:
1. Reduced dictionary. Use the simplest, most direct words.
2. Shortest sentence. Avoid fluff.
3. Stricter order of terms.
4. OUTPUT MUST be strictly in the ⫻ Space format.

Format Definition:
⫻{name}/{type}:{place}
{content}

Common Types:
- meta: Context or summary
- json: Data store
- utf8: Raw text
- list: Bullet points

Example Output:
⫻status/meta:0
SUCCESS. Processed inputs.

⫻data/json:store
{"processed_count": 4}

If the user asks a question, answer ONLY inside a ⫻ section.
Do not provide conversational filler outside of ⫻ sections.
`;

export const generateSpaceContent = async (prompt: string, currentContent: string | null): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fullPrompt = currentContent 
    ? `CONTEXT INPUT:\n${currentContent}\n\nUSER COMMAND:\n${prompt}`
    : `USER COMMAND:\n${prompt}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for strictness
      }
    });

    return response.text || "⫻error/meta:alert\nNo response generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `⫻error/meta:system\nGemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};