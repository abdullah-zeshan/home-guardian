import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
   
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `You are analyzing a home inspection report. 
Read it and list the important findings, sorted into three groups:
🔴 Fix/Investigate Now (safety hazards, active leaks, structural issues)
🟠 Plan Soon (aging systems, moderate issues)
🟢 Normal Maintenance (minor/cosmetic issues)

For each finding, explain it in one simple sentence a non-expert would understand.
Format your answer clearly with the three headings above.`;

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType: "application/pdf" } },
    prompt,
  ]);

  const text = result.response.text();

  return Response.json({ result: text });
}