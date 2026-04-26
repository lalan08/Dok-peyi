/* ============================================================
   DOK'PÉYI — Language System
   Langues des communautés immigrées en Guyane
   ============================================================ */

/* ===== CONFIGURATION DES LANGUES ===== */
const LANGS = [
  { code: 'fr', flag: '🇫🇷', name: 'Français',         native: 'France · Guyane',   dir: 'ltr' },
  { code: 'pt', flag: '🇧🇷', name: 'Português',        native: 'Brasil',             dir: 'ltr' },
  { code: 'ht', flag: '🇭🇹', name: 'Kreyòl ayisyen',  native: 'Ayiti',              dir: 'ltr' },
  { code: 'nl', flag: '🇸🇷', name: 'Nederlands',       native: 'Surinam',            dir: 'ltr' },
  { code: 'ar',  flag: '🇸🇾', name: 'العربية',          native: 'سوريا · Syrie',      dir: 'rtl' },
  { code: 'en',  flag: '🇬🇾', name: 'English',          native: 'Guyana',              dir: 'ltr' },
  { code: 'gcr', flag: '🇬🇫', name: 'Kréyòl Gwiyannè', native: 'Guyane · Kréyòl',    dir: 'ltr' },
];

/* ===== TRADUCTIONS ===== */
const T = {

  /* ─────────── FRANÇAIS (défaut) ─────────── */
  fr: {
    nav_comment: 'Comment ça marche',
    nav_services: 'Services',
    nav_tarifs: 'Tarifs',
    nav_cta: 'Faire ma demande',
    nav_about: 'À propos',
    hero_badge: '✅ Simple · Rapide · Fiable',
    hero_t1: 'Moins de temps sur vos papiers.',
    hero_t2: 'Plus de clarté pour vos démarches.',
    hero_sub: 'CV, courriers, dossiers administratifs, séjour\u00a0: Dok\u2019Péyi vous aide à préparer vos documents et à mieux avancer dans vos démarches en Guyane française.',
    hero_cadre: 'Un service d\u2019aide à la préparation documentaire. La décision finale appartient toujours à l\u2019organisme concerné.',
    hero_btn1: 'Faire ma demande',
    hero_btn2: 'Voir les services',
    stat1: 'Demandes traitées',
    stat2: 'Délai moyen',
    stat3: 'Satisfaits',
    how_title: 'Comment ça fonctionne\u00a0?',
    how_sub: 'De votre besoin à votre document, en quelques étapes.',
    s1_title: 'Vous choisissez votre service',
    s1_desc: 'Emploi, courriers, dossiers du quotidien ou démarches plus sensibles\u00a0: vous sélectionnez le service qui correspond à votre besoin.',
    s2_title: 'Vous renseignez vos informations',
    s2_desc: 'Le parcours est conçu pour rester clair, même si vous n\u2019êtes pas à l\u2019aise avec les démarches administratives.',
    s3_title: 'Vous recevez votre document',
    s3_desc: 'Votre document est préparé, structuré et mis en forme à partir des éléments fournis, puis relu par vous avant utilisation.',
    svc_title: 'Nos services',
    svc_sub: 'Tout ce dont vous avez besoin pour vos démarches',
    svc1_name: 'Création de CV',
    svc1_desc: 'Un CV professionnel, clair et efficace pour décrocher un emploi',
    svc2_name: 'Lettre de motivation',
    svc2_desc: 'Une lettre claire, personnalisée et structurée pour votre candidature',
    svc3_name: 'Aide aux dossiers',
    svc3_desc: 'Accompagnement pour constituer votre dossier CAF, logement, emploi\u2026',
    svc4_name: 'Courriers officiels',
    svc4_desc: 'Rédaction pour mairies, préfectures, administrations et autres',
    from: 'à partir de',
    btn_start: 'Commencer',
    btn_choose: 'Choisir',
    adv1_t: 'Adapté à la Guyane',  adv1_d: 'Un service pensé pour les démarches locales et les situations spécifiques à la Guyane française.',
    adv2_t: 'Rapide et accessible', adv2_d: 'La plupart des documents sont préparés en moins de 24h, selon le service concerné.',
    adv3_t: 'Simple et clair',      adv3_d: 'Vous renseignez vos informations en quelques minutes. Dok\u2019Péyi prépare la rédaction et la mise en forme du document.',
    adv4_t: 'Cadre visible',        adv4_d: 'Les conditions du service, la confidentialité et vos droits sont détaillés sur le site.',
    pricing_title: 'Tarifs clairs et transparents',
    pricing_sub: 'Vous savez exactement ce que vous payez avant de commencer',
    form_title: 'Faire ma demande',
    form_sub: 'Choisissez votre service et commencez en quelques minutes',
    info_title: 'Ce que vous devez savoir',
    info1_heading: 'Ce que vous recevez',
    info1_text: 'Un document préparé, rédigé et mis en forme selon le service choisi.',
    info2_heading: 'Cadre du service',
    info2_text: 'Dok\u2019Péyi aide à préparer des documents. La décision finale appartient à l\u2019organisme concerné.',
    info3_heading: 'Confidentialité et contact',
    info3_text: 'Vos informations sont traitées dans le cadre du service demandé. Contact par email et WhatsApp.',
    testi_title: 'Ils nous font confiance',
    footer_tagline: 'Aide à la préparation documentaire pour vos démarches en Guyane française.',
    footer_nav: 'Navigation',
    footer_contact: 'Contact',
    footer_legal: 'Dok\u2019péyi est un service d\u2019aide à la rédaction et à la préparation de documents. Les documents doivent être relus avant utilisation.',
    hero_doc_cv: 'CV Professionnel',
    hero_doc_lettre: 'Lettre de motivation',
    hero_doc_dossier: 'Dossier CAF',
    badge_popular: 'Populaire',
    badge_ready: '✓ Prêt',
    badge_processing: '⏳ En cours',
    svc_sub_index: 'Tout ce dont vous avez besoin pour vos démarches administratives en Guyane',
    home_price_cv: 'à partir de 8€',
    home_price_lettre: 'à partir de 5€',
    home_price_courrier: 'à partir de 7€',
    home_price_dossier: 'à partir de 12€',
    home_price_sejour: 'à partir de 15€',
    home_price_impot: 'à partir de 10€',
    home_price_naturalisation: 'à partir de 20€',
    home_cv_title: 'CV Professionnel',
    home_lettre_title: 'Lettre de motivation',
    home_courrier_title: 'Courrier officiel',
    home_dossier_title: 'Dossier administratif',
    home_sejour_title: 'Titre de séjour',
    home_impot_title: 'Avis d\u2019impôt',
    home_naturalisation_title: 'Naturalisation',
    home_cv_desc: 'Un CV percutant, moderne et adapté à votre secteur — créé, amélioré ou professionnalisé selon votre profil.',
    home_lettre_desc: 'Une lettre claire, personnalisée et structurée — créée, améliorée ou adaptée à votre offre d\u2019emploi.',
    home_courrier_desc: 'Rédaction adaptée à votre situation et à l\u2019organisme concerné — demande, réclamation ou contestation.',
    home_dossier_desc: 'Aide à la constitution de votre dossier CAF, logement social ou aide sociale — checklist, étapes et pièces justificatives structurées.',
    home_sejour_desc: 'Première demande, renouvellement ou régularisation — dossier guidé et structuré selon votre situation.',
    home_impot_desc: 'Comprendre votre avis, identifier des aides et préparer un courrier aux services fiscaux — accompagnement clair et sans jargon.',
    home_naturalisation_desc: 'Vérification d\u2019éligibilité, préparation du dossier complet et lettre d\u2019intégration — accompagnement structuré à chaque étape.',
    testi1_quote: '"Mon CV était prêt en quelques heures. Simple, rapide, professionnel. J\u2019ai décroché un entretien la semaine suivante\u00a0!"',
    testi1_author: '— Marlène T., Cayenne',
    testi2_quote: '"Je ne savais pas comment rédiger ma lettre de motivation. Dok\u2019péyi l\u2019a fait pour moi et c\u2019était parfait\u00a0!"',
    testi2_author: '— Kevin R., Saint-Laurent',
    testi3_quote: '"Service top\u00a0! Mon dossier de logement était complet et bien présenté. Je recommande à tout le monde."',
    testi3_author: '— Fatima O., Kourou',
    contact_whatsapp: '📱 WhatsApp disponible',
    contact_hours: '🕐 Lun–Sam · 8h–20h',
    footer_rights: '© 2026 Dok\u2019péyi — Tous droits réservés',
    link_mentions: 'Mentions légales',
    link_cgv: 'CGV',
    link_confidentialite: 'Confidentialité',
    link_cookies: 'Cookies',
    ml_nav_home: "Retour à l'accueil",
    ml_title: 'Mentions légales',
    ml_updated: 'Dernière mise à jour : avril 2026',
    ml_publisher_title: 'Éditeur du site',
    ml_publisher_service: "Service d'aide administrative en ligne destiné aux résidents de Guyane française.",
    ml_email_label: 'Email :',
    ml_note_html: "Dok'péyi est actuellement <strong>en cours de constitution juridique</strong>. Les informations définitives (forme juridique, capital social, SIREN, numéro de TVA intracommunautaire) seront publiées dès immatriculation. L'activité opère à ce jour sous forme de projet porté par ses fondateurs.",
    ml_publication_title: 'Responsable de la publication',
    ml_publication_desc_html: '<strong>Marvin</strong> — responsable du contenu éditorial du site et de la relation publique.',
    ml_contact_label: 'Contact :',
    ml_host_title: 'Hébergeur',
    ml_host_country: 'San Francisco, CA 94104, États-Unis',
    ml_host_site: 'Site :',
    ml_ip_title: 'Propriété intellectuelle',
    ml_ip_p1: "L'ensemble du contenu du site (textes, graphismes, logo, icônes, images, code source, marques, interface, structure) est la propriété exclusive de Dok'péyi ou fait l'objet d'une autorisation d'usage.",
    ml_ip_p2: "Toute reproduction, représentation, modification, publication ou adaptation totale ou partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite préalable.",
    ml_ip_p3_html: "<strong>© 2026 Dok'péyi — Tous droits réservés.</strong>",
    ml_data_title: 'Données personnelles',
    ml_data_p1: 'Les données collectées via ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la Loi Informatique et Libertés.',
    ml_data_p2_html: 'Pour en savoir plus, consultez notre <a href="/confidentialite">Politique de confidentialité</a>.',
    ml_cookies_title: 'Cookies',
    ml_cookies_p1: "Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement. Aucun cookie publicitaire n'est déposé.",
    ml_cookies_p2_html: 'Détails : <a href="/cookies">Politique cookies</a>.',
    ml_law_title: 'Droit applicable',
    ml_law_p1_html: 'Les présentes mentions sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux français ; le tribunal compétent est celui de <strong>Cayenne (Guyane française)</strong>.',
    ml_contact_title: 'Contact',
    ml_contact_intro: 'Pour toute question relative au site ou à son contenu :',
    ml_footer_home: 'Accueil',
    cgv_nav_home: "Retour à l'accueil",
    cgv_title: 'Conditions Générales de Vente',
    cgv_updated: 'Dernière mise à jour : avril 2026',
    cgv_section_1_title: '1. Présentation du service',
    cgv_section_1_p1: "Dok'péyi est un service en ligne d'aide à la rédaction et à la préparation de documents administratifs destiné aux résidents de Guyane française et plus largement aux publics francophones confrontés à des démarches administratives françaises.",
    cgv_section_1_p2: "Le service propose la génération assistée par intelligence artificielle des documents suivants : CV, lettres de motivation, courriers officiels, dossiers administratifs, guides de titre de séjour, documents liés à l'impôt, dossiers de naturalisation.",
    cgv_section_1_p3: "Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'ensemble des relations entre Dok'péyi et ses clients.",
    cgv_section_2_title: '2. Tarifs',
    cgv_section_2_intro: "Les tarifs suivants s'entendent toutes taxes comprises, en euros, par document généré :",
    cgv_table_service: 'Service',
    cgv_table_price: 'Tarif',
    cgv_rate_cv: 'CV Professionnel',
    cgv_rate_lettre: 'Lettre de motivation',
    cgv_rate_courrier: 'Courrier officiel',
    cgv_rate_dossier: 'Dossier administratif (CAF, logement, aide sociale…)',
    cgv_rate_sejour: 'Titre de séjour (guide personnalisé)',
    cgv_rate_impot: "Avis d'impôt (compréhension, aide, courrier)",
    cgv_rate_naturalisation: 'Naturalisation (éligibilité, dossier, lettre)',
    cgv_cv_options_title: 'Options et suppléments CV',
    cgv_cv_options_intro: 'Les templates CV premium sont proposés en supplément du tarif CV de base :',
    cgv_table_template: 'Modèle CV',
    cgv_table_supplement: 'Supplément',
    cgv_cv_option_classic: 'Classique (inclus par défaut)',
    cgv_cv_option_corporate: 'Corporate',
    cgv_cv_option_impact: 'Impact',
    cgv_cv_option_elite: 'Élite',
    cgv_cv_option_prestige: 'Prestige',
    cgv_cv_option_executive: 'Executive',
    cgv_other_options_title: 'Autres options',
    cgv_other_option_translation_html: '<strong>Traduction du document</strong> (anglais, créole, portugais) : <span class="price">+3 €</span>',
    cgv_other_option_mods_html: '<strong>Modifications supplémentaires</strong> — <strong>2 modifications sont offertes</strong> sur chaque document après prévisualisation. Au-delà, le tarif applicable sera communiqué avant toute facturation et nécessitera l’accord explicite du client.',
    cgv_section_3_title: '3. Commande et paiement',
    cgv_section_3_p1: "La commande s'effectue via l'interface du site (service.html) en trois étapes : choix du service, saisie des informations, paiement.",
    cgv_section_3_p2_html: 'Le paiement s’effectue en ligne de manière sécurisée via <strong>Stripe</strong>. Les paiements manuels par <strong>PayPal</strong> et <strong>Mobile Money (Momo)</strong> sont également disponibles sur demande.',
    cgv_section_3_p3: 'Les données bancaires ne transitent jamais par les serveurs de Dok’péyi : elles sont traitées directement par le prestataire de paiement.',
    cgv_section_4_title: '4. Délai de livraison',
    cgv_section_4_p1_html: 'La génération du document par intelligence artificielle est <strong>quasi-instantanée</strong> (quelques secondes). Le document est prévisualisable dès la fin de la génération.',
    cgv_section_4_p2_html: 'Pour les services nécessitant une vérification manuelle par un membre de l’équipe (<strong>Titre de séjour</strong>, <strong>Naturalisation</strong>), la livraison finale intervient dans un délai de <strong>24 à 48 heures</strong> après validation administrative, par email.',
    cgv_section_4_p3_html: 'Pour les autres services, la livraison intervient <strong>immédiatement</strong> après confirmation du paiement, par email ou téléchargement direct.',
    cgv_section_5_title: '5. Politique de remboursement',
    cgv_refund_intro: "Conformément à l'article L.221-28 du Code de la consommation, le client bénéficie des garanties suivantes :",
    cgv_refund_delay_html: '<strong>Document non livré sous 72h</strong> après paiement (hors cas où le client a demandé un délai ou n’a pas répondu aux sollicitations de l’équipe) : remboursement intégral sur demande.',
    cgv_refund_error_html: '<strong>Document manifestement erroné ou inexploitable</strong> : correction prioritaire gratuite ou, en cas d’impossibilité, remboursement partiel ou intégral selon les cas.',
    cgv_refund_tech_html: '<strong>Erreur technique ou double facturation</strong> : remboursement intégral sous 14 jours.',
    cgv_refund_request_html: 'Toute demande de remboursement doit être adressée à <a href="mailto:contact@dok-peyi.fr">contact@dok-peyi.fr</a> en précisant le numéro de commande et le motif.',
    cgv_retract_title: '6. Droit de rétractation',
    cgv_retract_p1_html: 'En application de l’article L.221-18 du Code de la consommation, le client dispose d’un délai de <strong>14 jours calendaires</strong> à compter de la confirmation de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motif.',
    cgv_retract_p2_html: '<strong>Exception — article L.221-28 13° du Code de la consommation :</strong> le droit de rétractation ne peut s’exercer pour les contrats de fourniture d’un <strong>contenu numérique non fourni sur un support matériel</strong> dont l’exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation. En validant sa commande, le client reconnaît que le document sera livré immédiatement et renonce à son droit de rétractation pour ce contenu.',
    cgv_retract_p3: "Le droit de rétractation demeure applicable si le document n'a pas été livré dans les délais prévus (article 4).",
    cgv_ai_title: "7. Avertissement sur l'intelligence artificielle",
    cgv_disclaimer_html: '<strong>⚠️ Disclaimer IA — à lire attentivement</strong><br><br>Les documents générés par intelligence artificielle sont fournis à titre d’aide à la rédaction. Ils ne constituent pas un conseil juridique professionnel.<br><br>Pour les démarches complexes (<strong>titre de séjour, naturalisation, contentieux fiscal, recours administratif</strong>), nous recommandons fortement de consulter un professionnel du droit (avocat) ou une association spécialisée — notamment <strong>la CIMADE Guyane</strong> (aide gratuite aux étrangers) ou un point d’accès au droit.<br><br>Dok’péyi décline toute responsabilité en cas d’utilisation non vérifiée d’un document généré pour une démarche officielle.',
    cgv_liability_title: '8. Responsabilité',
    cgv_liability_p1: 'Dok’péyi met tout en œuvre pour assurer la qualité des documents produits. Toutefois, le client reste responsable de la vérification et de l’utilisation des documents remis.',
    cgv_liability_p2: 'Dok’péyi ne saurait être tenu responsable :',
    cgv_liability_li1: 'des conséquences d’informations inexactes fournies par le client ;',
    cgv_liability_li2: 'du rejet d’une démarche administrative par l’administration compétente ;',
    cgv_liability_li3: 'd’une interruption temporaire du service liée à l’hébergeur ou aux services tiers ;',
    cgv_liability_li4: 'd’une mauvaise utilisation du document par le client ou un tiers.',
    cgv_data_title: '9. Protection des données personnelles',
    cgv_data_p1_html: 'Dok’péyi collecte et traite les données personnelles des clients conformément au RGPD. Pour le détail des traitements, finalités, durées de conservation et droits du client, consultez la <a href="/confidentialite">Politique de confidentialité</a>.',
    cgv_changes_title: '10. Modification des CGV',
    cgv_changes_p1: 'Dok’péyi se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de passation de la commande. Toute modification substantielle sera notifiée par email aux clients concernés.',
    cgv_jurisdiction_title: '11. Droit applicable et juridiction compétente',
    cgv_jurisdiction_p1_html: 'Les présentes CGV sont soumises au <strong>droit français</strong>.',
    cgv_jurisdiction_p2_html: 'À défaut de résolution amiable, tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive du <strong>Tribunal judiciaire de Cayenne</strong>.',
    cgv_jurisdiction_p3: "Conformément à l'article L.612-1 du Code de la consommation, le client consommateur a la possibilité de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige. Les coordonnées du médiateur seront communiquées sur demande.",
    cgv_contact_title: '12. Contact',
    cgv_contact_intro: 'Pour toute question relative aux présentes CGV ou à une commande :',
    cgv_footer_home: 'Accueil',
    conf_nav_home: "Retour à l'accueil",
    conf_title: 'Politique de confidentialité',
    conf_updated: 'Dernière mise à jour : avril 2026 — Conforme au Règlement (UE) 2016/679 (RGPD) et à la Loi Informatique et Libertés',
    conf_controller_title: '1. Responsable du traitement',
    conf_controller_service: "<strong>Dok'péyi</strong> — service d'aide administrative en ligne pour la Guyane française.",
    conf_controller_desc: "Dok'péyi détermine les finalités et les moyens du traitement des données personnelles collectées sur le site.",
    conf_data_categories_title: '2. Données collectées',
    conf_data_categories_intro: "Dans le cadre de la fourniture du service, Dok'péyi collecte les catégories de données suivantes :",
    conf_identity_title: "Données d'identification et de contact",
    conf_identity_li1: 'Nom, prénom',
    conf_identity_li2: 'Adresse email',
    conf_identity_li3: 'Numéro de téléphone (WhatsApp)',
    conf_request_title: 'Données liées à la demande',
    conf_request_li1: 'Situation administrative (durée de résidence, nationalité, visa, situation familiale, situation professionnelle, revenus…)',
    conf_request_li2: 'Informations professionnelles (poste, expériences, formations, compétences) pour les CV et lettres',
    conf_request_li3_html: "Documents téléversés par l'utilisateur pour pré-remplissage (PDF ou image analysés par <code>/api/extract-doc</code>)",
    conf_request_li4: 'Documents générés (CV, lettres, courriers, dossiers, guides)',
    conf_payment_title: 'Données de paiement',
    conf_payment_p1_html: "Les données bancaires (numéro de carte, cryptogramme…) <strong>ne transitent jamais par les serveurs de Dok'péyi</strong>. Elles sont traitées directement par notre prestataire de paiement (Stripe). Dok'péyi conserve uniquement l'identifiant de transaction et le montant payé pour des besoins comptables et de suivi.",
    conf_technical_title: 'Données techniques',
    conf_technical_li1: 'Adresse IP (utilisée pour le rate-limiting, non stockée durablement)',
    conf_technical_li2: 'Type de navigateur et appareil',
    conf_technical_li3: 'Horodatage des actions sur le site',
    conf_purposes_title: '3. Finalités et bases légales',
    conf_table_purpose: 'Finalité',
    conf_table_basis: 'Base légale',
    conf_purpose_1: 'Génération du document commandé (CV, lettre, dossier…)',
    conf_basis_1: 'Exécution du contrat (art. 6.1.b RGPD)',
    conf_purpose_2: 'Facturation et suivi des commandes',
    conf_basis_2: 'Exécution du contrat + obligation légale',
    conf_purpose_3: 'Relation client et support',
    conf_basis_3: 'Exécution du contrat',
    conf_purpose_4: 'Sécurité du service (rate-limiting, lutte anti-fraude)',
    conf_basis_4: 'Intérêt légitime (art. 6.1.f RGPD)',
    conf_purpose_5: 'Obligations comptables et fiscales',
    conf_basis_5: 'Obligation légale (art. 6.1.c RGPD)',
    conf_retention_title: '4. Durée de conservation',
    conf_retention_li1_html: '<strong>Données de commande et documents générés :</strong> 12 mois après la dernière commande, puis suppression ou archivage anonymisé.',
    conf_retention_li2_html: '<strong>Données de facturation :</strong> 10 ans (obligation comptable française).',
    conf_retention_li3_html: '<strong>Données techniques (rate-limit, logs) :</strong> maximum 12 mois glissants.',
    conf_retention_li4_html: '<strong>Préférences cookies :</strong> 30 jours (stockage local navigateur).',
    conf_processors_title: '5. Destinataires et sous-traitants',
    conf_processors_intro: "Dok'péyi recourt aux sous-traitants suivants pour fournir le service. Chacun est engagé par un contrat de sous-traitance (DPA) conforme à l'article 28 du RGPD lorsque applicable :",
    conf_table_processor: 'Sous-traitant',
    conf_table_role: 'Rôle',
    conf_table_location: 'Localisation',
    conf_proc_1_role: 'Génération de texte par IA',
    conf_proc_1_location: 'États-Unis (clauses contractuelles types)',
    conf_proc_2_role: 'Chat IA interne (fallback)',
    conf_proc_2_location: 'États-Unis (clauses contractuelles types)',
    conf_proc_3_role: 'Hébergement du site et des Edge Functions',
    conf_proc_3_location: 'États-Unis (clauses contractuelles types)',
    conf_proc_4_role: 'Traitement des paiements par carte',
    conf_proc_4_location: 'Irlande / États-Unis',
    conf_proc_5_role: 'Base de données Realtime (commandes)',
    conf_proc_5_location: 'UE — europe-west1',
    conf_proc_6_role: 'Envoi des emails transactionnels',
    conf_proc_6_location: 'États-Unis (clauses contractuelles types)',
    conf_processors_p1_html: 'Les transferts de données hors UE vers les États-Unis sont encadrés par les <strong>Clauses Contractuelles Types</strong> de la Commission européenne et, le cas échéant, par le <strong>Data Privacy Framework</strong>.',
    conf_processors_p2: "Aucune donnée personnelle n'est vendue, louée ou cédée à des fins commerciales à un tiers.",
    conf_rights_title: '6. Vos droits',
    conf_rights_intro_html: 'En tant que personne concernée, vous disposez des droits suivants :',
    conf_rights_li1_html: '<strong>Droit d’accès</strong> — obtenir la confirmation que vos données sont traitées et une copie de celles-ci.',
    conf_rights_li2_html: '<strong>Droit de rectification</strong> — faire corriger des données inexactes ou incomplètes.',
    conf_rights_li3_html: '<strong>Droit à l’effacement</strong> — demander la suppression de vos données (« droit à l’oubli ») sous conditions.',
    conf_rights_li4_html: '<strong>Droit à la limitation</strong> — demander la suspension du traitement dans certains cas.',
    conf_rights_li5_html: '<strong>Droit d’opposition</strong> — vous opposer à un traitement fondé sur l’intérêt légitime.',
    conf_rights_li6_html: '<strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré et lisible.',
    conf_rights_li7_html: '<strong>Droit de retirer votre consentement</strong> à tout moment (pour les traitements fondés sur le consentement).',
    conf_rights_li8_html: '<strong>Droit de définir des directives post-mortem</strong> relatives à vos données.',
    conf_rights_request_html: 'Pour exercer ces droits, adressez votre demande par email à <a href="mailto:contact@dok-peyi.fr">contact@dok-peyi.fr</a> en précisant votre identité. Une réponse vous sera apportée dans un délai maximum d’<strong>un mois</strong>.',
    conf_dpo_title: '7. Délégué à la protection des données (DPO)',
    conf_dpo_p1: "Dok'péyi n'est pas légalement tenu de désigner un DPO mais a désigné un point de contact privilégié pour toutes les questions relatives à la protection des données :",
    conf_security_title: '8. Sécurité des données',
    conf_security_intro: "Dok'péyi met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la destruction, la perte, l'altération ou la divulgation non autorisée :",
    conf_security_li1: 'Chiffrement des données en transit (HTTPS / TLS)',
    conf_security_li2: "Règles de sécurité Firebase (contrôle d'accès par rôle)",
    conf_security_li3: 'Headers HTTP de sécurité (CSP, HSTS, X-Frame-Options…)',
    conf_security_li4: 'Authentification des comptes administrateurs avec protection anti-force brute',
    conf_security_li5: 'Rate-limiting sur les API sensibles',
    conf_security_li6: 'Vérification de signature (HMAC-SHA256) sur les webhooks de paiement',
    conf_authority_title: '9. Autorité de contrôle',
    conf_authority_p1: "Conformément à l'article 77 du RGPD, vous disposez du droit d'introduire une réclamation auprès de l'autorité de contrôle française :",
    conf_authority_phone: 'Téléphone : 01 53 73 22 22',
    conf_authority_site: 'Site :',
    conf_changes_title: '10. Modifications de la politique',
    conf_changes_p1: "Dok'péyi peut être amené à modifier la présente politique de confidentialité. Toute modification substantielle sera notifiée sur le site ou par email. La version applicable est celle en vigueur à la date de votre dernière commande.",
    conf_contact_title: '11. Contact',
    conf_contact_intro: 'Pour toute question relative à la présente politique ou au traitement de vos données personnelles :',
    conf_footer_home: 'Accueil',
    cookies_nav_home: "Retour à l'accueil",
    cookies_title: 'Politique cookies',
    cookies_updated: 'Dernière mise à jour : avril 2026',
    cookies_summary_html: "<strong>🍪 En résumé — Dok'péyi est sobre en cookies :</strong><br>Seuls des cookies <strong>strictement nécessaires</strong> au fonctionnement du service sont utilisés. Aucun cookie publicitaire, aucun tracker tiers, aucun partage avec des régies publicitaires.",
    cookies_definition_title: "1. Qu'est-ce qu'un cookie ?",
    cookies_definition_p1: 'Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) par le navigateur lorsque vous visitez un site. Il permet au site de mémoriser des informations sur votre visite (langue, session, préférences).',
    cookies_definition_p2_html: "Dok'péyi utilise également d'autres technologies similaires : <code>localStorage</code> (stockage local du navigateur) et <code>sessionStorage</code> (stockage de session, effacé à la fermeture de l'onglet).",
    cookies_used_title: "2. Cookies utilisés sur Dok'péyi",
    cookies_used_intro: 'Seuls les cookies suivants, tous strictement nécessaires au fonctionnement du service, sont utilisés :',
    cookies_table_name: 'Nom',
    cookies_table_purpose: 'Finalité',
    cookies_table_duration: 'Durée',
    cookies_table_type: 'Type',
    cookies_cookie_ok_purpose: "Mémoriser votre acceptation de la bannière cookies",
    cookies_cookie_ok_duration: '30 jours',
    cookies_cookie_draft_purpose: 'Sauvegarde temporaire du formulaire de commande (wizard)',
    cookies_cookie_draft_duration: "Session (fermeture de l'onglet)",
    cookies_cookie_lang_purpose: "Mémoriser la langue choisie pour l'interface",
    cookies_cookie_lang_duration: '1 an',
    cookies_cookie_stripe_name: 'Cookies Stripe',
    cookies_cookie_stripe_purpose: 'Sécurisation de la session de paiement (déposés uniquement pendant le paiement par Stripe)',
    cookies_cookie_stripe_duration: 'Session',
    cookies_cookie_stripe_type: 'Tiers strictement nécessaire',
    cookies_we_do_not_title: '3. Ce que nous ne faisons pas',
    cookies_we_do_not_li1: '❌ Aucun cookie publicitaire, aucun ciblage comportemental',
    cookies_we_do_not_li2: '❌ Aucun cookie tiers à des fins de tracking (Google Analytics, Facebook Pixel, etc.)',
    cookies_we_do_not_li3: '❌ Aucune revente ou partage de données avec des régies publicitaires',
    cookies_we_do_not_li4: '❌ Aucun profilage à des fins commerciales',
    cookies_consent_title: '4. Consentement',
    cookies_consent_p1: "Conformément à la réglementation (RGPD, directive ePrivacy, recommandations CNIL), les cookies strictement nécessaires au fonctionnement d'un service demandé par l'utilisateur ne requièrent pas de consentement préalable.",
    cookies_consent_p2_html: "Néanmoins, Dok'péyi affiche une bannière d'information lors de votre première visite pour vous informer de l'utilisation de ces cookies. En cliquant sur « J'accepte », vous confirmez en avoir pris connaissance. La bannière n'apparaîtra plus sur vos visites suivantes.",
    cookies_manage_title: '5. Comment gérer les cookies ?',
    cookies_manage_intro: 'Vous pouvez à tout moment supprimer les cookies déjà déposés ou empêcher leur dépôt via les paramètres de votre navigateur :',
    cookie_text: "🍪 Dok'péyi utilise des cookies nécessaires au fonctionnement du service. Aucun cookie publicitaire.",
    cookie_learn_more: 'En savoir plus',
    cookie_accept: "J'accepte",
    update_available: 'Nouvelle version disponible',
    update_refresh: 'Actualiser',
  },

  /* ─────────── AUTRES LANGUES (non modifiées) ─────────── */
  /* Les clés manquantes dans les autres langues tombent en fallback FR automatiquement */
  pt: {},
  ht: {},
  nl: {},
    ar: {},
  en: {},
  gcr: {},
};

/* ===== MOTEUR I18N (inchangé) ===== */
(function () {
  'use strict';

  const DEFAULT_LANG = 'fr';
  let currentLang = DEFAULT_LANG;

  function getLang() {
    try { return localStorage.getItem('dok_lang') || DEFAULT_LANG; } catch { return DEFAULT_LANG; }
  }

  function setLang(code) {
    currentLang = LANGS.find(l => l.code === code) ? code : DEFAULT_LANG;
    try { localStorage.setItem('dok_lang', currentLang); } catch {}
    applyTranslations();
    updateLangUI();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = LANGS.find(l => l.code === currentLang)?.dir || 'ltr';
  }

  function t(key, lang, fallback) {
    const l = lang || currentLang;
    return T[l]?.[key] || T[DEFAULT_LANG]?.[key] || fallback || key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
  }

  function updateLangUI() {
    const btn = document.getElementById('lang-btn');
    if (btn) {
      const l = LANGS.find(x => x.code === currentLang);
      btn.textContent = l ? `${l.flag} ${l.code.toUpperCase()}` : 'FR';
    }
    document.querySelectorAll('[data-lang-option]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-lang-option') === currentLang);
    });
  }

  function buildLangMenu() {
    const container = document.getElementById('lang-menu');
    if (!container) return;
    container.innerHTML = LANGS.map(l =>
      `<button class="lang-option" data-lang-option="${l.code}" onclick="DokPeyiI18n.setLang('${l.code}')">${l.flag} <span>${l.native}</span></button>`
    ).join('');
  }

  function init() {
    buildLangMenu();
    setLang(getLang());
  }

  window.DokPeyiI18n = { setLang, t, getLang };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
