# illenium-appearance — Novyra Studio (ESX)

Version de base : illenium-appearance v5.7.0, avec une **nouvelle interface** (dossier `web/dist`).
Aucun fichier Lua n'a été modifié, sauf `locales/fr.lua` (traductions) et `fxmanifest.lua`
(ajout des fichiers CSS et PNG).

## 1. Dépendances

- `es_extended` (ESX Legacy)
- `oxmysql`
- `ox_lib`

## 2. Retirer les anciennes ressources de skin

illenium-appearance remplace `skinchanger` et `esx_skin` (il reprend leurs événements).
Retire ou commente-les dans le `server.cfg` :

```cfg
# ensure skinchanger
# ensure esx_skin
```

## 3. Base de données

Importe ces fichiers dans ta base (HeidiSQL, phpMyAdmin...) :

- `sql/player_outfits.sql`
- `sql/player_outfit_codes.sql`
- `sql/management_outfits.sql`

Sous ESX, le skin est enregistré dans la colonne `skin` de la table `users`
(`playerskins.sql` ne sert qu'à QBCore).

## 4. server.cfg

Ordre de démarrage :

```cfg
ensure oxmysql
ensure ox_lib
ensure es_extended
ensure illenium-appearance

# Interface et textes en français
setr illenium-appearance:locale "fr"
```

## 5. Récupérer les anciens skins (esx_skin)

Si tes joueurs ont déjà des personnages créés avec esx_skin, lance une fois cette commande
en jeu en étant admin :

```
/migrateskins
```

Fais une sauvegarde de la table `users` avant.

## 6. Personnaliser l'interface

- **Couleurs** : en haut de `web/dist/assets/style.css` (variables `--accent`, `--panel`, `--text`...).
- **Logo** : `web/dist/assets/logo-n.png`.
- **Nom affiché** : `Novyra` / `Studio` dans `web/dist/index.html` (classe `brand`).
- **Textes** : `locales/fr.lua`, section `UI`.
- **Rotation** : touches `Q`/`A` et `D`. `Échap` ouvre la fenêtre pour quitter.

Les prix, magasins, blips et sections affichées se règlent toujours dans `shared/config.lua`.
