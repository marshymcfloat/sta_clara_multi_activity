"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  createTaskSchema,
  CreateTaskTypes,
  updateTaskSchema,
  UpdateTaskTypes,
} from "../zod schemas/taskSchemas";

export async function createTaskAction(types: CreateTaskTypes) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const validationResult = createTaskSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Invalid input",
      };
    }

    const { title, description } = validationResult.data;

    const { error } = await supabase
      .from("Task")
      .insert({ title, description, created_by: user.id });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create task",
      };
    }

    return { success: true, message: "Task created successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteTaskAction(taskId: number) {
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
      .from("Task")
      .delete()
      .eq("id", +taskId)
      .eq("created_by", user.id);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete task",
      };
    }

    return { success: true, message: "Task deleted successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateTaskAction(types: UpdateTaskTypes, taskId: number) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: userError?.message || "Login first" };
    }

    const validationResult = updateTaskSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Invalid input",
      };
    }

    const { title, description } = validationResult.data;

    const { error: updateError } = await supabase
      .from("Task")
      .update({ title, description })
      .eq("id", +taskId)
      .eq("created_by", user.id);

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to update task",
      };
    }
    return { success: true, message: "Task updated successfully" };
  } catch (err) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
