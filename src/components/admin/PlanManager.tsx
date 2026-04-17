import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Check, X, Flame } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  invest_amount: number;
  earn_amount: number;
  is_hot: boolean;
  duration_hours: number;
}

export function PlanManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Plan>>({});
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    invest_amount: 0,
    earn_amount: 0,
    is_hot: false,
    duration_hours: 48
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("investment_plans")
      .select("*")
      .order("invest_amount", { ascending: true });

    if (!error && data) {
      setPlans(data);
    }
    setLoading(false);
  };

  const handleAddPlan = async () => {
    const { error } = await supabase.from("investment_plans").insert(newPlan);
    if (error) {
      toast.error("Failed to add plan");
    } else {
      toast.success("Plan added successfully");
      setNewPlan({ invest_amount: 0, earn_amount: 0, is_hot: false, duration_hours: 48 });
      fetchPlans();
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    const { error } = await supabase.from("investment_plans").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete plan");
    } else {
      toast.success("Plan deleted");
      fetchPlans();
    }
  };

  const startEditing = (plan: Plan) => {
    setEditingId(plan.id);
    setEditValues(plan);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("investment_plans").update(editValues).eq("id", editingId);
    if (error) {
      toast.error("Failed to update plan");
    } else {
      toast.success("Plan updated");
      setEditingId(null);
      fetchPlans();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl border-white/10">
        <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add New Investment Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase font-bold">Invest Amount ($)</label>
            <Input
              type="number"
              value={newPlan.invest_amount}
              onChange={e => setNewPlan({...newPlan, invest_amount: Number(e.target.value)})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase font-bold">Earn Amount ($)</label>
            <Input
              type="number"
              value={newPlan.earn_amount}
              onChange={e => setNewPlan({...newPlan, earn_amount: Number(e.target.value)})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase font-bold">Duration (Hours)</label>
            <Input
              type="number"
              value={newPlan.duration_hours}
              onChange={e => setNewPlan({...newPlan, duration_hours: Number(e.target.value)})}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="flex items-center gap-2 pb-3">
            <input
              type="checkbox"
              id="is_hot"
              checked={newPlan.is_hot}
              onChange={e => setNewPlan({...newPlan, is_hot: e.target.checked})}
              className="w-4 h-4 rounded bg-white/5 border-white/10 accent-primary"
            />
            <label htmlFor="is_hot" className="text-sm font-bold cursor-pointer flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" /> Hot Badge
            </label>
          </div>
          <Button onClick={handleAddPlan} className="gradient-primary text-[#050505] font-bold">
            Create Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`glass p-6 rounded-2xl border-white/10 relative transition-all ${editingId === plan.id ? 'ring-2 ring-primary/50' : ''}`}>
            {editingId === plan.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase">Invest</label>
                    <Input
                      type="number"
                      value={editValues.invest_amount}
                      onChange={e => setEditValues({...editValues, invest_amount: Number(e.target.value)})}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase">Earn</label>
                    <Input
                      type="number"
                      value={editValues.earn_amount}
                      onChange={e => setEditValues({...editValues, earn_amount: Number(e.target.value)})}
                      className="h-8 text-sm text-profit font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase">Hours</label>
                    <Input
                      type="number"
                      value={editValues.duration_hours}
                      onChange={e => setEditValues({...editValues, duration_hours: Number(e.target.value)})}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      checked={editValues.is_hot}
                      onChange={e => setEditValues({...editValues, is_hot: e.target.checked})}
                    />
                    <span className="text-xs font-bold">Hot</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={saveEdit} className="flex-1 bg-profit/20 text-profit hover:bg-profit/30 border-0">
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" onClick={() => setEditingId(null)} variant="ghost" className="flex-1">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Invest</p>
                    <h4 className="text-2xl font-bold font-display">${plan.invest_amount.toLocaleString()}</h4>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(plan)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-loss transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Returns</p>
                    <p className="text-xl font-bold text-profit font-display">${plan.earn_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Duration</p>
                    <p className="text-sm font-bold text-yellow-500">{plan.duration_hours} Hours</p>
                  </div>
                </div>
                {plan.is_hot && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 rounded-md bg-orange-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg">
                    <Flame className="w-3 h-3" /> HOT
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
