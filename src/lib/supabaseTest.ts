import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  try {
    // 尝试获取一条 breeds 记录来测试连接
    const { data, error } = await supabase
      .from("breeds")
      .select("name")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("Supabase connection successful:", data);
    return true;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
}
