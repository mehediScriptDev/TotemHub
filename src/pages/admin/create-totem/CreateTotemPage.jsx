import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Search, AlertCircle, User, Layout } from 'lucide-react';
import { totemService } from '../../../services/totemService';
import { Button, Input, Spinner } from '../../../Components/ui';
import { toast } from 'react-hot-toast';

const CreateTotemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [partnerUser, setPartnerUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    partnerEmail: '',
  });

  const handleSearchPartner = async () => {
    if (!formData.partnerEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setSearching(true);
      setPartnerUser(null);
      const users = await totemService.searchUserByEmail(formData.partnerEmail);
      
      if (users && users.length > 0) {
        setPartnerUser(users[0]);
        toast.success(`Partner found: ${users[0].name || users[0].email}`);
      } else {
        toast.error('No partner found with this email');
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!partnerUser) {
      toast.error('Please search and verify a partner first');
      return;
    }

    try {
      setLoading(true);
      await totemService.create({
        id_store: partnerUser.id,
        name: formData.name.trim(),
      });
      toast.success('Totem created successfully!');
      setTimeout(() => navigate('/'), 200);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create totem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white rounded-lg border border-surface-200 text-surface-400 hover:text-surface-900 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-surface-900 tracking-tight">Create Totem</h1>
          <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest mt-1">Register new digital device</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-xl shadow-brand-500/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input
              label="Totem Name"
              placeholder="e.g. Main Entrance Totem"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={Layout}
              required
            />

            <div className="space-y-2">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="Partner Email"
                    placeholder="partner@example.com"
                    value={formData.partnerEmail}
                    onChange={(e) => setFormData({ ...formData, partnerEmail: e.target.value })}
                    icon={User}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleSearchPartner} 
                  loading={searching}
                  variant="outline"
                  className="!h-[48px] !px-4"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              {partnerUser ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-xs font-bold animate-in">
                  <Check className="w-4 h-4" />
                  Partner Verified: {partnerUser.name || partnerUser.email} (ID: {partnerUser.id})
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-brand-50 text-brand-600 rounded-xl border border-brand-100 text-[10px] font-black uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  Search to verify the partner before creating the totem
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-surface-100 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!partnerUser} size="lg" className="px-10">
              Create Totem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTotemPage;
