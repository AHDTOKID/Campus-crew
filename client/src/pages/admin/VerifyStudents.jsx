import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';

export function VerifyStudents() {
    const [items, setItems] = useState(null);
    const load = () => api.get('/admin/verifications').then(setItems);
    useEffect(() => { load(); }, []);
    const decide = async (id, decision) => { await api.patch(`/admin/verifications/${id}`, { decision }); load(); };
    if (!items) return <Loader />;
    return (
        <div className="space-y-3">
            {items.map((v) => (
                <div key={v._id} className="card p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="font-bold">{v.userId?.name} <span className="text-sm font-normal text-slate-500">{v.userId?.email}</span></p>
                        <p className="text-sm text-slate-600">{v.collegeId?.name} · {v.userId?.department}</p>
                        {v.studentIdUrl && <a href={v.studentIdUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-600">View document</a>}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => decide(v._id, 'verified')}>Approve</Button>
                        <Button variant="danger" onClick={() => decide(v._id, 'rejected')}>Reject</Button>
                    </div>
                </div>
            ))}
            {!items.length && <p className="text-slate-500">No pending verifications.</p>}
        </div>
    );
}