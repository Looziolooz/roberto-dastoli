import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("memories")
    .select(`
      *,
      memory_tags (
        tag_id,
        tags ( id, name, icon )
      )
    `)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const { caption, author_name, image_url, tag_ids } = body;

  const { data: memory, error: memError } = await supabase
    .from("memories")
    .insert({ caption, author_name, image_url, is_approved: false })
    .select()
    .single();

  if (memError) return NextResponse.json({ error: memError.message }, { status: 500 });

  if (tag_ids && tag_ids.length > 0) {
    const tagLinks = tag_ids.map((tag_id: string) => ({
      memory_id: memory.id,
      tag_id,
    }));

    await supabase.from("memory_tags").insert(tagLinks);
  }

  return NextResponse.json(memory, { status: 201 });
}