import React, { useState } from 'react';
import { useTheme } from "next-themes";
import Link from "next/link";
import {
    Lock, CreditCard, Smartphone, BellRing, Globe, Moon, Shield, FileText,
    HelpCircle, ChevronRight, ArrowLeft, Sun, Monitor, Trash2, ChevronDown
} from "lucide-react";

// --- SOUS-COMPOSANTS ---

const SettingsHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
);

const ThemeForm = ({ onBack }: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="max-w-2xl">
            <SettingsHeader title="Apparence" onBack={onBack} />
            <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4">
                {[
                    { label: 'Thème clair', value: 'light', icon: Sun },
                    { label: 'Thème sombre', value: 'dark', icon: Moon },
                    { label: 'Système', value: 'system', icon: Monitor }
                ].map((option, i) => (
                    <label
                        key={i}
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all group
                            ${theme === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <option.icon className={`
                                ${theme === option.value ? 'text-blue-600' : 'text-slate-500'}
                            `} />
                            <span className="font-medium text-slate-700">{option.label}</span>
                        </div>
                        <input
                            type="radio"
                            name="theme"
                            className="accent-blue-600 w-5 h-5"
                            checked={theme === option.value}
                            onChange={() => setTheme(option.value)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

const LanguageForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Langue & Région" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            <div>
                <label className="block text-slate-700 font-medium mb-2">Langue de l'application</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700">
                        <option>Français (Cameroun)</option>
                        <option>English (US)</option>
                        <option>Français (France)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Format de date</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700">
                        <option>JJ/MM/AAAA</option>
                        <option>MM/JJ/AAAA</option>
                        <option>AAAA-MM-JJ</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Enregistrer</button>
        </div>
    </div>
);

const PasswordForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Modifier le mot de passe" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            <div>
                <label className="block text-slate-700 font-medium mb-2">Mot de passe actuel</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Nouveau mot de passe</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Confirmer le mot de passe</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Mettre à jour</button>
        </div>
    </div>
);

const NotificationsForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Préférences de notifications" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            {['Notifications Email', 'Notifications SMS', 'Offres promotionnelles', 'Mises à jour de sécurité'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-slate-700 font-medium">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
            <button className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Enregistrer les préférences</button>
        </div>
    </div>
);

const PaymentForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Méthodes de paiement" onBack={onBack} />
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-600 rounded-md"></div>
                    <div>
                        <p className="font-bold text-slate-800">Visa terminant par 4242</p>
                        <p className="text-xs text-slate-500">Expire le 12/25</p>
                    </div>
                </div>
                <button className="text-red-500 text-sm font-bold hover:underline">Retirer</button>
            </div>
            <button className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-4 text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                <CreditCard size={20} /> Ajouter une nouvelle carte
            </button>
        </div>
    </div>
);

// --- VUE PRINCIPALE ---

export const SettingsView = () => {
    const [subView, setSubView] = useState('main');

    const SettingsItem = ({ icon: Icon, title, subtitle, onClick, color = "text-slate-600" }: any) => (
        <div onClick={onClick} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
    );

    const Section = ({ title, children }: any) => (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{title}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">{children}</div>
        </div>
    );

    if (subView === 'password') return <PasswordForm onBack={() => setSubView('main')} />;
    if (subView === 'notifications') return <NotificationsForm onBack={() => setSubView('main')} />;
    if (subView === 'payment') return <PaymentForm onBack={() => setSubView('main')} />;
    if (subView === 'theme') return <ThemeForm onBack={() => setSubView('main')} />;
    if (subView === 'language') return <LanguageForm onBack={() => setSubView('main')} />;

    return (
        <div className="max-w-4xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-500 mt-1">Gérez vos préférences et la sécurité de votre compte.</p>
            </header>

            <Section title="Compte & Sécurité">
                <SettingsItem icon={Lock} title="Mot de passe" subtitle="Modifiez votre mot de passe." color="text-blue-600" onClick={() => setSubView('password')} />
                <SettingsItem icon={CreditCard} title="Paiements" subtitle="Gérez vos cartes bancaires." color="text-green-600" onClick={() => setSubView('payment')} />
                <SettingsItem icon={Smartphone} title="Authentification à deux facteurs" subtitle="Sécurité renforcée." color="text-purple-600" onClick={() => { }} />
            </Section>

            <Section title="Préférences">
                <SettingsItem icon={BellRing} title="Notifications" subtitle="Emails et alertes." color="text-blue-500" onClick={() => setSubView('notifications')} />
                <SettingsItem icon={Globe} title="Langue & Région" subtitle="Français (Cameroun)" color="text-blue-400" onClick={() => setSubView('language')} />
                <SettingsItem icon={Moon} title="Apparence" subtitle="Thème clair, sombre ou système" color="text-slate-700" onClick={() => setSubView('theme')} />
            </Section>

            <Section title="Légal & Support">
                <SettingsItem icon={Shield} title="Politique de Confidentialité" subtitle="Contrôlez vos données." color="text-emerald-600" onClick={() => { }} />
                <SettingsItem icon={FileText} title="Conditions d'utilisation" subtitle="Règles de la plateforme." color="text-blue-600" onClick={() => { }} />
                <Link href="/Help"><SettingsItem icon={HelpCircle} title="Aide & Support" subtitle="Contactez notre équipe." color="text-red-500" onClick={() => { }} /></Link>
            </Section>

            <div className="mt-12 pt-8 border-t border-slate-200">
                <h2 className="text-red-600 font-bold mb-4">Zone de danger</h2>
                <button className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2">
                    <Trash2 size={16} /> Supprimer mon compte
                </button>
            </div>
        </div>
    );
};
