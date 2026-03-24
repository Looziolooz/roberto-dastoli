import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAuth(req: NextRequest) {
  const session = req.cookies.get("admin_session");
  return session?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("memories")
    .select(`*, memory_tags ( tag_id, tags ( id, name, icon ) )`)
    .eq("is_approved", false)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();
  const { id } = await req.json();

  const { error } = await supabase
    .from("memories")
    .update({ is_approved: true })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();
  const { id, image_url } = await req.json();

  if (image_url) {
    const path = image_url.split("/gallery/")[1];
    if (path) await supabase.storage.from("gallery").remove([path]);
  }

  const { error } = await supabase.from("memories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}