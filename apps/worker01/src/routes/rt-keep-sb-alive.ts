import { Context } from "hono";
import { createClient } from "@supabase/supabase-js";

// You can define this Env interface in a shared types.ts file and import it
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const rtKeepSbAlive = async (
  c: Context<{ Bindings: Env }>
): Promise<Response> => {
  // 1. Create the Supabase client using environment variables from the context
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);

  // 2. Safely parse the JSON body using Hono's request helper
  let body: { message?: string } = {};
  try {
    body = await c.req.json();
  } catch (e) {
    // Body is optional, so we ignore errors if it's empty or invalid JSON.
  }

  const newRecord = {
    message:
      body.message ?? `Project heartbeat ping at ${new Date().toISOString()}`,
  };

  // 3. Perform the database insertion
  const { data: inserted, error: insertError } = await supabase
    .from("keep_alive_ping")
    .insert([newRecord])
    .select()
    .single();

  // 4. For errors, throw an exception. Hono's `onError` will catch it.
  if (insertError) {
    // This is much cleaner. The route handler doesn't need to know
    // how to format the error response.
    throw new Error(insertError.message);
  }

  // Fetch the latest records as before
  const { data: latest, error: fetchError } = await supabase
    .from("keep_alive_ping")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // 5. Use Hono's `.json()` helper for a clean, successful response.
  // It automatically sets the status to 200 and the content-type header.
  return c.json({
    inserted,
    latest,
  });
};
