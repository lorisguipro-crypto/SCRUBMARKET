import Link from 'next/link';

export default function AnnonceCard({ annonce }) {
  const photo =
    Array.isArray(annonce.photos) && annonce.photos.length ? annonce.photos[0] : null;

  const prix = annonce.prix
    ? `${Number(annonce.prix).toLocaleString('fr-FR')} €`
    : 'Prix à discuter';

  const tech = [annonce.marque, annonce.annee_fabrication, annonce.etat].filter(Boolean).join(' · ');
  const sub = [annonce.categories?.nom, annonce.ville].filter(Boolean).join(' · ');

  return (
    <Link href={`/annonces/${annonce.id}`} className="card">
      <div className="card-media">
        {photo ? (
          <img src={photo} alt={annonce.titre} />
        ) : (
          <div className="card-media-empty">Pas de photo</div>
        )}
      </div>
      <div className="card-body">
        <h3>{annonce.titre}</h3>
        {tech && <p className="card-meta">{tech}</p>}
        {sub && <p className="card-sub">{sub}</p>}
        <p className="card-price">{prix}</p>
      </div>
    </Link>
  );
}
