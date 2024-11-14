import { useEffect } from "react";
import { testSupabaseConnection } from "@/lib/supabaseTest";

export default function YourComponent() {
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  // ... rest of your component
}
