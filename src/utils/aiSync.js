/**
 * OpenRouter AI Sync Utility
 * Model: nvidia/nemotron-3-ultra-550b-a55b:free
 * Focus: English Translation Accuracy & Natural Phrasing Correction
 */

export async function evaluatePhrasesWithAI(phrases, apiKey = '') {
  if (!phrases || phrases.length === 0) {
    return { success: true, results: [] };
  }

  // Use provided key or check import.meta.env
  const key = apiKey || import.meta.env.PUBLIC_OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY || '';

  const prompt = `You are a bilingual Indonesian-to-English translation evaluator.
Your primary task is to evaluate the translation quality of the English expression (phrase_en) against the Indonesian source phrase (phrase_id).

Evaluation Instructions:
1. Verify if the English phrase accurately and naturally translates the meaning of the Indonesian expression.
2. Check for mistranslations, typos, bad grammar, or unnatural phrasing in English.
3. If the English translation is accurate and natural, set isValid to true and feedback to null.
4. If there is a translation mistake, typo, or unnatural expression, set isValid to false and provide a concise correction note in English showing the accurate English translation.

Phrases to evaluate:
${JSON.stringify(phrases.map(p => ({ id: p.id, indonesian: p.phrase_id, english: p.phrase_en })), null, 2)}

Output ONLY a raw JSON object in this exact schema without any markdown formatting or code blocks:
{
  "results": [
    {
      "id": "phrase_id_str",
      "isValid": boolean,
      "feedback": "Concise correction note explaining the translation mistake and offering the correct English translation. Must be null if valid."
    }
  ]
}`;

  try {
    if (!key) {
      console.warn('OPENROUTER_API_KEY is not set. Running smart client evaluation fallback.');
      const fallbackResults = phrases.map(p => {
        const idText = (p.phrase_id || '').trim();
        const enText = (p.phrase_en || '').trim();
        let isValid = true;
        let feedback = null;

        if (idText.toLowerCase() === enText.toLowerCase() && idText.length > 2) {
          isValid = false;
          feedback = 'Translation mistake: Indonesian and English phrases are identical. Please provide an English translation.';
        } else if (enText.length < 2) {
          isValid = false;
          feedback = 'Translation mistake: English phrase is incomplete.';
        }

        return { id: p.id, isValid, feedback };
      });

      return { success: true, results: fallbackResults, isMock: true };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': 'https://phraseforge.local',
        'X-Title': 'PhraseForge',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        messages: [
          {
            role: 'system',
            content: 'You are an AI translation correction specialist. Evaluate English translations of Indonesian expressions and respond strictly in valid raw JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    
    // Clean response of markdown code fences if present
    const cleanedJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      success: true,
      results: parsed.results || [],
      isMock: false
    };
  } catch (error) {
    console.error('AI Sync translation evaluation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to AI Sync service'
    };
  }
}
