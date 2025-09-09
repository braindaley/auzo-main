'use client';

import { useState, useEffect } from 'react';
import {
  createDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  BaseDocument,
} from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExampleItem extends BaseDocument {
  name: string;
  description: string;
}

export default function FirestoreExample() {
  const [items, setItems] = useState<ExampleItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const COLLECTION_NAME = 'example_items';

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const fetchedItems = await getDocuments<ExampleItem>(COLLECTION_NAME);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newItemName.trim() || !newItemDescription.trim()) return;

    setLoading(true);
    try {
      await createDocument(COLLECTION_NAME, {
        name: newItemName,
        description: newItemDescription,
      });
      setNewItemName('');
      setNewItemDescription('');
      await loadItems();
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editDescription.trim()) return;

    setLoading(true);
    try {
      await updateDocument(COLLECTION_NAME, id, {
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      await loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      await deleteDocument(COLLECTION_NAME, id);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: ExampleItem) => {
    setEditingId(item.id!);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Firestore Example - CRUD Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Item description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleCreate} disabled={loading}>
                Add Item
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Items List</h3>
              {loading && <p>Loading...</p>}
              {!loading && items.length === 0 && (
                <p className="text-gray-500">No items yet. Create your first item above!</p>
              )}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    {editingId === item.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={loading}
                        />
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          disabled={loading}
                        />
                        <Button
                          onClick={() => handleUpdate(item.id!)}
                          disabled={loading}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          disabled={loading}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(item)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id!)}
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}