import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Subject } from "../types";

const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  imageData?: string
): Promise<string> => {
  if (!ai) return "کلید API تنظیم نشده است.";

  try {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `
      تو «درس‌یار» هستی، یک دستیار هوشمند، مهربان و باهوش برای آرتا کلبادی نژاد، دانش‌آموز کلاس هفتم (۱۳ ساله).
      
      ویژگی‌های تو:
      ۱. زبان تو کاملاً فارسی، صمیمی و ساده است.
      ۲. در مورد درس‌های پایه هفتم (ریاضی، علوم، فارسی، عربی و...) تسلط کامل داری.
      ۳. می‌توانی در حل تمرین‌ها کمک کنی.
      ۴. پاسخ‌هایت کوتاه، جذاب و با ایموجی باشد.
    `;

    let parts: any[] = [{ text: newMessage }];
    
    if (imageData) {
       const base64Data = imageData.split(',')[1];
       parts = [
         {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
         },
         { text: newMessage }
       ];
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "متاسفانه نتوانستم پاسخی تولید کنم.";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "مشکلی در ارتباط با هوش مصنوعی پیش آمد. لطفاً دوباره تلاش کن.";
  }
};

export const generateLessonContent = async (subject: Subject, topic: string): Promise<any> => {
  if (!ai) return null;

  try {
    const prompt = `
      به عنوان معلم خصوصی پایه هفتم برای درس «${subject}» و مبحث یا صفحه: «${topic}».
      
      اگر کاربر شماره صفحه را وارد کرده (مثلاً صفحه ۷۷)، دقیقاً تمامی سوالات، تمرین‌ها و فعالیت‌های موجود در آن صفحه از کتاب درسی رسمی پایه هفتم ایران را استخراج کن و پاسخ کامل تشریحی بده.
      
      خروجی باید JSON باشد:
      {
        "summary": "توضیح کوتاه درس",
        "keyPoints": ["نکته ۱", "نکته ۲"],
        "practiceQuestion": "سوالات موجود در کتاب یا تمرین مشابه",
        "answer": "پاسخ تشریحی کامل سوالات"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            practiceQuestion: { type: Type.STRING, description: "All questions from the book page or topic" },
            answer: { type: Type.STRING, description: "Detailed answers to the questions" },
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const generatePamphlet = async (subject: Subject, range: string): Promise<any> => {
  if (!ai) return null;

  try {
    const prompt = `
      یک جزوه کامل و جامع درسی برای دانش‌آموز پایه هفتم (آرتا کلبادی نژاد) بنویس.
      درس: ${subject}
      محدوده (فصل یا صفحات): ${range}
      
      این جزوه باید بسیار کامل باشد و شامل موارد زیر باشد:
      1. عنوان و موضوع اصلی
      2. خلاصه درس (ساده و روان)
      3. سوالات مهم امتحانی به همراه پاسخ
      4. نکات کلیدی و کنکوری/تیزهوشان
      5. تمرین برای خودآزمایی
      
      خروجی JSON باشد.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            questionsAndAnswers: { 
              type: Type.ARRAY, 
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                }
              }
            },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            examPractice: { type: Type.STRING },
            importantPages: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return null;
  }
};