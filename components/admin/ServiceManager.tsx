import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Service } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Edit2, Trash2, Plus, Clock, DollarSign, Tag } from 'lucide-react';
import { uuidv4 } from '../../utils/helpers';

export const ServiceManager: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    priceCents: 0,
    durationMinutes: 60,
    color: '#4F46E5',
    category: 'Geral',
    active: true
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({ name: '', priceCents: 0, durationMinutes: 60, color: '#4F46E5', category: 'Geral', active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormData({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      dispatch({ type: 'DELETE_SERVICE', payload: id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      dispatch({ type: 'UPDATE_SERVICE', payload: { ...editingService, ...formData } as Service });
    } else {
      dispatch({ 
        type: 'ADD_SERVICE', 
        payload: { ...formData, id: uuidv4(), active: true } as Service 
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Serviços</h2>
           <p className="text-slate-500">Gerencie seu catálogo de ofertas.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
            <Plus size={18} /> Novo Serviço
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Serviço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duração</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {state.services.map(service => (
                    <tr key={service.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full mr-3 shadow-sm border border-black/10" style={{ backgroundColor: service.color }}></div>
                                <div className="text-sm font-medium text-slate-900">{service.name}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                {service.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {service.durationMinutes} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            R$ {(service.priceCents / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleOpenEdit(service)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Nome do Serviço" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
            />
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Preço (R$)" 
                    type="number"
                    value={formData.priceCents ? formData.priceCents / 100 : ''} 
                    onChange={e => setFormData({...formData, priceCents: parseFloat(e.target.value) * 100})} 
                    required 
                />
                <Input 
                    label="Duração (min)" 
                    type="number"
                    value={formData.durationMinutes} 
                    onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})} 
                    required 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Cor</label>
                     <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={formData.color} 
                            onChange={e => setFormData({...formData, color: e.target.value})}
                            className="h-9 w-full rounded border border-slate-300 cursor-pointer" 
                        />
                     </div>
                </div>
                <Input 
                    label="Categoria" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                />
            </div>
            
            <div className="flex justify-end pt-4">
                <Button type="submit">{editingService ? 'Salvar Alterações' : 'Criar Serviço'}</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};