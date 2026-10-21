---
name: "DVA Teaching Slides"
description: "Thai teaching slides, daily lessons, exercises, and Colab resources."
colors:
  accent: "#007da2"
  ink: "#172638"
  body-ink: "#253548"
  muted: "#586b7e"
  line: "#dbe3ec"
  surface: "#fff"
  canvas: "#f1f5f9"
  subtle-surface: "#f8fafc"
  active-surface: "#eaf5fb"
  hover-surface: "#eff8fc"
  code-surface: "#182635"
  code-toolbar: "#223548"
  code-text: "#eaf3fc"
  focus: "#0085b0"
  problem-surface: "#fff4e6"
  problem-ink: "#714310"
typography:
  display:
    fontFamily: "Sarabun, 'Noto Sans Thai', sans-serif"
    fontSize: "clamp(2rem, 3.5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.01em"
  headline:
    fontFamily: "Sarabun, 'Noto Sans Thai', sans-serif"
    fontSize: "clamp(1.7rem, 2.5vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.01em"
  title:
    fontFamily: "Sarabun, 'Noto Sans Thai', sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
  body:
    fontFamily: "Sarabun, 'Noto Sans Thai', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Sarabun, 'Noto Sans Thai', sans-serif"
    fontSize: ".83rem"
    fontWeight: 400
  code:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontSize: ".95rem"
    fontWeight: 400
    lineHeight: 1.65
  guided-code:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.65
  guided-code-mobile:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontSize: ".95rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  field: "6px"
  control: "8px"
  code: "10px"
  paper: "12px"
spacing:
  compact: "8px"
  control: "12px"
  medium: "18px"
  content: "22px"
  section: "24px"
  chrome: "28px"
components:
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-default-hover:
    backgroundColor: "{colors.hover-surface}"
  button-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
  day-navigation:
    rounded: "{rounded.control}"
    padding: "10px"
    width: "100%"
  day-navigation-active:
    backgroundColor: "{colors.active-surface}"
    textColor: "{colors.accent}"
  slide-paper:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.paper}"
    padding: "40px 44px"
  code-panel:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.code}"
  guided-command:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-text}"
    typography: "{typography.guided-code}"
    rounded: "{rounded.code}"
    padding: "18px 22px"
  guided-run:
    textColor: "{colors.accent}"
  complete-command:
    padding: "18px 0 0"
  slide-select:
    backgroundColor: "{colors.subtle-surface}"
    rounded: "{rounded.field}"
    padding: "8px"
---

# Design System: DVA Teaching Slides

## Overview

**Creative North Star: "The Classroom Workbook"**

This is a scan of the shipped interface, not a seed or a user-approved visual exploration. The user-pinned NOS teaching reference supplies the teaching structure; the current code and review captures supply the visual facts. The descriptive metaphor below names what is visible rather than claiming a workshop decision.

White lesson paper sits within a cool gray workspace. Thai typography is direct and readable, with cyan-blue marking orientation and selected actions. The permanent teaching chrome keeps navigation, content, and teacher notes within a single classroom workspace. Dark code panels make executable text visually distinct from explanatory prose.

**Key Characteristics:**
- Cool workspace with white lesson paper.
- Sarabun for Thai content and navigation; monospace for code.
- Flat borders and tonal fills rather than shadows.
- Nested daily navigation and persistent teacher notes.

## Colors

A single cyan-blue accent organizes a cool neutral workspace; dark slate is reserved for command panels and amber identifies data requiring inspection. Token values in the frontmatter are normative.

### Primary
- **Cyan-blue accent** (`accent`): active day navigation, mode selection, teaching prompts, results, and links.
- **Pale cyan selection** (`active-surface`): selected navigation and mode backgrounds.
- **Pale cyan hover** (`hover-surface`): ordinary enabled button hover.
- **Focus blue** (`focus`): keyboard outline across buttons, links, and selects.

### Secondary
- **Inspection amber** (`problem-surface`, `problem-ink`): paired background and text for problem rows in recurring data demonstrations.

### Neutral
- **Paper and workspace** (`surface`, `canvas`, `subtle-surface`): lesson paper, page canvas, and quiet utility surfaces.
- **Slate reading hierarchy** (`ink`, `body-ink`, `muted`): headings, prose, and supporting metadata.
- **Cool divider** (`line`): controls and chrome boundaries.
- **Code slate** (`code-surface`, `code-toolbar`, `code-text`): executable block, its toolbar, and readable code.

**The Accent as Orientation Rule.** Use the cyan-blue accent for active navigation, selected demo actions, teaching prompts, and results, as the current interface does.

## Typography

**Display Font:** Sarabun with Noto Sans Thai and sans-serif fallbacks.
**Body Font:** The same family, locally served regular and bold faces.
**Label/Mono Font:** SFMono-Regular, Consolas, Liberation Mono, monospace for executable code.

**Character:** One Thai reading family supplies a clear hierarchy through scale and weight. The bold font file is mapped to weights 600–900; there is no separate decorative display family.

### Hierarchy
- **Display:** cover headings use the fluid display token; at widths below 850px the size becomes 2.2rem, and below 480px it becomes 1.95rem. The cover title is limited to 24ch.
- **Headline:** ordinary slide headings use the fluid headline token.
- **Title:** section headings use the title token. Session activity headings use 1.15rem, reducing to 1.05rem below 600px.
- **Body:** prose uses the body token; concept text is 1.2rem and limited to 70ch. Teaching list text is 1.15rem at 1.6 line height, reducing to 1.08rem below 850px and 1rem below 480px; lists and fine print are limited to 75ch.
- **Label:** mode and note controls use the label token; supporting labels commonly span .75–.9rem.
- **Code:** the code token reduces to .83rem below 480px and preserves whitespace with horizontal scrolling. Guided writing panels use the larger guided-code token, changing to guided-code-mobile below 480px; the incumbent general code token remains unchanged.

**The Code Has Its Own Voice Rule.** Keep executable blocks in the dark panel with monospace type; keep their Thai explanations in the normal reading voice outside the panel.

## Layout

The app fills 100dvh. A fixed-width sidebar sits beside a flexible main column. The sidebar navigation and lesson content scroll independently; header, modes, and footer remain within the shell. Sidebar width is 300px, narrowing to 260px below 1200px. Below 850px it becomes a 290px off-canvas drawer with a dim backdrop.

Lesson paper and session banners share an 1100px maximum width. The desktop content region has 38px padding, reduced to 24px at 1200px, 18px at 850px, and 12px at 480px. Paper padding steps from 40px 44px to 32px, 26px, and 22px at those same thresholds. Paper minimum height is 460px (380px below 850px); covers are 520px (430px below 850px).

The recurring rhythm uses compact control gaps and larger separations between blocks, as recorded in spacing. These are extracted repeated values, not a newly imposed mathematical scale. At 600px the session banner stacks vertically. The five-column pipeline becomes two columns at 850px, with its last stage spanning the row. Data sources stack in a single column at 480px. Tables retain horizontal scroll instead of compressing their columns.

## Elevation & Depth

The interface uses no box shadows. White paper and chrome contrast with a cool canvas, separated by thin borders. Covers use a soft diagonal gradient; the mobile drawer uses a translucent slate backdrop. Dark code panels supply contrast through tone rather than simulated elevation.

**The Flat Workspace Rule.** Separate lesson paper, navigation, and controls with thin borders and tonal backgrounds; the shipped interface has no box shadows.

## Shapes

Control corners are gently rounded with the control token; select fields are slightly tighter. Lesson paper uses the paper token and code blocks use the code token. Data tables use straight row dividers. Solid square markers precede teaching-list items. Thin borders define controls, paper, and teaching chrome.

## Components

### Buttons

Plain bordered controls carry actions without competing with the lesson. Default, hover, and selected fills are recorded above. Buttons use an inline icon/text arrangement with a 7px gap. Disabled controls use .4 opacity. Keyboard focus is a 3px outline with a 3px offset. Background transitions last .15s and are removed when reduced motion is requested. Demo choices use solid accent selection; below 480px they have a 44px minimum height.

### Cards / Containers

Lesson paper is the content container, not a repeated marketing card. It uses white fill, a thin cool border, and the paper radius. Covers replace white with the observed light gradient. Think prompts are separated by a top rule and generous vertical breathing room rather than another boxed card.

### Inputs / Fields

The existing field is a native slide-jump select: quiet utility fill, line border, field radius, and 8px padding. Its maximum width narrows from 220px to 160px and 130px across the mobile breakpoints. It retains a readable .8rem font on narrow screens. The application has no text-entry field to canonize.

### Navigation

The sidebar nests unit disclosures, weekly disclosures, and two daily buttons. Week groups use an inset left rule; selected day uses pale cyan fill and accent text. A day label and period count appear above a quieter activity description. Generic day labels remain until the timetable is provided; no weekday names or dates are established.

The content header identifies the lesson and carries previous, next, and fullscreen controls. On small screens the redundant header arrows and counter hide while footer navigation remains. The three mode buttons use pale cyan active treatment. Teacher notes sit in the persistent footer with an expandable text region.

### Command Panel and Dissection

A dark rounded panel contains a lighter slate toolbar and copy action, followed by scrollable monospace code. Its maximum code height is 390px. Below the panel, command fragments appear as pale cyan inline code with Thai explanations in a wrapping horizontal arrangement. This distinction is the recurring signature for teaching commands one part at a time.

### Tables and Demonstrations

Tables use quiet blue-gray headers, 12px 15px cell padding, and horizontal rules. Problem rows combine amber tone with explicit result text. Demo choices wrap, retain pressed states, and show a strong accent-colored written result. State changes are reflected in content, not only in button color.

### Guided Writing and Checking

A writing page orders the typing instruction, exact command, run instruction, command explanation, and next-page reminder. Its command panel reuses the existing dark surface and copy toolbar, with larger code lettering and a compact 18px vertical gap. The accent-colored run instruction is bold and remains outside the command panel. Explanation headings use 1.08rem type; prose is limited to 75ch.

When a step supplies a cumulative cell draft, a native disclosure follows its explanation. A thin top rule, 18px top padding, and accent-colored .95rem summary distinguish this optional reference without adding another card. Its expanded code may scroll up to 500px high. Native disclosure interaction is retained.

The following checking page repeats the run instruction, then separates the expected result and error recovery under explicit headings. A ruled teaching prompt asks learners to inspect their own result before moving on. The existing previous/next controls support returning to the writing page; these pages describe work in Colab rather than accepting code entry in the slide interface.

**The Write Then Check Rule.** Keep the exact typing step on its writing page and its expected result and error recovery on the immediately following checking page.

## Do's and Don'ts

### Do:
- **Do** retain the Thai Sarabun family and generous prose line height.
- **Do** preserve the unit → week → day navigation hierarchy and highlight the current day.
- **Do** show the activity heading before its quieter scheduling metadata.
- **Do** retain visible keyboard focus and reduced-motion behavior.
- **Do** allow lesson content, long code, and wide tables to scroll within their intended regions.

### Don't:
- **Don't** use color alone to identify a problem row; retain the written inspection result.
- **Don't** turn the dark code panel into the background for ordinary explanation.
- **Don't** replace the current lesson paper and teaching chrome with unrelated decorative components.

<!-- Not canonized: unused legacy week-button rules, one-off chart colors, and the global pale hover on solid selected demo buttons. The last can reduce white-text contrast and is a carried defect, not a reusable state rule. -->
