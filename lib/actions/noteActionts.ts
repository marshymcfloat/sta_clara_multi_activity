"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  createNoteSchema,
  CreateNoteTypes,
  updateNoteSchema,
  UpdateNoteTypes,
} from "../zod schemas/noteSchemas";

export async function createNoteAction(types: CreateNoteTypes) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const validationResult = createNoteSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Invalid input",
      };
    }

    const { title, content } = validationResult.data;

    const { error } = await supabase
      .from("Note")
      .insert({ title, content, created_by: user.id });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create note",
      };
    }

    return { success: true, message: "Note created successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteNoteAction(noteId: number) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const { error: deleteError } = await supabase
      .from("Note")
      .delete()
      .eq("id", +noteId)
      .eq("created_by", user.id);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete note",
      };
    }

    return { success: true, message: "Note deleted successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateNoteAction(types: UpdateNoteTypes, noteId: number) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const validationResult = updateNoteSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Invalid input",
      };
    }

    const { title, content } = validationResult.data;

    const updateData: Record<string, string> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const { error: updateError } = await supabase
      .from("Note")
      .update(updateData)
      .eq("id", +noteId)
      .eq("created_by", user.id);

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to update note",
      };
    }
    return { success: true, message: "Note updated successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

