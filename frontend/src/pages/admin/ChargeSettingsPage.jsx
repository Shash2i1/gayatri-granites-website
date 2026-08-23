import { useEffect, useState } from 'react';
import * as chargeSettingsApi from '../../api/chargeSettings';
import { useToastStore } from '../../store/toastStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Skeleton from '../../components/common/Skeleton';

export default function ChargeSettingsPage() {
  const { showToast } = useToastStore();

  const [form, setForm] = useState({ gstPercentage: '', sgstPercentage: '', shippingCharge: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    chargeSettingsApi
      .fetchChargeSettings()
      .then((data) => {
        setForm({
          gstPercentage: data.gstPercentage ?? '',
          sgstPercentage: data.sgstPercentage ?? '',
          shippingCharge: data.shippingCharge ?? '',
        });
        setLastUpdated(data.updatedAt);
      })
      .catch(() => showToast('Could not load charge settings.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await chargeSettingsApi.updateChargeSettings({
        gstPercentage: Number(form.gstPercentage) || 0,
        sgstPercentage: Number(form.sgstPercentage) || 0,
        shippingCharge: Number(form.shippingCharge) || 0,
      });
      setForm({
        gstPercentage: updated.gstPercentage,
        sgstPercentage: updated.sgstPercentage,
        shippingCharge: updated.shippingCharge,
      });
      setLastUpdated(updated.updatedAt);
      showToast('Charge settings updated.', 'success');
    } catch {
      showToast('Could not update charge settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-2">Charge Settings</h1>
      <p className="text-sm text-muted mb-6">
        These GST%, SGST%, and shipping charge values apply to every new order created at
        checkout. Existing orders already have their own frozen values and are not affected by
        changes made here.
      </p>

      <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
        <Input
          label="GST Percentage (%)"
          type="number"
          step="0.01"
          value={form.gstPercentage}
          onChange={(e) => setForm({ ...form, gstPercentage: e.target.value })}
          placeholder="e.g. 9"
        />
        <Input
          label="SGST Percentage (%)"
          type="number"
          step="0.01"
          value={form.sgstPercentage}
          onChange={(e) => setForm({ ...form, sgstPercentage: e.target.value })}
          placeholder="e.g. 9"
        />
        <Input
          label="Shipping Charge (₹)"
          type="number"
          step="0.01"
          value={form.shippingCharge}
          onChange={(e) => setForm({ ...form, shippingCharge: e.target.value })}
          placeholder="e.g. 500"
        />

        <Button variant="accent" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>

        {lastUpdated && (
          <p className="text-xs text-muted text-center">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}