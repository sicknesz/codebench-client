import React from "react";

type PaneHeaderProps = {
  icon: React.ReactNode;
  label: string;
  meta?: string;
  action?: React.ReactNode;
  paneId?: string;
  onDragStart?: (paneId: string) => void
};

export default function PaneHeader({ icon, label, meta, action, paneId, onDragStart }: PaneHeaderProps) {
  return (
    <div
      className="pane-header"
      draggable={Boolean(paneId)}
      onDragStart={() => paneId && onDragStart?.(paneId)}
      title="Drag to move panel">
      <div className="pane-label">
        <span className="pane-icon">{icon}</span>
        <span>{label}</span>
        {meta && <span className="pane-meta">{meta}</span>}
      </div>
      {action}
    </div>
  )
};
