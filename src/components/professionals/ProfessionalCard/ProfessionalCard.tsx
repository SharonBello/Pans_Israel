import { CheckIcon, EmailIcon, LocationIcon, NavigationIcon, PhoneIcon, WebIcon, XIcon } from "@/components/icons/Icons";
import type { ProfessionalCardProps } from "@/types/professionals";

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
  const { name, field, location, phone, email, website, address, description, acceptingNewPatients } = professional;

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