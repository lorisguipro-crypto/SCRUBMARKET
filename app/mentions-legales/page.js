export const metadata = { title: "Mentions légales & CGU — MedOccaz" };

export default function MentionsLegales() {
  return (
    <div className="content">
      <h1>Mentions légales &amp; conditions générales</h1>
      <div className="note">
        {"Modèle provisoire, à compléter avec vos informations réelles et à faire valider par un avocat avant toute ouverture publique. Les mentions entre crochets sont à remplacer."}
      </div>

      <h2>Éditeur du site</h2>
      <p>
        {"[Raison sociale] — [forme juridique, ex. EURL] au capital de [montant] €."}<br />
        {"Siège social : [adresse complète]."}<br />
        {"SIRET : [numéro] — RCS [ville]."}<br />
        {"Contact : [email] — [téléphone]."}<br />
        {"Directeur de la publication : [nom]."}
      </p>

      <h2>Hébergeur</h2>
      <p>
        {"Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com. (Vérifiez l'adresse en vigueur.)"}
      </p>

      <h2>Objet et rôle de la plateforme</h2>
      <p>
        {"Le site est une place de marché réservée aux professionnels de santé, permettant la mise en relation en vue de l'achat et de la vente de matériel médical d'occasion réutilisable. L'éditeur agit comme intermédiaire technique : il n'est pas partie aux contrats conclus entre utilisateurs et ne garantit pas les dispositifs proposés."}
      </p>

      <h2>Obligations des utilisateurs</h2>
      <ul>
        <li>{"Être un professionnel de santé ou un établissement habilité."}</li>
        <li>{"Ne proposer que du matériel autorisé (réutilisable, marqué CE), à l'exclusion du matériel à usage unique, stérile, implantable, périmé ou sous rappel."}</li>
        <li>{"Déclarer sincèrement l'état et la conformité du matériel mis en vente."}</li>
      </ul>

      <h2>Responsabilité</h2>
      <p>
        {"La vente se conclut directement entre le vendeur et l'acheteur. L'éditeur ne saurait être tenu responsable de la conformité, de l'état ou de la livraison des dispositifs, ni des échanges entre utilisateurs."}
      </p>

      <h2>Données personnelles</h2>
      <p>
        {"Les données collectées (email, coordonnées) servent uniquement à la mise en relation et à l'information des utilisateurs. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à [email]."}
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        {"La marque, le logo, la base de données d'annonces et le contenu du site sont protégés. Toute reproduction non autorisée est interdite."}
      </p>
    </div>
  );
}
