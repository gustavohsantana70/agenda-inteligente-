import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Client } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Edit2, Trash2, Plus, User, Phone, Mail } from 'lucide-react';
import { uuidv4 } from '../../utils/helpers';

export const ClientManager: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    tags: []
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', notes: '', tags: [] });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ ...client });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: { ...editingClient, ...formData } as Client });
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: { ...formData, id: uuidv4() } as Client });
    }
    setIsModalOpen(false);
  };

  const addTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] });
        setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
           <p className="text-slate-500">Base de contatos e histórico.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
            <Plus size={18} /> Novo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {state.clients.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                                    <User size={16} />
                                </div>
                                <div className="text-sm font-medium text-slate-900">{client.name}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 flex items-center gap-1"><Mail size={12} /> {client.email}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1"><Phone size={12} /> {client.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex gap-1 flex-wrap">
                                {client.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {tag}
                                    </span>
                                ))}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleOpenEdit(client)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Nome Completo" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
            />
             <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Email" 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
                <Input 
                    label="Telefone" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        className="flex-1 border border-slate-300 rounded px-3 py-1 text-sm"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        placeholder="Ex: VIP"
                        onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                    />
                    <button type="button" onClick={addTag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {formData.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs flex items-center gap-1">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><Trash2 size={10} /></button>
                        </span>
                    ))}
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas Internas</label>
                <textarea 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
             </div>

            <div className="flex justify-end pt-4">
                <Button type="submit">{editingClient ? 'Salvar Alterações' : 'Criar Cliente'}</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};