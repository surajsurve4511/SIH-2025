import React, { useMemo } from 'react';
import { Plot } from '../types';
import Modal from './Modal';
import DailyLogCard from './DailyLogCard';

interface PlotLogHistoryModalProps {
  plot: Plot | null;
  onClose: () => void;
}

const PlotLogHistoryModal: React.FC<PlotLogHistoryModalProps> = ({ plot, onClose }) => {
  const sortedLogs = useMemo(() => {
    if (!plot?.dailyLogs) return [];
    return [...plot.dailyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [plot]);

  if (!plot) return null;

  return (
    <Modal isOpen={!!plot} onClose={onClose} title={`Log History for ${plot.name}`} size="2xl">
      <div>
        {sortedLogs.length > 0 ? (
          <div className="space-y-4">
            {sortedLogs.map(log => (
              <DailyLogCard key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-8">No daily logs have been recorded for this plot yet.</p>
        )}
      </div>
    </Modal>
  );
};

export default PlotLogHistoryModal;
