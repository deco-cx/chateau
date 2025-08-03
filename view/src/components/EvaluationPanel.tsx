import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Evaluation, Criterion } from '../types';

interface EvaluationPanelProps {
  evaluations: Evaluation[];
  criteria: Criterion[];
  isLoading?: boolean;
}

export function EvaluationPanel({ evaluations, criteria, isLoading = false }: EvaluationPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avaliação</h2>
        <div className="space-y-3">
          {criteria.map((criterion) => (
            <Card key={criterion.id} className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{criterion.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avaliação</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Clique em "Avaliar" para analisar seu texto</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Avaliação</h2>
      <div className="space-y-3">
        {evaluations.map((evaluation) => {
          const criterion = criteria.find(c => c.id === evaluation.criterionId);
          if (!criterion) return null;

          return (
            <Card key={evaluation.criterionId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  {criterion.title}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Nota:</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded ${
                      evaluation.score >= 8 ? 'bg-green-100 text-green-700' :
                      evaluation.score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {evaluation.score}/10
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {evaluation.feedback}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 