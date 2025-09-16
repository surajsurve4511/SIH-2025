


import React, { useState, useEffect } from 'react';
import { Farmer } from '../types';
import { LeafIcon, UserIcon } from './icons';
import { LoggedInUser } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (user: LoggedInUser) => void;
  farmers: Farmer[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, farmers }) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    if (farmers.length > 0) {
      setSelectedFarmerId(farmers[0].id);
    }
  }, [farmers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFarmerId) {
      onLogin({ role: 'farmer', id: selectedFarmerId });
    } else {
      alert(t('login.selectFarmerAlert'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-base">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <LeafIcon className="w-16 h-16 mx-auto text-brand-green" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-800">
            {t('login.welcome')}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {t('login.tagline')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
             <div className="pt-4">
                <label htmlFor="farmer" className="block text-sm font-medium text-neutral-700">
                  {t('login.selectProfile')}
                </label>
                <select
                  id="farmer"
                  name="farmer"
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  disabled={farmers.length === 0}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-neutral-100"
                >
                  {farmers.length > 0 ? (
                    farmers.map((farmer) => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.location}
                      </option>
                    ))
                  ) : (
                    <option>{t('login.noProfiles')}</option>
                  )}
                </select>
              </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedFarmerId}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-brand-blue/50 group-hover:text-brand-blue/80" />
              </span>
              {t('login.loginButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;