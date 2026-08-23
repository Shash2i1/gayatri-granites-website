import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as productsApi from '../../api/products';
import { useToastStore } from '../../store/toastStore';
import { useConfirmStore } from '../../store/confirmStore';
import { FINISHES } from '../../constants/productEnums';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Skeleton from '../../components/common/Skeleton';

const EMPTY_VARIANT = { size: '', finish: FINISHES[0], thicknessMm: '', priceAdjustment: '', stockQuantity: '', sku: '' };

export default function ProductDetailPage() {
  const { id } = useParams();
  const { showToast } = useToastStore();
  const { confirm } = useConfirmStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [priceInput, setPriceInput] = useState('');
  const [discountInput, setDiscountInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [variantForm, setVariantForm] = useState(EMPTY_VARIANT);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.fetchProduct(id);
      setProduct(data);
      setPriceInput(data.basePrice);
      setDiscountInput(data.discountPrice ?? '');
      setStockInput(data.totalStockQuantity);
    } catch {
      showToast('Could not load product.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdatePrice = async () => {
    try {
      const updated = await productsApi.updatePrice(id, Number(priceInput));
      setProduct(updated);
      showToast('Price updated.', 'success');
    } catch {
      showToast('Could not update price.', 'error');
    }
  };

  const handleUpdateDiscount = async () => {
    try {
      const updated = await productsApi.updateDiscount(id, discountInput === '' ? null : Number(discountInput));
      setProduct(updated);
      showToast('Discount updated.', 'success');
    } catch {
      showToast('Could not update discount.', 'error');
    }
  };

  const handleUpdateStock = async () => {
    try {
      const updated = await productsApi.updateStock(id, Number(stockInput));
      setProduct(updated);
      showToast('Stock updated.', 'success');
    } catch {
      showToast('Could not update stock.', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await productsApi.uploadProductImage(id, file, product.images.length === 0, product.images.length);
      showToast('Image uploaded.', 'success');
      await load();
    } catch {
      showToast('Could not upload image.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    const confirmed = await confirm({
      title: 'Delete image?',
      message: 'This will remove it permanently.',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;

    try {
      await productsApi.deleteProductImage(imageId);
      showToast('Image deleted.', 'success');
      await load();
    } catch {
      showToast('Could not delete image.', 'error');
    }
  };

  const handleAddVariant = async () => {
    if (!variantForm.size.trim() || !variantForm.sku.trim()) {
      showToast('Size and SKU are required.', 'error');
      return;
    }
    try {
      await productsApi.addVariant(id, {
        ...variantForm,
        thicknessMm: Number(variantForm.thicknessMm) || 0,
        priceAdjustment: Number(variantForm.priceAdjustment) || 0,
        stockQuantity: Number(variantForm.stockQuantity) || 0,
      });
      showToast('Variant added.', 'success');
      setVariantForm(EMPTY_VARIANT);
      await load();
    } catch {
      showToast('Could not add variant.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!product) return <p className="text-danger">Product not found.</p>;

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-muted hover:text-primary">
        ← Back to Products
      </Link>

      <h1 className="text-xl md:text-2xl font-bold mt-2">{product.name}</h1>
      <p className="text-sm text-muted">{product.category?.name}</p>

      {/* Images */}
      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-4">Images</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {product.images.map((img) => (
            <div key={img.id} className="relative w-24 h-24 rounded-md overflow-hidden border border-border">
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-accent text-primary text-[9px] px-1.5 py-0.5 rounded font-semibold">
                  Primary
                </span>
              )}
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label className="inline-block">
          <span className="sr-only">Upload image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
        </label>
        {uploading && <p className="text-xs text-muted mt-2">Uploading...</p>}
      </section>

      {/* Price / Discount / Stock */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Base Price</h3>
          <div className="flex gap-2">
            <Input type="number" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
            <Button variant="accent" onClick={handleUpdatePrice}>Save</Button>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Discount Price</h3>
          <div className="flex gap-2">
            <Input type="number" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} placeholder="None" />
            <Button variant="accent" onClick={handleUpdateDiscount}>Save</Button>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Stock Quantity</h3>
          <div className="flex gap-2">
            <Input type="number" value={stockInput} onChange={(e) => setStockInput(e.target.value)} />
            <Button variant="accent" onClick={handleUpdateStock}>Save</Button>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-4">Variants</h2>

        {product.variants.length > 0 && (
          <div className="space-y-2 mb-4">
            {product.variants.map((v) => (
              <div key={v.id} className="flex flex-wrap gap-x-4 gap-y-1 text-sm border-b border-border pb-2">
                <span className="font-medium">{v.size}</span>
                <span className="text-muted">{v.finish}</span>
                <span className="text-muted">{v.thicknessMm}mm</span>
                <span className="text-muted">SKU: {v.sku}</span>
                <span className="text-muted">Stock: {v.stockQuantity}</span>
                <span className="text-muted">+₹{v.priceAdjustment}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Input placeholder="Size" value={variantForm.size} onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })} />
          <Select value={variantForm.finish} onChange={(e) => setVariantForm({ ...variantForm, finish: e.target.value })}>
            {FINISHES.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
          <Input type="number" placeholder="Thickness (mm)" value={variantForm.thicknessMm} onChange={(e) => setVariantForm({ ...variantForm, thicknessMm: e.target.value })} />
          <Input type="number" placeholder="Price adj." value={variantForm.priceAdjustment} onChange={(e) => setVariantForm({ ...variantForm, priceAdjustment: e.target.value })} />
          <Input type="number" placeholder="Stock" value={variantForm.stockQuantity} onChange={(e) => setVariantForm({ ...variantForm, stockQuantity: e.target.value })} />
          <Input placeholder="SKU" value={variantForm.sku} onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })} />
        </div>
        <Button variant="accent" className="mt-3" onClick={handleAddVariant}>+ Add Variant</Button>
      </section>
    </div>
  );
}