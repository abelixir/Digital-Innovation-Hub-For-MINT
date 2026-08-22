import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import AppShell from "../../components/AppShell";
import { Loader2, Save } from "lucide-react";

const TYPES = [
  { value: "incubator", label: "Incubator" },
  { value: "accelerator", label: "Accelerator" },
  { value: "coworking", label: "Coworking / hub" },
  { value: "angel_network", label: "Angel network" },
  { value: "university", label: "University" },
  { value: "research", label: "Research center" },
  { value: "ngo", label: "NGO" },
  { value: "other", label: "Other" },
];

const empty = {
  organizationName: "",
  builderType: "incubator",
  description: "",
  location: "",
  website: "",
  licenseInfo: "",
  resources: {
    space: false,
    mentorship: false,
    fundingSupport: false,
    training: false,
    networking: false,
    other: "",
  },
};

export default function BuilderApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/ecosystem-builders/my");
        const b = res.data;
        setForm({
          organizationName: b.organizationName || "",
          builderType: b.builderType || "incubator",
          description: b.description || "",
          location: b.location || "",
          website: b.website || "",
          licenseInfo: b.licenseInfo || "",
          resources: {
            space: !!b.resources?.space,
            mentorship: !!b.resources?.mentorship,
            fundingSupport: !!b.resources?.fundingSupport,
            training: !!b.resources?.training,
            networking: !!b.resources?.networking,
            other: b.resources?.other || "",
          },
        });
        setIsUpdate(true);
      } catch {
        setIsUpdate(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setRes = (key, value) => {
    setForm((prev) => ({
      ...prev,
      resources: { ...prev.resources, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isUpdate) {
        await apiRequest("/ecosystem-builders/my", {
          method: "PUT",
          body: form,
        });
        toast("Application updated", "success");
      } else {
        await apiRequest("/ecosystem-builders", {
          method: "POST",
          body: form,
        });
        toast("Application submitted for MinT review", "success");
      }
      navigate("/builder");
    } catch (err) {
      toast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Application">
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={isUpdate ? "Edit application" : "Ecosystem builder application"}
      subtitle="MinT designation for support organizations"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Organization name *
          </label>
          <input
            required
            value={form.organizationName}
            onChange={(e) =>
              setForm({ ...form, organizationName: e.target.value })
            }
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type *
          </label>
          <select
            value={form.builderType}
            onChange={(e) => setForm({ ...form, builderType: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="What you do for startups…"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            License / registration info
          </label>
          <input
            value={form.licenseInfo}
            onChange={(e) => setForm({ ...form, licenseInfo: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Resources you offer
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              ["space", "Space"],
              ["mentorship", "Mentorship"],
              ["fundingSupport", "Funding support"],
              ["training", "Training"],
              ["networking", "Networking"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={!!form.resources[key]}
                  onChange={(e) => setRes(key, e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                {label}
              </label>
            ))}
          </div>
          <input
            value={form.resources.other}
            onChange={(e) => setRes("other", e.target.value)}
            placeholder="Other resources"
            className="mt-2 w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-xl"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isUpdate ? "Save changes" : "Submit for review"}
        </button>
      </form>
    </AppShell>
  );
}