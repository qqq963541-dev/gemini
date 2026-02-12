
import { GoogleGenAI, Type } from "@google/genai";
import { POET_PROFILES } from "../constants";
import { PoetId, GrammarCorrection, Message, ReportData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 检测是否为英文（包含基本标点）
const isEnglish = (text: string) => {
  const englishPattern = /^[A-Za-z0-9\s\.,\?!'"]+$/;
  // 简单逻辑：如果超过一半的字符是英文/空格，则认为是英文
  const letters = text.replace(/[^a-zA-Z]/g, "").length;
  return letters > text.length * 0.4;
};

const GRAMMAR_CHECK_PROMPT = `
你是一位资深的初高中英语教师。请分析学生（即用户）输入的英文句子。
如果句子中存在明显的语法错误，请给出纠正。

要求：
1. 必须使用【简体中文】给出错误原因的解释。
2. 如果句子没有明显错误，请回复 [NO_ERROR]。

如果发现错误，请严格按照以下格式返回：
[GRAMMAR_ERROR]
Original: {学生的原句}
Corrected: {纠正后的句子}
Explanation: {使用简体中文的详细解释}
ErrorType: {错误类型}
[/GRAMMAR_ERROR]
`;

const generatePoetPrompt = (poetId: PoetId, userText: string) => {
  const profile = POET_PROFILES[poetId];
  const userLangIsEnglish = isEnglish(userText);
  
  return `
    ${profile.systemPrompt}
    
    LANGUAGE RULES:
    1. If the user's input is in Chinese, you MUST respond in Chinese.
    2. If the user's input is in English, you MUST respond in English.
    3. Current input language detected as: ${userLangIsEnglish ? 'English' : 'Chinese'}.
    
    CRITICAL CHARACTER RULES:
    1. Stay in character as ${profile.nameCN}. 
    2. Reference your life and style.
    3. If user input has grammar error (marked in history), mention it gently.
  `;
};

export const checkGrammar = async (text: string): Promise<GrammarCorrection | null> => {
  // 仅在输入为英文时进行纠错
  if (!isEnglish(text)) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: GRAMMAR_CHECK_PROMPT,
        temperature: 0.1,
      },
    });

    const result = response.text || "";
    if (result.includes("[GRAMMAR_ERROR]")) {
      const original = result.match(/Original: (.*)/)?.[1] || text;
      const corrected = result.match(/Corrected: (.*)/)?.[1] || "";
      const explanation = result.match(/Explanation: (.*)/)?.[1] || "";
      const errorType = result.match(/ErrorType: (.*)/)?.[1] || "语法错误";
      return { original, corrected, explanation, errorType };
    }
    return null;
  } catch (error) {
    console.error("Grammar check error:", error);
    return null;
  }
};

export const generatePoetResponse = async (
  poetId: PoetId, 
  history: { role: string, parts: { text: string }[] }[]
): Promise<string> => {
  const lastUserText = history[history.length - 1].parts[0].text;
  const systemPrompt = generatePoetPrompt(poetId, lastUserText);

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: history.slice(0, -1).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: lastUserText });
    return result.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am slightly lost in my thoughts... Can you say that again?";
  }
};

export const translateToClassical = async (text: string, poetId: PoetId): Promise<{ classical: string, modern: string }> => {
  const profile = POET_PROFILES[poetId];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `将以下内容翻译为简体中文的文言文和现代文。如果是西方作家，文言文应采用类似其时代风格或具有古风特色的汉语表达。
      内容: "${text}"
      要求: 
      1. 两个版本必须全部使用【简体中文】。
      返回 JSON: {"classical": "文言/古风内容", "modern": "现代文内容"}`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{"classical": "", "modern": ""}');
  } catch (e) {
    return { classical: "转译未成", modern: "转译未成" };
  }
};

export const generateInterviewReport = async (messages: Message[], poetId: PoetId, brilliantSentences: Message[]): Promise<ReportData> => {
  const profile = POET_PROFILES[poetId];
  try {
    const transcript = messages.map(m => `${m.sender}: ${m.text}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this interview transcript with ${profile.nameCN}. 
      Extract 3 historical facts and 3 language learning notes (English or Chinese usage).
      Transcript: ${transcript}
      Return JSON: {"historicalFacts": ["..."], "englishNotes": ["..."]}`,
      config: { responseMimeType: "application/json" }
    });
    
    const data = JSON.parse(response.text || "{}");
    return {
      poetId,
      poetTheme: { main: profile.themeColor, secondary: profile.secondaryColor },
      starStats: { total: messages.filter(m => m.sender === 'user').length, average: 4.8 },
      historicalFacts: data.historicalFacts || [],
      englishNotes: data.englishNotes || [],
      dialogueHistory: messages,
      brilliantSentences: brilliantSentences
    };
  } catch (e) {
    return { poetId, poetTheme: { main: profile.themeColor, secondary: profile.secondaryColor }, starStats: { total: 0, average: 0 }, historicalFacts: [], englishNotes: [], dialogueHistory: messages, brilliantSentences };
  }
};
