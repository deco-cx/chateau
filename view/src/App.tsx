import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from './components/ui/button';
import { TextEditor } from './components/TextEditor';
import { EvaluationPanel } from './components/EvaluationPanel';
import { CriteriaModal } from './components/CriteriaModal';
import { client } from './lib/rpc';
import { loadState, saveState, getDefaultCriteria } from './lib/db';
import type { SavedState, Criterion, Evaluation, EvaluationResult } from './types';
import { Sparkles } from 'lucide-react';

const queryClient = new QueryClient();

function AppContent() {
  const [text, setText] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Carregar estado inicial
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const savedState = await loadState();
        if (savedState) {
          setText(savedState.text);
          setCriteria(savedState.criteria);
          setEvaluations(savedState.evaluations);
        } else {
          // Estado inicial com critérios default
          setCriteria(getDefaultCriteria());
        }
      } catch (error) {
        console.error('Erro ao carregar estado:', error);
        setCriteria(getDefaultCriteria());
      }
    };

    loadInitialState();
  }, []);

  // Salvar estado automaticamente
  useEffect(() => {
    const saveCurrentState = async () => {
      if (criteria.length > 0) { // Só salva se já carregou
        const state: SavedState = {
          text,
          criteria,
          evaluations,
          updatedAt: new Date().toISOString()
        };
        
        try {
          await saveState(state);
        } catch (error) {
          console.error('Erro ao salvar estado:', error);
        }
      }
    };

    const debounceTimer = setTimeout(saveCurrentState, 1000);
    return () => clearTimeout(debounceTimer);
  }, [text, criteria, evaluations]);

  const handleEvaluate = async () => {
    if (!text.trim()) {
      alert('Por favor, digite algum texto para avaliar.');
      return;
    }

    if (criteria.length === 0) {
      alert('Por favor, configure pelo menos um critério de avaliação.');
      return;
    }

    setIsEvaluating(true);
    
    try {
      // Construir schema dinâmico baseado nos critérios
      const schema = {
        type: 'object',
        properties: criteria.reduce((acc, criterion) => {
          acc[criterion.id] = {
            type: 'object',
            properties: {
              score: {
                type: 'number',
                minimum: 0,
                maximum: 10,
                description: 'Nota de 0 a 10 para este critério'
              },
              feedback: {
                type: 'string',
                description: 'Feedback detalhado sobre este critério'
              }
            },
            required: ['score', 'feedback']
          };
          return acc;
        }, {} as any),
        required: criteria.map(c => c.id)
      };

      // Construir prompt com todos os critérios
      const prompt = `Avalie o seguinte texto de acordo com os critérios especificados:

TEXTO:
${text}

CRITÉRIOS DE AVALIAÇÃO:
${criteria.map(c => `- ${c.title}: ${c.prompt}`).join('\n')}

Para cada critério, forneça uma nota de 0 a 10 e um feedback detalhado explicando a avaliação.`;

      const result = await client.AI_GENERATE_OBJECT({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        schema
      });

      if (result.object) {
        const evaluationResult = result.object as EvaluationResult;
        const newEvaluations: Evaluation[] = criteria.map(criterion => ({
          criterionId: criterion.id,
          score: evaluationResult[criterion.id]?.score || 0,
          feedback: evaluationResult[criterion.id]?.feedback || 'Avaliação não disponível'
        }));

        setEvaluations(newEvaluations);
      }
    } catch (error) {
      console.error('Erro ao avaliar texto:', error);
      alert('Erro ao avaliar o texto. Tente novamente.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chateau
          </h1>
          <p className="text-gray-600">
            Avaliador inteligente de textos com critérios personalizáveis
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna da esquerda - Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Editor</h2>
              <div className="flex gap-2">
                <CriteriaModal 
                  criteria={criteria}
                  onCriteriaChange={setCriteria}
                />
                <Button 
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !text.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEvaluating ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Avaliando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Avaliar
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <TextEditor
              content={text}
              onChange={setText}
              placeholder="Digite seu texto aqui para receber uma avaliação detalhada..."
            />
          </div>

          {/* Coluna da direita - Painel de Avaliação */}
          <div>
            <EvaluationPanel
              evaluations={evaluations}
              criteria={criteria}
              isLoading={isEvaluating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
