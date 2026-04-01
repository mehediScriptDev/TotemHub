import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Monitor, Mail, Type } from 'lucide-react';
import { Input, Button } from '../../../Components/ui';
import { totemService } from '../../../services/totemService';
import { isValidEmail, isRequired } from '../../../utils/validators';
import toast from 'react-hot-toast';

const CreateTotemPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', partnerEmail: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!isRequired(formData.name?.trim())) {
      newErrors.name = 'Totem name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!isRequired(formData.partnerEmail?.trim())) {
      newErrors.partnerEmail = 'Partner email is required';
    } else if (!isValidEmail(formData.partnerEmail)) {
      newErrors.partnerEmail = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await totemService.create({
        name: formData.name.trim(),
        partnerEmail: formData.partnerEmail.trim(),
      });
      toast.success('Totem created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create totem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200
                   transition-colors mb-6 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Page Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-700/50 bg-gradient-to-r from-brand-600/8 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/10 border border-brand-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-100">Create New Totem</h1>
              <p className="text-sm text-surface-400">
                Set up a new digital signage device
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Totem Name"
            name="name"
            placeholder="e.g., Main Entrance Totem"
            icon={Type}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Partner Email"
            name="partnerEmail"
            type="email"
            placeholder="partner@company.com"
            icon={Mail}
            value={formData.partnerEmail}
            onChange={handleChange}
            error={errors.partnerEmail}
          />

          {/* Info Note */}
          <div className="p-4 rounded-xl bg-brand-600/8 border border-brand-500/15">
            <p className="text-xs text-surface-400 leading-relaxed">
              <span className="font-semibold text-brand-400">Note:</span> After creation,
              you can configure this totem's homepage products and upload videos from its
              management page.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} icon={Monitor}>
              Create Totem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTotemPage;
