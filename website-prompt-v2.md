# Marta Beauty Zurich — Complete Website Build Prompt

> **For the AI building this site:** Read this entire document before writing a single line of code.
> All brand copy, colors, services, and prices below are extracted from the official source documents.
> Do not invent, paraphrase, or replace any of it unless explicitly marked as a placeholder.

---

## 1. Business overview

**Business name:** Marta Beauty Zurich  
**Owner:** Marta Fantozzi  
**Tagline (exact wording):** *Be your first priority.*  
**Base:** Pfäffikon ZH, Switzerland  
**Service area:** Greater Zurich (at-home / at-office in-person) + fully online worldwide  
**Languages:** Italian (primary) and English — the entire site **must be fully bilingual** (IT + EN), with a language toggle on every page. Every heading, paragraph, button label, form field, error message, alt text, and meta tag must exist in both languages.  
**Instagram:** @marta_beautyzurich  

### What the business does

Marta offers two complementary types of service:

1. **Online wellness programs** — multi-week personalized journeys combining skincare consultancy, nutrition guidance, and mind-body support. Fully remote, accessible worldwide. Four tiers, two tracks (see Section 5).
2. **In-person treatments in Zurich** — individual bookable sessions of massage, body, and facial treatments delivered at the client's home or office. Separate from the programs (see Section 6).

### Philosophy

> *"Poco ma buono"* — quality, not quantity. Personalized consultations that value simplicity and authentic well-being. The skin as a mirror of a woman's overall health.

---

## 2. Brand identity

### Colors (derived entirely from the logo)

The logo is a black MF monogram on a warm parchment background. The palette must stay true to this — monochrome with one soft dusty-rose accent.

| Variable | Value | Use |
|----------|-------|-----|
| `--color-bg` | `#F0EBE3` | Warm parchment — hero sections, section alternation |
| `--color-bg-white` | `#FFFFFF` | Primary page background, cards, modals |
| `--color-bg-muted` | `#FAF8F5` | Slightly warm white for alternating sections |
| `--color-text` | `#1A1A1A` | Body text, headings |
| `--color-text-secondary` | `#6B6560` | Captions, secondary copy, metadata |
| `--color-accent` | `#C9A0A0` | Dusty rose — primary CTAs, links, hover states, active borders |
| `--color-accent-hover` | `#B08888` | Darker rose for hover/active states |
| `--color-border` | `#E5E0DA` | Card borders, dividers (barely visible, warm) |

**Program tier tints** (subtle pastel backgrounds to differentiate the 4 tiers):

| Variable | Value | Tier |
|----------|-------|------|
| `--tier-essential` | `#F5F3EF` | Essential (warm gray) |
| `--tier-integrated` | `#EDF5F0` | Benessere Integrato (sage tint) |
| `--tier-luxury` | `#F0EDF5` | Luxury (soft lavender tint) |
| `--tier-mum` | `#F5EDEB` | Mum track tiers (blush tint) |

**Important:** Do NOT use bright or saturated colors. The overall palette must feel quiet, clean, and airy — like Aesop or Le Labo. Every color should feel like it could exist in a neutral-toned room.

### Logo

The logo is `Doc/Logo.jpeg`. It is an MF monogram (intertwined serif M and stylized F) inside a thin oval, with "MARTA BEAUTY ZURICH" in widely spaced small capitals beneath. Place the actual image file everywhere a logo appears. Do not recreate it in CSS or SVG.

### Typography

- **Headings:** Cormorant Garamond (serif) — elegant, luxury feel
- **Body / UI:** DM Sans or Inter (sans-serif) — clean, legible
- Import both from Google Fonts

### Design language

Ultra-minimalist, clean, and airy. Think Aesop meets Swiss spa. Predominantly white backgrounds (`#FFFFFF` / `#FAF8F5`) with the warm parchment (`#F0EBE3`) reserved for hero sections and feature blocks — not everywhere. Generous white space, large serif heading sizes, thin warm dividers (0.5px `--color-border`), subtle fade-in-on-scroll animations (no parallax). Cards with 0.5px borders, soft border-radius (12–16px). No shadows at all — use borders and background tints instead. The dusty rose accent (`--color-accent`) should appear sparingly: CTA buttons, links on hover, active navigation underline, and that's it.

### Imagery

No real photos available yet. Use placeholders structured as:

```html
<img src="/images/placeholder-hero.jpg" alt="[describe scene]" loading="lazy" />
```

All placeholder slots must carry a `<!-- REPLACE: description of ideal photo -->` comment. Scenes should convey: serene at-home treatment, glowing skin, calm botanicals (white orchids, towels, oils), Zurich scenery. No cluttered salon interiors.

---

## 3. Tech stack recommendation

**Recommended: Next.js 14 (App Router) + TypeScript + Tailwind CSS**

Reasons:
- Static export (`output: 'export'`) → free hosting on Vercel
- `next-intl` for clean IT/EN bilingual routing (`/it/...` and `/en/...`)
- `next/image` for optimized lazy-loaded images
- Easy to embed Calendly and Stripe later
- Component architecture keeps program tiers and treatment cards maintainable

File structure:
```
/app
  /[locale]           ← IT and EN routing
    /page.tsx         ← Home
    /programs/page.tsx
    /treatments/page.tsx
    /about/page.tsx
    /postpartum/page.tsx
    /booking/page.tsx
    /contact/page.tsx
/components
/messages
  it.json             ← Italian strings
  en.json             ← English strings
/public
  /images             ← All image placeholders
  Logo.jpeg           ← Copy from Doc/
```

---

## 4. Site structure

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Hero, who is Marta, service overview, targets |
| Programs | `/programs` | Online program tier structure (4 tiers, 2 tracks) |
| Treatments | `/treatments` | Individual in-person bookable sessions |
| Post-partum | `/postpartum` | Dedicated page for the mum journey |
| About | `/about` | Marta's full story + team |
| Booking | `/booking` | Calendly embed + instructions |
| Contact | `/contact` | Form + WhatsApp + location |

---

## 5. Online programs — exact tier structure

> These are the online programs. They are NOT the same as in-person treatments.

All programs start from the **Essential** base tier. Clients then choose one of two tracks.

---

### Essential (base tier — included in all plans)

| Item |
|------|
| Personalised skin consultation (including active ingredient recommendations) |
| Online daily routine program |
| Basic skincare tools kit |
| Daily support for any question |
| Curated relaxing playlist |
| Home aromatherapy recommendations |

---

### Track A — Standard

**Benessere Integrato / Integrated Wellness**
- Everything in Essential, plus:
  - Nutritionist (longevity, sleep, wellbeing)
  - Basic self-treatment kit
  - Weekly live follow-up session

**Luxury**
- Everything in Integrated Wellness, plus:
  - Hair wellness expert
  - Full self-treatment kit shipped to the client
  - Personalised video tutorials

---

### Track B — Mamma / Mum

**Benessere Integrato Mamme / Mum Integrated Wellness**
- Everything in Essential, plus:
  - Nutritionist (longevity, sleep, wellbeing)
  - Doula — psychological post-partum support
  - Basic self-treatment kit
  - Weekly live follow-up session

**Luxury Mamme / Mum Luxury**
- Everything in Mum Integrated Wellness, plus:
  - Hair wellness expert (specialised in post-partum hair loss)
  - Full self-treatment kit shipped to the client
  - Personalised video tutorials

---

### Program pricing

Prices are not yet defined. Use `<!-- TODO: insert CHF price -->` placeholders on all program tier cards. Add a note in the README about where to update them.

---

### Team (associated with programs)

| Role | Track / Level |
|------|--------------|
| Marta Fantozzi — skin expert | All tiers |
| Nutritionist | Integrated Wellness and above (both tracks) |
| Hair wellness expert | Luxury only (both tracks) |
| Doula | Mum track — Integrated Wellness and above |

Display team members as cards on the Programs page and on the About page.

---

## 6. In-person treatments — exact list

> Source: `Doc/Trattamenti.xlsx`. These are the individual bookable treatments, delivered at the client's home in Zurich. They are separate from the online programs.

### Massages

| English name | Italian name | Duration | CHF |
|---|---|---|---|
| Ayurveda Massage | Massaggio ayurveda | 90 min | 195 |
| Warm Candle Massage | Massaggio candele | 60 min | 130 |
| Deep Release Massage | Massaggio decontratturante | 60 min | 130 |
| Back & Neck Relief | Back and neck | 30 min | 80 |
| Deep Drain Massage | Massaggio drenante | 60 min | 130 |
| Sculpt Massage | Massaggio anti cellulite | 60 min | 130 |
| Deep Infinity Touch | Deep infinity touch | 90 min | 220 |
| Premamum Massage | Massaggio pre mamam | 60 min | 130 |

### Body Treatments

| English name | Italian name | Duration | CHF |
|---|---|---|---|
| Sole Reflex Therapy | Riflessologia plantare | 60 min | 150 |
| Dry Brush Body Revival | Dry brushing | 60 min | 120 |
| Detox Sculpt Wrap | Bendaggio | 60 min | 130 |

### Facial Treatments

| English name | Italian name | Duration | CHF |
|---|---|---|---|
| Pure Glow Cleanse | Pulizia | 60 min | 130 |
| Silk Touch Facial | Trattamento seta | 60 min | 160 |
| Collagen Boost Ritual | Trattamento anti age (collagen boost) | 60 min | 160 |

Each treatment card should display: English name, Italian name, duration badge, CHF price, short 1-sentence description (write one per treatment — warm, benefit-focused tone), and a "Book this" CTA linking to `/booking`.

---

## 7. Post-partum page

This is a dedicated page with high emotional resonance. Use the following text verbatim (both languages) as the hero copy:

**Italian:**
> Lo sto vivendo adesso con il mio neonato tra le braccia, in una città che non è casa mia, lontana dalla mia famiglia. Ho cercato qualcuno che mi aiutasse davvero... Non a sembrare come prima ma a ritrovarmi. A sentirmi bene nella mia pelle — quella nuova, quella che racconta chi sono diventata. Non l'ho trovato. Allora ho deciso di crearlo io. 🌿

**English:**
> I know that moment. I'm living it right now with my newborn in my arms, in a city that isn't home, far from my family. I looked for someone to truly help me — not to look like before, but to find myself again. To feel good in my own skin — this new skin, the one that tells the story of who I've become. I couldn't find it. So I decided to create it myself. 🌿

Below the hero copy, render:
- The **Mum track** program tiers (Benessere Integrato Mamme + Luxury Mamme) in detail
- A **"Who is this for?"** section: expat mamas, women without family support nearby, new mothers in career transition
- The team for the mum track: Marta + Nutritionist + Doula + Hair Expert
- A CTA: "Book your first consultation" → `/booking`

Use the `--tier-mum` blush tint (`#F5EDEB`) as the background for feature sections on this page. The accent color remains `--color-accent` (dusty rose) for CTAs — do not introduce new saturated colors.

---

## 8. About page

### Bio (use verbatim)

> Welcome to my world of conscious beauty and exclusive journeys.
> My name is Marta Fantozzi, an Italian aesthetician and specialist in aesthetic medicine with over 10 years of experience. I have worked in institutes and longevity clinics, combining aesthetics, targeted treatments, and psycho-physical well-being into personalized programs. In Zurich and online, I offer tailor-made journeys for your skin, energy, and vitality, adapted to your lifestyle.

Then add (from CV):

> Between 2021 and 2024 Marta served as Therapist and Beauty Ambassador at The Longevity Suite, an advanced longevity centre in Monza, where she specialised in cryotherapy, UltraShape, Multi LED Sensory, LPG, radiofrequency, Ultratone, laser, and cosmeceutics — as well as advanced massage techniques including Kobido and manual lifting. She refined her expertise in nutrition through intermittent fasting, detox protocols, and supplementation. Earlier in her career she directed beauty centres in Rome and Parma, trained new staff, and appeared as a make-up artist on Italian television. She also holds a first-level Reiki certification.

### Values (3-pillar layout)

| Icon | Pillar | Short text |
|------|--------|-----------|
| ✦ | Expertise | 10+ years, advanced techniques, longevity clinics |
| ♡ | Empathy | Every woman deserves to feel at home in her own skin |
| ◇ | Excellence | Medical-grade protocols, personalized to your life |

### Credential badges (pill tags)

Kobido · Cryotherapy · Radiofrequency · LPG · Reiki · Cosmeceutics · UltraShape · Aromatherapy · Laser · Ultratone · Nutrition & Detox · Epilaser

---

## 9. Home page

### Hero section

- Full-viewport background: warm parchment `#F0EBE3`, no photo required (can be subtle botanical illustration or solid color)
- Logo top-center or top-left
- Heading (large serif): **"Be your first priority."**
- Sub-heading: *"Luxury beauty and wellness — delivered to your home in Zurich, and online worldwide."*
- Two CTAs side by side: **"Discover the programs"** → `/programs` · **"Book a treatment"** → `/booking`

### Trust strip (4 icons with captions)

1. At your home · Zurigo e dintorni
2. Fully online · Everything worldwide
3. 10+ years of expertise
4. Personalized for you

### Two service pillars (split section)

**Pillar 1 — Online Programs**  
Description: "Multi-week personalized journeys for your skin, wellbeing, and vitality — wherever you are."  
CTA: "See programs" → `/programs`

**Pillar 2 — In-Person Treatments**  
Description: "Individual massages, facials, and body treatments delivered at your home in Zurich."  
CTA: "See treatments" → `/treatments`

### Target audience cards (3 cards)

| Card | Title | Sub |
|------|-------|-----|
| 1 | Post-partum mama | Finding yourself again in a new body and a new life |
| 2 | Career woman | Effective, sustainable routines — even with no time |
| 3 | Seeking change | A moment of transformation, inside and out |

### Featured treatments (3 cards from the in-person list)

Suggest: Deep Infinity Touch, Collagen Boost Ritual, Ayurveda Massage.

### About teaser

Short paragraph + portrait placeholder + "Meet Marta →" link to `/about`.

---

## 10. Navigation & global components

### Sticky navbar

- Left: Logo (`Doc/Logo.jpeg`)
- Centre links: Programs · Treatments · Post-partum · About · Contact
- Right: Language toggle `IT | EN` + "Book now" pill button (`--color-accent` dusty rose)
- Transparent on load, white-background after scroll

### Mobile

Hamburger → full-screen slide-in overlay with same links + language toggle.

### Footer

- Logo + tagline "Be your first priority."
- Quick links (all pages)
- Address: Pfäffikon ZH · Switzerland
- Email: `<!-- TODO: insert email -->` · Phone: `<!-- TODO: insert phone -->`
- Instagram: @marta_beautyzurich
- Language toggle IT | EN
- © 2026 Marta Beauty Zurich · Privacy Policy · Cookie Policy

### WhatsApp floating button

Fixed bottom-right. Green. Pre-filled message:  
`Hi Marta! I'd like to find out more about your services 💆`  
Number: `<!-- TODO: insert WhatsApp number -->`

### Cookie consent banner

GDPR-compliant, bottom bar. "Accetta / Accept" and "Gestisci preferenze / Manage preferences."

---

## 11. Booking page

- Intro paragraph: what to expect (24h confirmation, service area note, online or in-person)
- **Calendly embed** as primary booking method:
  ```html
  <!-- REPLACE: paste your Calendly embed script/widget here -->
  <div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_USERNAME" ...></div>
  ```
- WhatsApp fallback CTA below the embed
- Short text: "Prefer to write? Use the contact form →" link to `/contact`

---

## 12. Contact page

- Split layout: left — info (location, email, phone, WhatsApp, Instagram); right — form
- Form fields: Name, Email, Phone (optional), Subject (dropdown: Programs · Treatments · Post-partum · Other), Message
- Client-side validation with error messages in both IT and EN
- Form submission: `mailto` fallback by default; add a `// TODO: connect Resend or EmailJS` comment
- Small Google Maps embed centred on Pfäffikon ZH: `<!-- TODO: replace with Maps embed URL -->`

---

## 13. Online payment (Stripe)

For the Programs page, each tier card must have a "Purchase" or "Get started" CTA. Wire it to Stripe Checkout:

```ts
// TODO: replace with your Stripe price IDs
const PRICE_IDS = {
  essential: 'price_XXXXXXXXXXXXXXXX',
  benessereIntegrato: 'price_XXXXXXXXXXXXXXXX',
  luxury: 'price_XXXXXXXXXXXXXXXX',
  benessereIntegrantoMamme: 'price_XXXXXXXXXXXXXXXX',
  luxuryMamme: 'price_XXXXXXXXXXXXXXXX',
}
```

Add a `POST /api/checkout` serverless route that creates a Stripe Checkout session and redirects to `stripe.com/pay`. Add a `/booking/success` and `/booking/cancelled` page. No prices are defined yet — use `<!-- TODO: insert CHF price -->` on all cards and `0` as the unit_amount placeholder.

---

## 14. SEO & technical requirements

- Each page: unique `<title>`, `meta description`, Open Graph tags
- Home page: `LocalBusiness` JSON-LD structured data:
  ```json
  {
    "@type": "LocalBusiness",
    "name": "Marta Beauty Zurich",
    "url": "https://martabeautyzurich.com",
    "address": { "addressLocality": "Pfäffikon", "addressRegion": "ZH", "addressCountry": "CH" },
    "priceRange": "CHF 80–220",
    "serviceType": "Mobile Beauty & Wellness"
  }
  ```
- Lighthouse target: ≥ 90 all categories
- WCAG 2.1 AA: heading hierarchy, aria-labels, min 4.5:1 contrast
- All images: `loading="lazy"`, descriptive `alt` text in the active language
- Canonical `hreflang` tags for IT/EN pages

---

## 15. Bilingual copy — key strings

All UI strings must exist in both `messages/it.json` and `messages/en.json`. Here are the core ones:

| Key | Italian | English |
|-----|---------|---------|
| `nav.programs` | Programmi | Programs |
| `nav.treatments` | Trattamenti | Treatments |
| `nav.postpartum` | Post-parto | Post-partum |
| `nav.about` | Chi sono | About |
| `nav.contact` | Contatti | Contact |
| `nav.book` | Prenota ora | Book now |
| `hero.tagline` | Be your first priority. | Be your first priority. |
| `hero.sub` | Benessere e bellezza di lusso — a casa tua a Zurigo, e online nel mondo. | Luxury beauty and wellness — delivered to your home in Zurich, and online worldwide. |
| `cta.programs` | Scopri i programmi | Discover the programs |
| `cta.treatments` | Prenota un trattamento | Book a treatment |
| `cta.book` | Prenota ora | Book now |
| `cta.meetMarta` | Conosci Marta → | Meet Marta → |
| `footer.tagline` | Be your first priority. | Be your first priority. |
| `footer.rights` | © 2026 Marta Beauty Zurich | © 2026 Marta Beauty Zurich |

---

## 16. Placeholder checklist (README must list all of these)

When done, generate a `README.md` that includes a section called **"Before going live"** listing:

- [ ] Replace `<!-- TODO: insert email -->` with real email
- [ ] Replace `<!-- TODO: insert phone -->` with real phone / WhatsApp number
- [ ] Replace `<!-- TODO: insert CHF price -->` on all program tier cards
- [ ] Paste Calendly embed URL on `/booking`
- [ ] Insert Stripe price IDs in `/api/checkout`
- [ ] Replace Google Maps embed URL on `/contact`
- [ ] Replace all `/images/placeholder-*.jpg` with real photography
- [ ] Set real `metaDescription` values in `messages/*.json`
- [ ] Set `NEXT_PUBLIC_SITE_URL` env var for canonical URLs

---

## 17. Deliver

Produce the complete, runnable Next.js project. Every page, every component, all bilingual strings, all treatment cards populated with the exact data from this document. The site must run with `npm run dev` without errors. Include the `README.md` with setup + placeholder checklist.
