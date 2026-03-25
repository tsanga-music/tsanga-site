# TSANGA — Design System

> Version 1.0 · Mars 2026 · Mobile-first · Tailwind CSS v3

---

## 1. Aesthetic

Sombre, cinématographique, minimal. Site artiste pour **TSANGA** (artiste électronique basé à Bruxelles). Fond noir profond avec lueurs électriques bleues et rouges. Police condensée ultra-distinctive. Zéro décoration superflue — chaque élément justifie sa présence.

---

## 2. Palette de couleurs

| Token            | Valeur                        | Usage                                   |
|------------------|-------------------------------|-----------------------------------------|
| `--bg`           | `#04040a`                     | Fond global (noir avec teinte bleue)    |
| `--glow-blue`    | `#4a8fff`                     | Accent primaire — CTA, lignes, lueurs   |
| `--glow-red`     | `#ff3060`                     | Accent secondaire — badges, danger      |
| `--text`         | `#ffffff`                     | Texte principal                         |
| Text secondary   | `rgba(255,255,255,0.6)`        | Corps, sous-titres                      |
| Text muted       | `rgba(255,255,255,0.35)`       | Labels, dates, métadonnées              |
| Text faint       | `rgba(255,255,255,0.25)`       | Placeholders, indicateurs discrets      |
| Border subtle    | `rgba(255,255,255,0.05)`       | Séparateurs, cards                      |
| Border default   | `rgba(255,255,255,0.10–0.18)`  | Boutons, inputs                         |
| Border active    | `rgba(74,143,255,0.5–0.6)`     | Focus, hover actif                      |
| Muted text color | `rgba(212,216,240,0.35–0.6)`   | Crédits, liens Instagram                |

### Glows animés (hover)

- **Cycle chromatique** : bleu `#4a8fff` → violet `#8c3cff` → rouge `#ff2860` → cyan `#28d2ff` → bleu
- Animation : `btn-glow-cycle`, 3s linear infinite, sur `button:hover` et `a:hover`

---

## 3. Typographie

### Police principale

```
font-family: 'Berliner Condensed', 'Arial Narrow', sans-serif
```

Police condensée chargée via `@font-face` depuis `src/assets/fonts/berliner-condensed.ttf`. Appliquée **globalement** via `* { font-family: ... !important }`.

### Échelle typographique

| Rôle              | Taille                          | Poids | Letter-spacing | Line-height |
|-------------------|---------------------------------|-------|----------------|-------------|
| Display / H1      | `clamp(4rem, 10vw, 9rem)`       | 300   | `0.04em`       | `0.9`       |
| Section H2        | `clamp(4rem, 10vw, 9rem)`       | 300   | `0.04em`       | `0.9`       |
| Tagline           | `clamp(1rem, 3vw, 1.4rem)`      | 300   | `0.04em`       | —           |
| Body              | `0.85rem – 1rem`                | 400   | `0.04em`       | —           |
| Label / Caps      | `0.65rem`                       | 400   | `0.08–0.12em`  | —           |
| Micro             | `0.58–0.62rem`                  | 400   | `0.08–0.1em`   | —           |
| Navbar links      | `1.1rem`                        | 400   | `0.04em`       | —           |
| Clock             | `1rem`                          | 400   | `0.06em`       | —           |

> **Règle globale** : `text-transform: none !important` — Berliner Condensed est déjà condensée, pas besoin d'uppercase.

---

## 4. Espacement (Spacing Scale)

### Tokens CSS

```css
--section-px-mobile:  1.5rem;     /* < 640px  */
--section-px-tablet:  3rem;       /* 640–1024px */
--section-px-desktop: clamp(3rem, 6vw, 5rem);  /* > 1024px */
--section-py:         clamp(5rem, 10vw, 8rem);
```

### Classe `.section-pad`

```css
/* Mobile (default) */  padding: 5rem 1.5rem;
/* sm: 640px  */        padding: 5rem 3rem;
/* lg: 1024px */        padding: clamp(5rem,10vw,8rem) clamp(3rem,6vw,5rem);
```

### Gaps de composants

| Contexte                  | Mobile       | Desktop      |
|---------------------------|--------------|--------------|
| DateRow : gap interne     | `0.5rem`     | `1.2–1.5rem` |
| Gallery grid : gap        | `0.75rem`    | `1rem`       |
| Music embeds : gap        | `1rem`       | `1rem`       |
| Section title : mb        | `4rem`       | `4rem`       |
| Accent line : mb          | `1.2rem`     | `1.2rem`     |
| Hero CTA : gap            | `0.75rem`    | `1.2rem`     |

---

## 5. Breakpoints (Tailwind v3)

| Breakpoint | Valeur  | Usage principal                                    |
|------------|---------|----------------------------------------------------|
| `sm:`      | 640px   | Hero CTA en ligne, DateRow 4-col, credits en ligne |
| `md:`      | 768px   | Navbar desktop, contact 2-col, Music EP side-by-side |
| `lg:`      | 1024px  | Paddings desktop, gallery auto-fill large          |
| `xl:`      | 1280px  | (réservé — large desktop)                          |

Configurés dans `tailwind.config.js` :

```js
screens: {
  sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
}
```

---

## 6. Composants

### Boutons

```css
/* Primaire (CTA bleu) */
background: transparent;
border: 1px solid rgba(74,143,255,0.5);
border-radius: 2px;
padding: 1rem 2.5rem;
color: #fff;
hover → background: rgba(74,143,255,0.2); border-color: #4a8fff;

/* Secondaire (outline blanc) */
border: 1px solid rgba(255,255,255,0.12);
color: rgba(255,255,255,0.6);
hover → background: rgba(255,255,255,0.05);
```

### Inputs / Textarea

```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 3px;
padding: 0.9rem 1rem;
focus → border-color: rgba(74,143,255,0.6);
label focus → color: #4a8fff;
```

### Cards / Rows

```css
border: 1px solid rgba(255,255,255,0.05);
border-radius: 4px;
background: transparent;
hover → background: rgba(74,143,255,0.04); border-color: rgba(74,143,255,0.18);
```

### Badge de statut

| Statut     | Background                  | Couleur texte       | Bordure                   |
|------------|-----------------------------|---------------------|---------------------------|
| on sale    | `rgba(255,255,255,0.05)`     | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.15)` |
| sold out   | `rgba(255,80,80,0.10)`       | `#ff5050`           | `rgba(255,80,80,0.3)`     |
| annoncé    | `rgba(180,180,180,0.08)`     | `rgba(255,255,255,0.4)` | `rgba(255,255,255,0.12)` |

### Badge EXCLUSIF

```css
background: rgba(255,40,90,0.85);
border-radius: 3px;
box-shadow: 0 0 12px rgba(255,40,90,0.5);
font-size: 0.58rem;
letter-spacing: 0.1em;
```

### Ligne d'accent de section

```css
width: 48px;
height: 1px;
background: #4a8fff;
transform-origin: left;
animation: scaleX 0 → 1 on enter
```

### Scrollbar

```css
width: 4px;
thumb: rgba(255,255,255,0.12);
thumb:hover: rgba(255,255,255,0.25);
```

---

## 7. Layouts responsive par section

### Navbar
| Breakpoint | Layout |
|------------|--------|
| < md (768px) | Logo + panier + hamburger. Menu mobile en overlay animé |
| ≥ md (768px) | Logo + liens desktop + horloge Bruxelles + langue + panier |

### Hero
| Breakpoint | Layout |
|------------|--------|
| < 480px | CTAs en colonne, pleine largeur |
| ≥ 480px | CTAs côte à côte `flex-direction: row` |

### Gallery
| Breakpoint | Layout |
|------------|--------|
| < 480px | 1 colonne, `grid-auto-rows: 240px` |
| 480–768px | 2 colonnes |
| ≥ 768px | `repeat(auto-fill, minmax(240px, 1fr))` |

### Music
| Breakpoint | Layout |
|------------|--------|
| < md | Pochette vinyle + player EP empilés (colonne) |
| ≥ md | Pochette gauche, player droite (flex-row) |
| Embeds | 1 col mobile → auto-fill 300px min sur sm+ |

### Lives / DateRow
| Breakpoint | Layout |
|------------|--------|
| < 640px | Grille 2×2 : [date \| status badge] / [city+venue \| tickets] |
| ≥ 640px | Grille 4-col : [date] [city+venue] [status] [tickets] |

### Contact
| Breakpoint | Layout |
|------------|--------|
| < md | 1 colonne : infos → formulaire |
| ≥ md | 2 colonnes égales |

---

## 8. Animations

| Nom                | Trigger         | Durée  | Description                                |
|--------------------|-----------------|--------|--------------------------------------------|
| `btn-glow-cycle`   | `button:hover`  | 3s ∞   | Glow drop-shadow bleu→violet→rouge→cyan    |
| `nav-logo-cycle`   | `.nav-logo:hover` | 3s ∞  | Hue-rotate bleu→violet→rouge→cyan         |
| Logo reveal        | Mount           | 2.2s   | Clip-path + opacity + glitch               |
| Section H2         | inView          | 0.8s   | `y: 20→0, opacity: 0→1`                   |
| Accent line        | inView          | 0.8s   | `scaleX: 0→1`                             |
| DateRow            | inView          | 0.7s   | `x: -30→0, opacity: 0→1`, staggered 80ms  |
| Gallery items      | inView          | 0.9s   | `y: 40→0, opacity: 0→1`, staggered 100ms  |
| VinylFlip          | Mount           | 5.5s ∞ | Lévitation `y: 0→-12→0`                   |
| Pochette flip      | Click           | 0.85s  | `rotateY: 0→180`                          |
| MistCanvas         | Always          | —      | Canvas WebGL brouillard ambiant            |

---

## 9. Fichiers clés

| Fichier                               | Rôle                                    |
|---------------------------------------|-----------------------------------------|
| `src/index.css`                       | Tokens CSS, Tailwind, toutes les classes responsive |
| `tailwind.config.js`                  | Config Tailwind v3 — content paths, couleurs, breakpoints |
| `src/assets/fonts/berliner-condensed.ttf` | Police display unique                |
| `src/components/sections/*.js`        | Sections — utilisent classes CSS responsive |
| `src/components/layout/Navbar.js`     | `.desktop-nav` / `.mobile-menu-btn`     |

---

## 10. Règles de cohérence

1. **Jamais de `text-transform: uppercase`** — la font gère la condensation
2. **`letter-spacing: 0.04em` minimum** partout
3. **Animations uniquement via Framer Motion** (pas de CSS `transition` sur les propriétés animées)
4. **Pas de couleurs en dur** dans les composants — utiliser les variables CSS ou les rgba documentés ci-dessus
5. **Mobile-first** : écrire les styles base pour mobile, surcharger pour md/lg
6. **Images intouchables** — `objectFit: 'cover'` sur tous les `<img>`, pas de crop, pas de filtre
