import { useState, useEffect, useCallback } from 'react';
import API from '../../utils/config';

export function useCrud(endpoint) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const token = () => localStorage.getItem('adminToken');
  const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/${endpoint}`, { headers: authHeaders() });
      const d   = await res.json();
      setItems(Array.isArray(d) ? d : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const create = async (data, isFormData = false) => {
    const res = await fetch(`${API}/${endpoint}`, {
      method:'POST',
      headers: isFormData ? authHeaders() : { ...authHeaders(), 'Content-Type':'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) { const d=await res.json(); throw new Error(d.message||'Create failed'); }
    await load();
  };

  const update = async (id, data, isFormData = false) => {
    const res = await fetch(`${API}/${endpoint}/${id}`, {
      method:'PUT',
      headers: isFormData ? authHeaders() : { ...authHeaders(), 'Content-Type':'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) { const d=await res.json(); throw new Error(d.message||'Update failed'); }
    await load();
  };

  const remove = async (id) => {
    const res = await fetch(`${API}/${endpoint}/${id}`, { method:'DELETE', headers: authHeaders() });
    if (!res.ok) { const d=await res.json(); throw new Error(d.message||'Delete failed'); }
    await load();
  };

  return { items, loading, error, reload: load, create, update, remove };
}
