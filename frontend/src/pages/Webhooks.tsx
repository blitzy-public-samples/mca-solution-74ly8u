import React, { useState, useEffect } from 'react';
import { WebhookManager } from '../components/WebhookManager';
import { getWebhooks, registerWebhook, updateWebhook, deleteWebhook } from '../services/api';

// HUMAN ASSISTANCE NEEDED
// The confidence level is below 0.8, so this code may need review and adjustments.
// Please check the implementation of the Webhooks component and ensure it meets all requirements.

const Webhooks: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const fetchedWebhooks = await getWebhooks();
        setWebhooks(fetchedWebhooks);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
        // TODO: Implement proper error handling
      }
    };

    fetchWebhooks();
  }, []);

  const handleRegisterWebhook = async (webhookData: any) => {
    try {
      const newWebhook = await registerWebhook(webhookData);
      setWebhooks([...webhooks, newWebhook]);
    } catch (error) {
      console.error('Error registering webhook:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleUpdateWebhook = async (id: string, webhookData: any) => {
    try {
      const updatedWebhook = await updateWebhook(id, webhookData);
      setWebhooks(webhooks.map(webhook => webhook.id === id ? updatedWebhook : webhook));
    } catch (error) {
      console.error('Error updating webhook:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteWebhook(id);
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    } catch (error) {
      console.error('Error deleting webhook:', error);
      // TODO: Implement proper error handling
    }
  };

  return (
    <div className="webhooks-page">
      <h1>Manage Webhooks</h1>
      <WebhookManager
        webhooks={webhooks}
        onRegister={handleRegisterWebhook}
        onUpdate={handleUpdateWebhook}
        onDelete={handleDeleteWebhook}
      />
    </div>
  );
};

export default Webhooks;