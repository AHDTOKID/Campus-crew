import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader, Badge } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { ManageColleges } from './ManageColleges';
import { VerifyStudents } from './VerifyStudents';
import { Reports } from './Reports';

export default function Admin() {
    const [tab, setTab] = useState('verify');
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-extrabold">Administration</h1>
            <div className="flex flex-wrap gap-2">
                {[['verify', 'Verifications'], ['reports', 'Reports'], ['colleges', 'Colleges']].map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === k ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{l}</button>
                ))}
            </div>
            {tab === 'verify' && <VerifyStudents />}
            {tab === 'reports' && <Reports />}
            {tab === 'colleges' && <ManageColleges />}
        </div>
    );
}