import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vitlppxutxfoaacdtoml.supabase.co";

const supabaseKey =
  "sb_publishable_jM5q3WT9eTJqfA6n5Pav4w_OhET8VAW";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
