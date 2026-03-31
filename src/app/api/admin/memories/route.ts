import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../login/route";
import { AdminActionPayload, AdminDeleteMemoryPayload } from "@/types";

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
  const filter = searchParams.get("filter");

  const supabase = getAdminClient();
  let query = supabase
    .from("memories")
    .select(`*, memory_tags ( tag_id, tags ( id, name, icon ) )`)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (filter === "pending") {
    query = query.eq("is_approved", false);
  } else if (filter === "approved") {
    query = query.eq("is_approved", true);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!verifySessionToken(req))
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();

  let body: AdminActionPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id } = body;
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  const { error } = await supabase
    .from("memories")
    .update({ is_approved: true })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!verifySessionToken(req))
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();

  let body: AdminDeleteMemoryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id, action } = body;
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  // Handle different actions: archive (default), delete_permanent, hide
  if (action === "delete_permanent") {
    // Get image URL before deleting
    const { data } = await supabase
      .from("memories")
      .select("image_url")
      .eq("id", id)
      .single();

    if (data?.image_url) {
      const path = data.image_url.split("/gallery/")[1];
      if (path) await supabase.storage.from("gallery").remove([path]);
    }

    // Delete memory tags first
    await supabase.from("memory_tags").delete().eq("memory_id", id);
    // Delete memory
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "hide") {
    const { error } = await supabase
      .from("memories")
      .update({ is_approved: false, is_archived: true })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Default: archive
  const { error } = await supabase
    .from("memories")
    .update({ is_archived: true })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!verifySessionToken(req))
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const supabase = getAdminClient();
  let body: { id: string; caption?: string; author_name?: string; tag_ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id, caption, author_name, tag_ids } = body;
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  // Update basic fields
  const updateData: Record<string, unknown> = {};
  if (caption !== undefined) updateData.caption = caption;
  if (author_name !== undefined) updateData.author_name = author_name;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("memories")
      .update(updateData)
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update tags if provided
  if (tag_ids !== undefined) {
    // Delete existing tags
    await supabase.from("memory_tags").delete().eq("memory_id", id);
    // Insert new tags
    if (tag_ids.length > 0) {
      const tagLinks = tag_ids.map((tag_id: string) => ({
        memory_id: id,
        tag_id,
      }));
      await supabase.from("memory_tags").insert(tagLinks);
    }
  }

  return NextResponse.json({ success: true });
}
