import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatsCardProps {
  icon: IconDefinition;
  label: string;
  value: number;
}

export default function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card text-white mb-3 bg-dark border shadow">
        <div className="card-body d-flex align-items-center ">
          <FontAwesomeIcon icon={icon} size="2x" className="me-3" />
          <div>
            <h5 className="card-title">{label}</h5>
            <p className="card-text">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
