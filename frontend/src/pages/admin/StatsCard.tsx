import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default function StatsCard({ icon, label, value }: { icon: IconDefinition; label: string; value: number }) {
  return (
    <div className="sp-admin-stat-card">
      <FontAwesomeIcon icon={icon} className="sp-admin-stat-icon" />
      <div>
        <div className="sp-admin-stat-label">{label}</div>
        <div className="sp-admin-stat-value">{value}</div>
      </div>
    </div>
  );
}
