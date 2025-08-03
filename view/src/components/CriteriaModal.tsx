import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Settings, Plus, Trash2 } from 'lucide-react';
import type { Criterion } from '../types';

interface CriteriaModalProps {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
}

export function CriteriaModal({ criteria, onCriteriaChange }: CriteriaModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localCriteria, setLocalCriteria] = useState<Criterion[]>(criteria);

  const handleSave = () => {
    onCriteriaChange(localCriteria);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalCriteria(criteria);
    setIsOpen(false);
  };

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: `criterion-${Date.now()}`,
      title: '',
      prompt: ''
    };
    setLocalCriteria([...localCriteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setLocalCriteria(localCriteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string) => {
    setLocalCriteria(localCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Critérios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Critérios de Avaliação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {localCriteria.map((criterion, index) => (
            <div key={criterion.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Critério {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCriterion(criterion.id)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium">Título</label>
                <input
                  type="text"
                  value={criterion.title}
                  onChange={(e) => updateCriterion(criterion.id, 'title', e.target.value)}
                  placeholder="Ex: Clareza"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Prompt de Avaliação</label>
                <Textarea
                  value={criterion.prompt}
                  onChange={(e) => updateCriterion(criterion.id, 'prompt', e.target.value)}
                  placeholder="Descreva como este critério deve ser avaliado..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addCriterion}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Critério
          </Button>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Salvar
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 