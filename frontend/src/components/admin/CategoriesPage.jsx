import { useEffect, useState } from 'react';
import { useCategoryStore } from '../../store/categoryStore';
import { useConfirmStore } from '../../store/confirmStore';
import { useToastStore } from '../../store/toastStore';
import { slugify } from '../../utils/slug';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import CategoryListSkeleton from '../../components/admin/CategoryListSkeleton';

const EMPTY_FORM = { name: '', slug: '', description: '' };

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryStore();
  const { confirm } = useConfirmStore();
  const { showToast } = useToastStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, slug: category.slug ?? '', description: category.description ?? '' });
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (name) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        showToast('Category updated.', 'success');
      } else {
        await createCategory(form);
        showToast('Category created.', 'success');
      }
      setModalOpen(false);
    } catch {
      setFormError('Could not save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete category?',
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      showToast('Category deleted.', 'success');
    } catch {
      showToast('Could not delete category. It may still have products linked to it.', 'error');
    }
  };

  return (
  <div className="flex flex-col h-full min-h-0">
    {/* Fixed Header */}
    <div className="sticky top-0 z-20 bg-background py-3 -mt-3 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <h1 className="text-xl md:text-2xl font-bold">
    Categories
  </h1>

  <Button
    variant="accent"
    onClick={openCreateModal}
    className="w-full sm:w-auto"
  >
    + Add Category
  </Button>
</div>

    {/* Scrollable Content */}
    <div className="flex-1 min-h-0 overflow-y-auto pr-1">
      {loading && <CategoryListSkeleton />}

      {!loading && error && (
        <p className="text-danger text-sm">{error}</p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="text-muted text-sm">
          No categories yet. Add your first one above.
        </p>
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          {/* Mobile */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-surface border border-border rounded-lg p-4"
              >
                <div className="font-semibold">{c.name}</div>

                <div className="text-xs text-muted mt-0.5">
                  {c.slug}
                </div>

                {c.description && (
                  <p className="text-sm text-muted mt-2">
                    {c.description}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEditModal(c)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium">
                    Description
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-background/50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {c.name}
                    </td>

                    <td className="px-6 py-4 text-muted">
                      {c.slug}
                    </td>

                    <td className="px-6 py-4 text-muted max-w-xs truncate">
                      {c.description}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(c)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>

    {/* Modal remains outside scrollable area */}
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title={editingId ? 'Edit Category' : 'Add Category'}
    >
      <div className="space-y-4">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Granite"
        />

        <Input
          label="Slug (auto-generated)"
          value={form.slug}
          readOnly
          className="bg-background text-muted cursor-not-allowed"
        />

        <Input
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Optional"
        />

        {formError && (
          <p className="text-danger text-sm">{formError}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="accent"
            className="flex-1"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
);
}