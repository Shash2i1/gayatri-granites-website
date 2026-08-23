import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useToastStore } from '../../store/toastStore';
import { MATERIAL_TYPES, PRICING_UNITS, STOCK_STATUS_STYLES } from '../../constants/productEnums';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ProductListSkeleton from '../../components/admin/ProductListSkeleton';

const EMPTY_FORM = {
  name: '',
  description: '',
  categoryId: '',
  materialType: MATERIAL_TYPES[0],
  origin: '',
  pricingUnit: PRICING_UNITS[0],
  basePrice: '',
  totalStockQuantity: '',
};

export default function ProductsPage() {
  const { products, loading, error, fetchProducts, createProduct, deactivateProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { showToast } = useToastStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.categoryId || !form.basePrice) {
      setFormError('Name, category, and base price are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await createProduct({
        ...form,
        categoryId: Number(form.categoryId),
        basePrice: Number(form.basePrice),
        totalStockQuantity: Number(form.totalStockQuantity) || 0,
      });
      showToast('Product created.', 'success');
      setModalOpen(false);
    } catch {
      setFormError('Could not save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id);
      showToast('Product deactivated.', 'success');
    } catch {
      showToast('Could not deactivate product.', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Products</h1>
        <Button variant="accent" onClick={openCreateModal} className="w-full sm:w-auto">
          + Add Product
        </Button>
      </div>

      {loading && <ProductListSkeleton />}
      {!loading && error && <p className="text-danger text-sm">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-muted text-sm">No products yet. Add your first one above.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* mobile: cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/admin/products/${p.id}`}
                className="bg-surface border border-border rounded-lg p-4 flex gap-3"
              >
                <div className="w-16 h-16 rounded-md bg-background shrink-0 overflow-hidden">
                  {p.images?.[0]?.imageUrl && (
                    <img src={p.images[0].imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted">{p.category?.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">₹{p.basePrice}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STOCK_STATUS_STYLES[p.stockStatus]}`}>
                      {p.stockStatus?.replace('_', ' ')}
                    </span>
                    {!p.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/10 text-muted">Inactive</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* desktop: table */}
          <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background/50">
                    <td className="px-6 py-3">
                      <Link to={`/admin/products/${p.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-background shrink-0 overflow-hidden">
                          {p.images?.[0]?.imageUrl && (
                            <img src={p.images[0].imageUrl} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium">{p.name}</span>
                        {!p.active && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/10 text-muted">Inactive</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted">{p.category?.name}</td>
                    <td className="px-6 py-3 font-medium">₹{p.basePrice}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STOCK_STATUS_STYLES[p.stockStatus]}`}>
                        {p.stockStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <Link to={`/admin/products/${p.id}`}>
                        <Button variant="outline">Manage</Button>
                      </Link>
                      {p.active && (
                        <Button variant="danger" onClick={() => handleDeactivate(p.id)}>
                          Deactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Product">
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Kashmir White Granite"
          />
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select
            label="Material Type"
            value={form.materialType}
            onChange={(e) => setForm({ ...form, materialType: e.target.value })}
          >
            {MATERIAL_TYPES.map((m) => (
              <option key={m} value={m}>{m.replace('_', ' ')}</option>
            ))}
          </Select>
          <Select
            label="Pricing Unit"
            value={form.pricingUnit}
            onChange={(e) => setForm({ ...form, pricingUnit: e.target.value })}
          >
            {PRICING_UNITS.map((u) => (
              <option key={u} value={u}>{u.replace('PER_', 'Per ')}</option>
            ))}
          </Select>
          <Input
            label="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            placeholder="e.g. Rajasthan, India"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Base Price (₹)"
              type="number"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              value={form.totalStockQuantity}
              onChange={(e) => setForm({ ...form, totalStockQuantity: e.target.value })}
            />
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {formError && <p className="text-danger text-sm">{formError}</p>}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}