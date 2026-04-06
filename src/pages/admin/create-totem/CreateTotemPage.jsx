import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Search, User, Layout, Loader2 } from 'lucide-react';
import { totemService } from '../../../services/totemService';
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

  const trimmedName = formData.name.trim();
  const normalizedEmail = formData.partnerEmail.trim().toLowerCase();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const isCreateEnabled = Boolean(partnerUser) && trimmedName.length > 0 && !loading;

  const disabledReason = useMemo(() => {
    if (!trimmedName) return 'Totem name is required';
    if (!isEmailValid) return 'Enter a valid partner email';
    if (!partnerUser) return 'Verification Required';
    return '';
  }, [trimmedName, isEmailValid, partnerUser]);

  const handleSearchPartner = async () => {
    if (!isEmailValid) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setSearching(true);
      setPartnerUser(null);
      const users = await totemService.searchUserByEmail(normalizedEmail);
      
      if (users && users.length > 0) {
        const exactMatch = users.find((user) => {
          const userEmail = (user.email || user.email_address || '').toLowerCase();
          return userEmail === normalizedEmail;
        });
        const matchedPartner = exactMatch || users[0];
        setPartnerUser(matchedPartner);
        toast.success(`Partner found: ${matchedPartner.name || matchedPartner.email || normalizedEmail}`);
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

      // Normalize partner user data so the fallback DB can persist useful owner info.
      const nameParts = (partnerUser.first_name || partnerUser.name || '').split(' ').filter(Boolean);
      const userPayload = {
        first_name: partnerUser.first_name || nameParts[0] || '',
        last_name: partnerUser.last_name || nameParts.slice(1).join(' ') || '',
        email: partnerUser.email || partnerUser.email_address || partnerUser.partnerEmail || '',
        name: partnerUser.name || `${partnerUser.first_name || ''} ${partnerUser.last_name || ''}`.trim(),
      };

      await totemService.create({
        id_store: partnerUser.id,
        name: trimmedName,
        user: userPayload,
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
    <div className="flex h-full flex-col px-4 py-8 md:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#d5dbe4] bg-white text-[#5f6975] shadow-sm transition-all hover:bg-[#f8fafc] hover:text-[#12171f]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl sm:text-[32px] font-extrabold tracking-tight text-[#12171f]">Create Totem</h1>
        </div>

        <div className="rounded-[12px] border border-[#d7dde5] bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#262d36]">Totem Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Layout className="h-5 w-5 text-[#a1aab6]" />
                </div>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Entrance Kiosk"
                  autoComplete="off"
                  required
                  className="block h-11 w-full rounded-[8px] border border-[#d4dbe5] bg-white pl-10 sm:pl-11 pr-4 text-sm text-[#212a33] outline-none transition-colors placeholder:text-[#8f97a3] focus:border-[#8aa0bf]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#262d36]">Partner Email Verification</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-5 w-5 text-[#a1aab6]" />
                </div>
                <input
                  value={formData.partnerEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, partnerEmail: e.target.value });
                    if (partnerUser) setPartnerUser(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchPartner();
                    }
                  }}
                  placeholder="Partner@example.com"
                  autoComplete="email"
                  required
                  className={`block h-11 w-full rounded-[8px] bg-white pl-10 sm:pl-11 pr-[94px] sm:pr-[110px] text-sm text-[#212a33] outline-none transition-colors placeholder:text-[#8f97a3] ${
                    partnerUser
                      ? 'border border-[#67a893] focus:border-[#4f8f7a]'
                      : 'border border-[#d4dbe5] focus:border-[#8aa0bf]'
                  }`}
                />

                <div className="absolute inset-y-1.5 right-1.5 sm:inset-y-2 sm:right-2 flex items-center">
                  <div className="mr-1.5 sm:mr-2 h-5 w-px bg-[#d7dde6]" />
                  <button
                    type="button"
                    onClick={handleSearchPartner}
                    disabled={searching || !isEmailValid}
                    className={`flex h-full items-center gap-1.5 rounded-[6px] px-2 sm:px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                      partnerUser 
                        ? 'bg-[#edf7f4] text-[#2c6f60]' 
                        : 'text-[#3c4756] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#6c7682]" />
                    ) : (
                      <>
                        <span>{partnerUser ? 'Verified' : 'Verify'}</span>
                        <Search className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className={`pl-1 text-[13px] ${partnerUser ? 'font-medium text-[#2c6f60]' : 'text-[#6c7682]'}`}>
                {partnerUser
                  ? `Verified: ${partnerUser.name || partnerUser.email || normalizedEmail}`
                  : 'A valid, verified partner email is required for registration.'}
              </p>
            </div>

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-[#edf1f5] pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex h-11 sm:h-10 w-full sm:w-auto items-center justify-center rounded-[8px] border border-[#d6dde6] bg-white px-6 text-sm font-medium text-[#1f2933] shadow-sm transition-colors hover:bg-[#f8fafc]"
              >
                Cancel
              </button>

              <div className="group relative w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={!isCreateEnabled}
                  className={`inline-flex h-11 sm:h-10 w-full sm:min-w-[130px] items-center justify-center rounded-[8px] border px-6 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed ${
                    isCreateEnabled
                      ? 'border-[#257a65] bg-[#2f9078] hover:bg-[#257a65]'
                      : 'border-[#d0d7e2] bg-[#c9ced6]'
                  }`}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Totem'}
                </button>

                {!isCreateEnabled && !loading && (
                  <span className="pointer-events-none absolute -top-10 left-1/2 z-10 w-max -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#12171f] px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {disabledReason}
                    <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#12171f]" />
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTotemPage;
