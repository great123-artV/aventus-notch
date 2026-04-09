import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSiteConfigs() {
  return useQuery({
    queryKey: ["site-configs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_configs" as any).select("*");
      if (error) throw error;
      const configs: Record<string, string> = {};
      data.forEach((item: any) => {
        configs[item.id] = item.value;
      });
      return configs;
    },
  });
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from("site_configs" as any)
        .upsert({ id, value, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-configs"] });
      toast.success("Site configuration updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update configuration");
    },
  });
}
