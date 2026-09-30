import { supabase } from "@/lib/supabase";

export async function GET() {
  const { error } = await supabase
    .from("reports")
    .select("id")
    .limit(1);

  if (error) {
    return Response.json({ status: "error", message: error.message });
  }

  return Response.json({ status: "alive", time: new Date().toISOString() });
}