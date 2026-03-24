import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
  const body = await req.json();

  const { title, body: storyBody, author_name, is_anonymous } = body;

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      body: storyBody,
      author_name: is_anonymous ? "Anonimo" : (author_name || "Anonimo"),
      is_anonymous,
      is_approved: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}