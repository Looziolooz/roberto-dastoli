import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateStoryPayload } from "@/types";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  let body: CreateStoryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { title, body: storyBody, author_name, is_anonymous, tag_ids } = body;

  if (!title?.trim() || !storyBody?.trim()) {
    return NextResponse.json({ error: "Titolo e racconto sono obbligatori" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      body: storyBody,
      author_name: is_anonymous ? "Anonimo" : (author_name || "Anonimo"),
      is_anonymous: !!is_anonymous,
      is_approved: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (tag_ids && tag_ids.length > 0) {
    const tagLinks = tag_ids.map((tag_id: string) => ({
      story_id: data.id,
      tag_id,
    }));
    await supabase.from("story_tags").insert(tagLinks);
  }

  return NextResponse.json(data, { status: 201 });
}
