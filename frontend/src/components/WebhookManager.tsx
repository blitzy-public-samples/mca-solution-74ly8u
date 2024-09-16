import React, { useState, useEffect } from 'react';
import { getWebhooks, registerWebhook, updateWebhook, deleteWebhook } from '../services/api';
import { validateUrl } from '../utils/validators';

// HUMAN ASSISTANCE NEEDED
// The following component needs further refinement and error handling for production readiness.
// Additional styling and user feedback mechanisms should be implemented.

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [editingWebhook, setEditingWebhook] = useState<any | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const fetchedWebhooks = await getWebhooks();
      setWebhooks(fetchedWebhooks);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(newWebhookUrl)) {
      alert('Invalid URL');
      return;
    }
    try {
      await registerWebhook(newWebhookUrl);
      setNewWebhookUrl('');
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to add webhook:', error);
    }
  };

  const handleEditWebhook = async (webhook: any) => {
    if (!validateUrl(webhook.url)) {
      alert('Invalid URL');
      return;
    }
    try {
      await updateWebhook(webhook.id, webhook.url);
      setEditingWebhook(null);
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to update webhook:', error);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      try {
        await deleteWebhook(id);
        fetchWebhooks();
      } catch (error) {
        console.error('Failed to delete webhook:', error);
      }
    }
  };

  // HUMAN ASSISTANCE NEEDED
  // Implement webhook testing feature

  return (
    <div className="webhook-manager">
      <h2>Webhook Manager</h2>
      
      <form onSubmit={handleAddWebhook}>
        <input
          type="text"
          value={newWebhookUrl}
          onChange={(e) => setNewWebhookUrl(e.target.value)}
          placeholder="Enter new webhook URL"
        />
        <button type="submit">Add Webhook</button>
      </form>

      <ul>
        {webhooks.map((webhook) => (
          <li key={webhook.id}>
            {editingWebhook?.id === webhook.id ? (
              <form onSubmit={() => handleEditWebhook(editingWebhook)}>
                <input
                  type="text"
                  value={editingWebhook.url}
                  onChange={(e) => setEditingWebhook({ ...editingWebhook, url: e.target.value })}
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingWebhook(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span>{webhook.url}</span>
                <button onClick={() => setEditingWebhook(webhook)}>Edit</button>
                <button onClick={() => handleDeleteWebhook(webhook.id)}>Delete</button>
                {/* HUMAN ASSISTANCE NEEDED: Add test webhook button */}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebhookManager;