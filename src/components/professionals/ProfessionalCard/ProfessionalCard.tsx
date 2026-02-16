import { CheckIcon, EmailIcon, LocationIcon, NavigationIcon, PhoneIcon, WebIcon, XIcon } from "@/components/icons/Icons";
import { HEALTH_FUNDS } from "@/data/professionalsData";
import type { ProfessionalCardProps } from "@/types/professionals";
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

// ============ HELPER FUNCTIONS ============
const generateGoogleMapsLink = (address: string, location: string): string => {
  const query = encodeURIComponent(`${address}, ${location}, Israel`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const generateWazeLink = (address: string, location: string): string => {
  const query = encodeURIComponent(`${address}, ${location}, Israel`);
  return `https://waze.com/ul?q=${query}&navigate=yes`;
};

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const { name, field, location, phone, email, website, address, description, acceptingNewPatients, healthFunds } = professional;

  // Get health fund labels from keys
  const healthFundLabels = healthFunds?.map((key: string) =>
    HEALTH_FUNDS.find(fund => fund.key === key)?.label
  ).filter(Boolean);

  return (
    <article className="pro-card">
      <div className="pro-card__header">
        <div className="pro-card__avatar">{name.charAt(0)}</div>
        <div className="pro-card__info">
          <h3 className="pro-card__name">{name}</h3>
          <span className="pro-card__field">{field}</span>
        </div>
      </div>

      <div className="pro-card__location">
        <LocationIcon />
        <span>{location}</span>
        {address && (
          <>
            <span className="pro-card__address-separator">•</span>
            <span className="pro-card__address-text">{address}</span>
          </>
        )}
      </div>

      {/* NEW: Health Funds Display */}
      {healthFundLabels && healthFundLabels.length > 0 && (
        <div className="pro-card__health-funds">
          <span className="pro-card__health-funds-label">קופות חולים:</span>
          <div className="pro-card__health-funds-tags">
            {healthFundLabels.map((label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined, index: Key | null | undefined) => (
              <span key={index} className="pro-card__health-fund-tag">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Links for Address */}
      {address && (
        <div className="pro-card__navigation">
          <a
            href={generateGoogleMapsLink(address, location)}
            target="_blank"
            rel="noopener noreferrer"
            className="pro-card__nav-link pro-card__nav-link--google"
          >
            <NavigationIcon />
            <span>Google Maps</span>
          </a>
          <a
            href={generateWazeLink(address, location)}
            target="_blank"
            rel="noopener noreferrer"
            className="pro-card__nav-link pro-card__nav-link--waze"
          >
            <NavigationIcon />
            <span>Waze</span>
          </a>
        </div>
      )}

      {description && <p className="pro-card__description">{description}</p>}

      {acceptingNewPatients !== undefined && (
        <div className={`pro-card__status ${acceptingNewPatients ? 'available' : 'unavailable'}`}>
          {acceptingNewPatients ? <CheckIcon /> : <XIcon />}
          <span>{acceptingNewPatients ? 'מקבל/ת מטופלים חדשים' : 'לא מקבל/ת כרגע'}</span>
        </div>
      )}

      <div className="pro-card__actions">
        {phone && (
          <a href={`tel:${phone}`} className="pro-card__btn pro-card__btn--phone">
            <PhoneIcon />
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="pro-card__btn pro-card__btn--email">
            <EmailIcon />
            <span>אימייל</span>
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="pro-card__btn pro-card__btn--web">
            <WebIcon />
            <span>אתר</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default ProfessionalCard;