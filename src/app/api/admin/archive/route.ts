import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../login/route";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  if (!verifySessionToken(req))
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const supabase = getAdminClient();

  if (type === "memories") {
    const { data, error } = await supabase
      .from("memories")
      .select(`*, memory_tags ( tag_id, tags ( id, name, icon ) )`)
      .eq("is_archived", true)
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (type === "stories") {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("is_archived", true)
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Tipo non valido" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  if (!verifySessionToken(req))
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();
  let body: { id: string; type: "memory" | "story"; action: "restore" | "delete" };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id, action } = body;
  // Try to determine type from the id by checking both tables
  let type = body.type;
  
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });
  
  // If type not provided, try to determine it
  if (!type) {
    const { data: memory } = await supabase.from("memories").select("id").eq("id", id).single();
    if (memory) type = "memory";
    else {
      const { data: story } = await supabase.from("stories").select("id").eq("id", id).single();
      if (story) type = "story";
    }
  }
  
  if (!type) return NextResponse.json({ error: "Tipo non trovato" }, { status: 400 });

  const table = type === "memory" ? "memories" : "stories";

  if (action === "restore") {
    const { error } = await supabase
      .from(table)
      .update({ is_archived: false, is_approved: false })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "delete") {
    if (type === "memory") {
      const { data } = await supabase
        .from("memories")
        .select("image_url")
        .eq("id", id)
        .single();

      if (data?.image_url) {
        const path = data.image_url.split("/gallery/")[1];
        if (path) await supabase.storage.from("gallery").remove([path]);
      }
    }

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Azione non valida" }, { status: 400 });
}
