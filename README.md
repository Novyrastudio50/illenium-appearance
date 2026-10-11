# 🎭 Illenium Appearance — Novyra Studio

![FiveM](https://img.shields.io/badge/FiveM-Resource-orange)
![Framework](https://img.shields.io/badge/Framework-ESX%20%7C%20QBCore-blue)
![Language](https://img.shields.io/badge/Language-Lua-purple)
![Status](https://img.shields.io/badge/Status-Development-yellow)

## 📖 Présentation

**Illenium Appearance — Novyra Studio** est une ressource de personnalisation de personnages pour les serveurs FiveM.

Elle permet aux joueurs de personnaliser leur apparence, leurs vêtements et leurs accessoires grâce à une interface intuitive.

Ce dépôt contient une version basée sur le projet **illenium-appearance** original.

## ✨ Fonctionnalités

- 👤 Création et personnalisation de personnages
- 👕 Modification des vêtements
- 💇 Personnalisation des cheveux et du visage
- 🎭 Gestion des accessoires
- 💾 Sauvegarde des apparences
- 👔 Gestion des tenues
- 🌍 Traductions multilingues, dont le français
- 🖥️ Interface web intégrée
- ⚙️ Configuration personnalisable

## 🛠️ Compatibilité

Le projet contient des intégrations pour :

- ESX
- QBCore
- ox_core

La compatibilité effective dépend de la version et de la configuration de ton serveur.

## 📦 Installation

### 1. Télécharger le script

Télécharge les fichiers depuis le dépôt :

https://github.com/Novyrastudio50/illenium-appearance

Clique sur **Code → Download ZIP**.

### 2. Installer la ressource

Décompresse l'archive puis place le dossier dans :

`resources/[local]/illenium-appearance`

### 3. Installer les dépendances

Vérifie les dépendances requises dans `fxmanifest.lua` et `shared/config.lua`.

Installe notamment les ressources nécessaires à ton framework et à la connexion à la base de données.

### 4. Configurer la base de données

Les fichiers SQL sont disponibles dans :

`sql/`

Sauvegarde ta base de données avant d'importer les tables nécessaires.

### 5. Configurer le serveur

Ajoute dans ton `server.cfg`, après les dépendances :

```cfg
ensure illenium-appearance
```

### 6. Configurer le script

Ouvre :

`shared/config.lua`

Adapte les paramètres à ton serveur FiveM.

## 📁 Structure du projet

```text
illenium-appearance/
├── client/
├── server/
├── shared/
├── game/
├── locales/
├── sql/
├── web/
│   └── dist/
├── fxmanifest.lua
├── INSTALLATION-ESX.md
└── README.md
```

## 🇫🇷 Traduction française

La traduction française est disponible dans :

`locales/fr.lua`

Configure la langue selon les paramètres prévus par le script.

## 🧪 Tests

Cette version doit être testée sur un serveur FiveM avant son utilisation en production.

Vérifie notamment la création du personnage, l'enregistrement des apparences, les vêtements, les tenues et la compatibilité avec ton framework.

## 👨‍💻 Novyra Studio

**Personnalisation et distribution : Novyra Studio**

GitHub : https://github.com/Novyrastudio50

Projet : https://github.com/Novyrastudio50/illenium-appearance

## ❤️ Crédits

Projet original : **iLLeniumStudios / illenium-appearance**

https://github.com/iLLeniumStudios/illenium-appearance

Merci aux développeurs et contributeurs du projet original.

Les droits, crédits et conditions de licence d'origine doivent être respectés.

---

**Novyra Studio — Développement et personnalisation FiveM**
