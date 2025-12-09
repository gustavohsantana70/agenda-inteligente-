import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { uuidv4 } from '../../utils/helpers';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Plus } from 'lucide-react';

export const ServiceEditor: React.FC = () => {
  const { dispatch } = useBooking();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');

  const handleCreate = () => {
    if (!name || !price || !duration) return;
    
    const service = { 
        id: uuidv4(), 
        name, 
        description: 'Novo serviço criado pelo admin', 
        priceCents: Math.round(parseFloat(price) * 100), 
        durationMinutes: Number(duration), 
        bufferMinutes: 10 
    };
    
    dispatch({ type: 'ADD_SERVICE', payload: service });
    
    setName('');
    setPrice('');
    setDuration('60');
    alert('Serviço criado com sucesso!');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Novo Serviço
      </h3>
      <div className="space-y-4">
        <Input 
            label="Nome do Serviço"
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Ex: Terapia Manual" 
        />
        <div className="grid grid-cols-2 gap-4">
            <Input 
                label="Preço (R$)"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="150.00"
                type="number"
            />
            <Input 
                label="Duração (min)"
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                placeholder="60"
                type="number" 
            />
        </div>
        <Button onClick={handleCreate} className="w-full">
            Criar Serviço
        </Button>
      </div>
    </div>
  );
};