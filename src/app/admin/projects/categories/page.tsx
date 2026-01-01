'use client';

import { useState, useEffect } from 'react';
import { getProjectCategories, addProjectCategory, updateProjectCategory, deleteProjectCategory } from '@/lib/actions/projects';
import { ProjectCategory } from '@/lib/types/database';
import { Plus, Trash2, Edit2, GripVertical, Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ProjectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        const data = await getProjectCategories(true);
        setCategories(data);
        setIsLoading(false);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const handleAdd = async () => {
        if (!formData.name) {
            toast.error('Please enter a category name');
            return;
        }

        const result = await addProjectCategory({
            name: formData.name,
            slug: formData.slug || generateSlug(formData.name),
            display_order: categories.length,
            is_active: true,
        });

        if (result.success) {
            toast.success('Category added!');
            setIsAddingNew(false);
            setFormData({ name: '', slug: '' });
            loadCategories();
        } else {
            toast.error('Failed to add category');
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !formData.name) return;

        const result = await updateProjectCategory(editingId, {
            name: formData.name,
            slug: formData.slug,
        });

        if (result.success) {
            toast.success('Category updated!');
            setEditingId(null);
            setFormData({ name: '', slug: '' });
            loadCategories();
        } else {
            toast.error('Failed to update category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Projects in this category will become uncategorized.')) return;

        const result = await deleteProjectCategory(id);
        if (result.success) {
            toast.success('Category deleted!');
            loadCategories();
        } else {
            toast.error('Failed to delete category');
        }
    };

    const startEdit = (category: ProjectCategory) => {
        setEditingId(category.id);
        setFormData({ name: category.name, slug: category.slug });
        setIsAddingNew(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({ name: '', slug: '' });
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Project Categories</h1>
                    <p className="page-description">Manage categories for organizing your projects.</p>
                </div>
                {!isAddingNew && !editingId && (
                    <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                        <Plus size={18} />
                        Add Category
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <button className="btn btn-ghost btn-icon" onClick={cancelEdit}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Category Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                        slug: prev.slug || generateSlug(e.target.value)
                                    }));
                                }}
                                placeholder="e.g., Apartments"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">URL Slug</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g., apartments"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={editingId ? handleUpdate : handleAdd}
                            disabled={!formData.name}
                        >
                            <Save size={18} />
                            {editingId ? 'Update' : 'Add'} Category
                        </button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="admin-card">
                {isLoading ? (
                    <div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '12px', borderRadius: '8px' }} />
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <div>
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    background: 'var(--admin-bg)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '8px',
                                    marginBottom: '12px'
                                }}
                            >
                                <GripVertical size={18} style={{ color: 'var(--admin-text-muted)', cursor: 'grab' }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)' }}>{category.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>/{category.slug}</span>
                                </div>
                                <span className={`badge ${category.is_active ? 'badge-success' : 'badge-default'}`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button className="btn btn-ghost btn-icon" onClick={() => startEdit(category)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="btn btn-ghost btn-icon" style={{ color: 'var(--admin-error)' }} onClick={() => handleDelete(category.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No categories</h3>
                        <p className="empty-state-description">Add your first category to organize your projects.</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
