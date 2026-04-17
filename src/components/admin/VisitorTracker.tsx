import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Globe, MapPin, Navigation, User, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Visitor {
  id: string;
  user_id: string | null;
  page_path: string | null;
  user_agent: string | null;
  visited_at: string;
  country: string | null;
  city: string | null;
  ip_address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function VisitorTracker() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
    const subscription = supabase
      .channel('visitor_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'visitor_logs' }, payload => {
        setVisitors(prev => [payload.new as Visitor, ...prev].slice(0, 100));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchVisitors = async () => {
    const { data, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(100);

    if (data) setVisitors(data as unknown as Visitor[]);
    setLoading(false);
  };

  const filteredVisitors = visitors.filter(v =>
    (v.city?.toLowerCase().includes(search.toLowerCase())) ||
    (v.country?.toLowerCase().includes(search.toLowerCase())) ||
    (v.page_path?.toLowerCase().includes(search.toLowerCase()))
  );

  const locations = filteredVisitors
    .filter(v => v.latitude && v.longitude)
    .map(v => ({
      id: v.id,
      position: [Number(v.latitude), Number(v.longitude)] as [number, number],
      city: v.city,
      country: v.country,
      user: v.user_id ? `User ${v.user_id.slice(0, 8)}` : "Guest"
    }));

  return (
    <div className="space-y-6">
      {/* Map View */}
      <div className="h-[400px] w-full rounded-3xl overflow-hidden glass border border-white/10 relative z-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          className="admin-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc, i) => (
            <Marker key={loc.id + i} position={loc.position}>
              <Popup>
                <div className="text-black">
                  <p className="font-bold">{loc.user}</p>
                  <p className="text-xs">{loc.city}, {loc.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-bold font-display flex items-center gap-2">
          <Globe className="w-6 h-6 text-profit" /> Real-time Global Activity
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location or page..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVisitors.map((visitor, idx) => (
          <motion.div
            key={visitor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-4 rounded-2xl border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {visitor.user_id ? `User ${visitor.user_id.slice(0,8)}` : "Guest"}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(visitor.visited_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-profit/10 text-profit text-[10px] font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-2 rounded-lg">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{visitor.page_path || "/"}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <MapPin className="w-3.5 h-3.5 text-loss" />
                <span className="font-medium">
                  {visitor.city || "Unknown City"}, {visitor.country || "Unknown Country"}
                </span>
              </div>

              {visitor.ip_address && (
                <p className="text-[9px] text-muted-foreground/50 font-mono text-center">
                  IP: {visitor.ip_address}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVisitors.length === 0 && !loading && (
        <div className="text-center py-20 glass rounded-3xl">
          <Globe className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">No active visitors matching your search</p>
        </div>
      )}
    </div>
  );
}
