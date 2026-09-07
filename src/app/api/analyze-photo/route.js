import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompts = {
  geyser: `You are looking at a photo of a home geyser (water heater) in Pakistan, possibly showing its nameplate/label.

Based on what you can see, answer these three questions as best you can. If something isn't visible or you're not sure, say "Not sure" for that field.

Respond ONLY in this exact JSON format, nothing else, no markdown, no extra text:

{
  "type": "Gas" or "Electric" or "Solar" or "Hybrid" or "Not sure",
  "age": "Under 2 years" or "2-5 years" or "5-10 years" or "10+ years" or "Not sure",
  "issues": "a short sentence describing any visible issues (rust, damage, leaks), or empty string if none visible"
}`,

  backup: `You are looking at a photo of a home backup power system in Pakistan (a UPS unit, a generator, or solar panels/inverter).

Based on what you can see, answer these two questions as best you can. If something isn't visible or you're not sure, say "Not sure" for that field.

Respond ONLY in this exact JSON format, nothing else, no markdown, no extra text:

{
  "type": "UPS" or "Generator" or "Solar" or "Multiple" or "Not sure",
  "condition": "Good" or "Needs repair" or "Not working" or "Not sure"
}`,
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const category = formData.get("category") || "geyser";

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType: file.type } },
    prompts[category],
  ]);

  const text = result.response.text();

  return Response.json({ result: text });
}