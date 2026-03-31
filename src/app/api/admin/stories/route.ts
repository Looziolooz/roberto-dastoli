import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../login/route";
import { AdminActionPayload } from "@/types";

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
    .from("stories")
    .select("*, story_tags ( tag_id, tags ( id, name, icon ) )")
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
    .from("stories")
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

  let body: { id: string; action?: "archive" | "delete_permanent" | "hide" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id, action } = body;
  if (!id) return NextResponse.json({ error: "id mancante" }, { status: 400 });

  if (action === "delete_permanent") {
    // Delete story tags first
    await supabase.from("story_tags").delete().eq("story_id", id);
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "hide") {
    const { error } = await supabase
      .from("stories")
      .update({ is_approved: false, is_archived: true })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Default: archive
  const { error } = await supabase
    .from("stories")
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
  let body: { id: string; title?: string; body?: string; author_name?: string; is_anonymous?: boolean; tag_ids?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { id, title, body: storyBody, author_name, is_anonymous, tag_ids } = body;
  if (!id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (storyBody !== undefined) updateData.body = storyBody;
  if (author_name !== undefined) updateData.author_name = author_name;
  if (is_anonymous !== undefined) updateData.is_anonymous = is_anonymous;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("stories")
      .update(updateData)
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (tag_ids !== undefined) {
    await supabase.from("story_tags").delete().eq("story_id", id);
    if (tag_ids.length > 0) {
      const tagLinks = tag_ids.map((tag_id: string) => ({
        story_id: id,
        tag_id,
      }));
      await supabase.from("story_tags").insert(tagLinks);
    }
  }

  return NextResponse.json({ success: true });
}
