import Link from 'next/link';

export const metadata = { title: "Comment ça marche — MedOccaz" };

export default function CommentCaMarche() {
  return (
    <div className="content">
      <p className="eyebrow" style={{ color: 'var(--primary-dark)' }}>Comment ça marche</p>
      <h1>Une place de marché entre professionnels de santé</h1>
      <p className="muted">
        {"MedOccaz met en relation des professionnels de santé pour l'achat et la vente de matériel médical d'occasion réutilisable. La plateforme n'intervient pas dans la transaction : elle héberge les annonces et vous met en relation."}
      </p>

      <h2>Pour vendre</h2>
      <ul>
        <li>{"Déposez votre annonce en quelques minutes : titre, spécialité, prix, photos."}</li>
        <li>{"Attestez de la conformité de votre matériel (marquage CE, état, non périmé)."}</li>
        <li>{"Les acheteurs intéressés vous contactent directement par email."}</li>
      </ul>

      <h2>Pour acheter</h2>
      <ul>
        <li>{"Parcourez les annonces par spécialité, ou cherchez une marque ou un modèle."}</li>
        <li>{"Contactez le vendeur depuis l'annonce pour poser vos questions."}</li>
        <li>{"Convenez du prix, du paiement et de la livraison en direct avec lui."}</li>
      </ul>

      <h2>Ce qui peut être vendu</h2>
      <p>
        {"Uniquement du matériel durable et réutilisable, marqué CE et déjà mis sur le marché européen : équipements de bloc, mobilier, imagerie, endoscopie, instruments réutilisables…"}
      </p>
      <div className="note">
        {"Sont exclus : le matériel à usage unique, stérile, implantable, les dispositifs de diagnostic in vitro, ainsi que tout produit périmé ou faisant l'objet d'un rappel."}
      </div>

      <h2>Le rôle de la plateforme</h2>
      <p>
        {"MedOccaz est un intermédiaire technique. Le contrat de vente est conclu directement entre le vendeur et l'acheteur ; la plateforme n'est pas partie à la vente et ne garantit pas les dispositifs. Chaque vendeur déclare la conformité de son matériel."}
      </p>

      <div className="cta">
        <Link href="/annonces" className="btn btn-primary">Parcourir les annonces</Link>
        <Link href="/deposer" className="btn btn-ghost">Déposer une annonce</Link>
      </div>
    </div>
  );
}
