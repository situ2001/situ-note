import {
  createClient,
  PostgrestError,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";

let supabase: SupabaseClient;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

export const getCount = async (slug: string) => {
  if (supabase === undefined) {
    return undefined;
  }

  const result: PostgrestSingleResponse<{ count: number }> = await supabase
    .from("views")
    .select("count")
    .match({ slug })
    .single();

  console.log(result);

  if (result.error?.code === "PGRST116") {
    // create a new row
    console.log("creating new row...");
    const { data, error }: PostgrestSingleResponse<{ count: number }> =
      await supabase.from("views").insert({ slug, count: 1 }).single();
    console.log("insert result", data);
    console.log("insert error", error);

    return data!.count;
  }

  return result.data!.count;
};

export const increaseCounter = async (slug: string) => {
  if (supabase === undefined) {
    return;
  }

  // RPC increment
  const { data, error } = await supabase.rpc("increment", { s: slug });
  console.log(data);
  console.error(error);
  return !(error === null);
};
