import { useState, useEffect } from "react";
import { useSiteConfigs, useUpdateSiteConfig } from "@/hooks/use-site-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Video, Info, BarChart3, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CMSManager() {
  const { data: configs, isLoading } = useSiteConfigs();
  const updateConfig = useUpdateSiteConfig();

  // Form states
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (configs) {
      setFormData(configs);
    }
  }, [configs]);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    try {
      await updateConfig.mutateAsync({ id, value: formData[id] || "" });
    } catch (err) {}
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage-video-${Math.random()}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      await updateConfig.mutateAsync({ id: "homepage_video_url", value: publicUrl });
      handleChange("homepage_video_url", publicUrl);
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

  const TextField = ({ id, label, isArea = false }: { id: string, label: string, isArea?: boolean }) => (
    <div className="space-y-2">
      <Label className="text-muted-foreground flex justify-between items-center">
        {label}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSave(id)}
          className="h-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80"
          disabled={updateConfig.isPending && updateConfig.variables?.id === id}
        >
          {updateConfig.isPending && updateConfig.variables?.id === id ? "Saving..." : "Save"}
        </Button>
      </Label>
      {isArea ? (
        <Textarea
          value={formData[id] || ""}
          onChange={e => handleChange(id, e.target.value)}
          className="bg-white/5 border-white/10 h-24 focus:border-primary/50"
        />
      ) : (
        <Input
          value={formData[id] || ""}
          onChange={e => handleChange(id, e.target.value)}
          className="bg-white/5 border-white/10 focus:border-primary/50"
        />
      )}
    </div>
  );

  return (
    <div className="glass p-6 rounded-2xl border-white/10">
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="hero" className="rounded-lg font-bold text-xs uppercase tracking-wider">Hero Section</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg font-bold text-xs uppercase tracking-wider">Stats & Trust</TabsTrigger>
          <TabsTrigger value="cta" className="rounded-lg font-bold text-xs uppercase tracking-wider">CTA & Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Main Content
              </h3>
              <TextField id="hero_title" label="Main Hero Title" />
              <TextField id="hero_subtitle" label="Hero Subtitle" isArea />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Background Video
              </h3>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 mb-4">
                <video src={formData.homepage_video_url} controls className="w-full h-full object-cover" />
              </div>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="v-up" />
              <Label htmlFor="v-up" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all font-bold">
                <Upload className="w-4 h-4 text-primary" />
                {uploading ? "Uploading..." : "Replace Homepage Video"}
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-profit" /> Key Stat 1</h4>
              <TextField id="stat_1_val" label="Value (e.g. 2.4B+)" />
              <TextField id="stat_1_label" label="Label" />
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-profit" /> Key Stat 2</h4>
              <TextField id="stat_2_val" label="Value" />
              <TextField id="stat_2_label" label="Label" />
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <h4 className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Security Tag</h4>
              <TextField id="trust_tagline" label="Trust Tagline" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cta" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display">Bottom CTA Section</h3>
            <TextField id="cta_title" label="CTA Heading" />
            <TextField id="cta_desc" label="CTA Description" isArea />
          </div>
          <div className="pt-6 border-t border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-display">Footer Settings</h3>
            <TextField id="footer_desc" label="Footer Brief" isArea />
            <TextField id="copyright_text" label="Copyright Text" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
