export const meta = {
  name: 'eidra-build-components',
  description: 'Build the remaining Eidra DS components on Base UI, in parallel, against the locked pattern',
  phases: [{ title: 'Build', detail: 'one agent per component, writes files following the exemplars' }],
};

// Components to build. baseUi = Base UI dir(s) to wrap, or null for a from-scratch primitive.
const COMPONENTS = [
  { name: 'Accordion', category: 'Layout', baseUi: 'accordion' },
  { name: 'AlertDialog', category: 'Overlays', baseUi: 'alert-dialog' },
  { name: 'Autocomplete', category: 'Forms', baseUi: 'autocomplete' },
  { name: 'Avatar', category: 'Data Display', baseUi: 'avatar' },
  { name: 'Checkbox', category: 'Forms', baseUi: 'checkbox, checkbox-group', note: 'Export Checkbox and CheckboxGroup.' },
  { name: 'Collapsible', category: 'Layout', baseUi: 'collapsible' },
  { name: 'Combobox', category: 'Forms', baseUi: 'combobox' },
  { name: 'ContextMenu', category: 'Overlays', baseUi: 'context-menu' },
  { name: 'Dialog', category: 'Overlays', baseUi: 'dialog', note: 'Include a styled close button using the X icon from @eidra/icons.' },
  { name: 'Fieldset', category: 'Forms', baseUi: 'fieldset' },
  { name: 'Form', category: 'Forms', baseUi: 'form', note: 'Wraps the native form with Base UI validation; pairs with Field.' },
  { name: 'Menu', category: 'Overlays', baseUi: 'menu', note: 'Dropdown menu. Use Check/ChevronRight icons for checkbox items and submenus.' },
  { name: 'Menubar', category: 'Navigation', baseUi: 'menubar' },
  { name: 'Meter', category: 'Feedback', baseUi: 'meter' },
  { name: 'NavigationMenu', category: 'Navigation', baseUi: 'navigation-menu' },
  { name: 'NumberField', category: 'Forms', baseUi: 'number-field', note: 'Use Minus/Plus icons for the steppers.' },
  { name: 'Popover', category: 'Overlays', baseUi: 'popover' },
  { name: 'PreviewCard', category: 'Overlays', baseUi: 'preview-card' },
  { name: 'Progress', category: 'Feedback', baseUi: 'progress' },
  { name: 'Radio', category: 'Forms', baseUi: 'radio, radio-group', note: 'Export Radio and RadioGroup.' },
  { name: 'ScrollArea', category: 'Layout', baseUi: 'scroll-area' },
  { name: 'Select', category: 'Forms', baseUi: 'select', note: 'Use ChevronsUpDown for the trigger and Check for the selected item.' },
  { name: 'Separator', category: 'Layout', baseUi: 'separator' },
  { name: 'Slider', category: 'Forms', baseUi: 'slider' },
  { name: 'Switch', category: 'Forms', baseUi: 'switch' },
  { name: 'Tabs', category: 'Navigation', baseUi: 'tabs' },
  { name: 'Toast', category: 'Feedback', baseUi: 'toast', note: 'Provide a Toast provider/viewport and a useToast-style API per Base UI. Use the X icon to close.' },
  { name: 'Toggle', category: 'Forms', baseUi: 'toggle, toggle-group', note: 'Export Toggle and ToggleGroup.' },
  { name: 'Toolbar', category: 'Navigation', baseUi: 'toolbar' },
  { name: 'Tooltip', category: 'Overlays', baseUi: 'tooltip' },
  // From-scratch primitives (no Base UI dir) — build like Button (native element + tokens).
  { name: 'Badge', category: 'Data Display', baseUi: null, note: 'Small status label. Props: tone (neutral|accent|coral|success|danger|warning|info), variant (solid|subtle|outline), size (sm|md). Renders a span.' },
  { name: 'Card', category: 'Data Display', baseUi: null, note: 'Surface container. Compound: Card, Card.Header, Card.Body, Card.Footer (or subcomponents). Props: variant (elevated|outline|subtle), padding. Uses --eidra-surface, shadow, radius-lg, border.' },
  { name: 'Spinner', category: 'Feedback', baseUi: null, note: 'Loading spinner (SVG or bordered circle), size sm|md|lg, role=status with aria-label. Mirror Button.module.css spinner approach.' },
  { name: 'Alert', category: 'Feedback', baseUi: null, note: 'Inline callout. Props: tone (info|success|warning|danger|neutral), title, icon (auto per tone via @eidra/icons: Info/CheckCircle/AlertTriangle/AlertCircle), dismissible. role=alert/status.' },
  { name: 'Skeleton', category: 'Feedback', baseUi: null, note: 'Loading placeholder with a subtle pulse animation (respect prefers-reduced-motion). Props: width, height, radius, variant (text|rect|circle).' },
  { name: 'Kbd', category: 'Data Display', baseUi: null, note: 'Keyboard key hint. Renders a <kbd>. Uses mono font, border, subtle surface, radius-sm.' },
];

const BASE_UI_PATH =
  'node_modules/.pnpm/@base-ui-components+react@1.0.0-rc.0_@types+react@19.2.17_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@base-ui-components/react';

const TOKENS = `Available CSS custom properties (use these EXACT names; never invent tokens):
Colors (semantic, theme-aware — PREFER THESE): --eidra-bg --eidra-bg-subtle --eidra-bg-muted --eidra-bg-inset --eidra-bg-inverse --eidra-surface --eidra-surface-hover --eidra-surface-active --eidra-surface-raised --eidra-fg --eidra-fg-muted --eidra-fg-subtle --eidra-fg-disabled --eidra-fg-on-accent --eidra-fg-on-inverse --eidra-border --eidra-border-subtle --eidra-border-strong --eidra-border-inverse --eidra-accent --eidra-accent-hover --eidra-accent-active --eidra-accent-subtle --eidra-accent-fg --eidra-accent-border --eidra-coral --eidra-coral-hover --eidra-coral-subtle --eidra-coral-fg --eidra-focus-ring --eidra-success(-subtle/-fg/-border) --eidra-danger(-hover/-subtle/-fg/-border) --eidra-warning(-subtle/-fg/-border) --eidra-info(-subtle/-fg/-border)
Primitives if truly needed: --eidra-color-black --eidra-color-white --eidra-color-creme --eidra-color-taupe --eidra-color-grey-50..1000 --eidra-color-orange-100..900 --eidra-color-coral-100..900
Type: --eidra-font-family-sans --eidra-font-family-mono --eidra-font-weight-regular|medium|semibold|bold --eidra-font-size-xs|sm|base|md|lg|xl|2xl|3xl|4xl|5xl|6xl|display --eidra-font-line-height-none|tight|snug|normal|relaxed --eidra-font-letter-spacing-display|tight|normal|wide
Space: --eidra-space-0|px|0-5|1|1-5|2|3|4|5|6|8|10|12|15|16|20|24|30|40|50
Radius: --eidra-radius-none|sm|md|lg|xl|2xl|full
Sizes: --eidra-size-control-sm|md|lg --eidra-size-icon-sm|md|lg --eidra-size-container-sm|md|lg|xl
Shadow: --eidra-shadow-xs|sm|md|lg|xl   Motion: --eidra-duration-instant|fast|base|slow --eidra-easing-standard|emphasized|decelerate|accelerate
Z: --eidra-z-base|raised|dropdown|sticky|overlay|modal|popover|toast|tooltip`;

function prompt(c) {
  const isPrimitive = c.baseUi === null;
  return `You are building ONE component for the Eidra React design system (@eidra/react). Work in the repo at the current working directory.

## Component: ${c.name}  (category: ${c.category})
${isPrimitive
  ? `This is a from-scratch primitive (no Base UI wrapper). Build it like the Button exemplar: a native element styled entirely with Eidra tokens.`
  : `Wrap the Base UI primitive(s): ${c.baseUi}. The Base UI package is at:
${BASE_UI_PATH}
READ the type declarations there FIRST to learn the exact parts and props:
- \`<dir>/index.parts.d.ts\` lists the parts (Root, Trigger, etc.).
- Read each part's *.d.ts for props, state, and the data-* attributes it sets (data-open, data-checked, data-disabled, data-selected, data-highlighted, etc.). Style states via those [data-*] selectors.`}
${c.note ? `\nSpecific guidance: ${c.note}` : ''}

## REQUIRED: study the locked pattern before writing
Read these exemplar files and mirror their conventions EXACTLY (file layout, ESM \`.js\` import extensions, forwardRef usage, displayName via function name, className composition with the \`cn\` util, token-only CSS, focus-visible rings):
- packages/react/src/components/Button/Button.tsx + Button.module.css + Button.stories.tsx  (native element pattern)
- packages/react/src/components/Input/Input.tsx + Input.module.css  and  packages/react/src/components/Field/Field.tsx  (Base UI wrapping pattern)
- packages/react/src/utils/cn.ts

## ${TOKENS}

## Deliverables — create ONLY files inside packages/react/src/components/${c.name}/
1. ${c.name}.tsx — the component. For multi-part Base UI components, export a compound object namespace mirroring Base UI's parts (e.g. \`export const ${c.name} = { Root, Item, ... }\` with each part a styled wrapper), OR a sensible composed component plus the parts — match how Base UI structures it. Use forwardRef for single-element wrappers. Pass our class names to each part; let Base UI keep its behavior/ARIA. Add a 'use client' note is NOT needed (handled at build).
2. ${c.name}.module.css — style every part using ONLY the tokens above. Cover: default, hover, focus-visible (\`outline: 2px solid var(--eidra-focus-ring); outline-offset: 2px;\`), disabled ([data-disabled] { opacity .5; cursor not-allowed }), and the component's stateful data-attrs (open/checked/selected/etc.). Use --eidra-duration-fast + --eidra-easing-standard for transitions. Use semantic tokens so light/dark both work automatically. For popovers/menus/dialogs use --eidra-surface, --eidra-shadow-lg, --eidra-radius-lg, --eidra-border, and the right --eidra-z-* token; add subtle enter/exit transitions keyed off [data-open]/[data-starting-style]/[data-ending-style] if Base UI exposes them.
3. ${c.name}.stories.tsx — Storybook CSF3. \`const meta = { title: '${c.category}/${c.name}', component: <main export>, tags: ['autodocs'], ... } satisfies Meta<...>; export default meta;\`. Import the component from './${c.name}.js'. Add a Playground plus stories for the key variants/states. Icons come from '@eidra/icons' (import the lucide icon + the \`Icon\` wrapper). Keep examples realistic and on-brand (Eidra is a Nordic consultancy).
4. index.ts — re-export the component(s) and their public types with \`export ... from './${c.name}.js'\`.

## Rules
- Do NOT edit packages/react/src/index.ts, the workflow, or any file outside your component folder. The integrator wires up exports afterward.
- Relative imports MUST use \`.js\` extensions (the project is ESM, moduleResolution bundler). Match the exemplars.
- Strict TypeScript: no \`any\` leaking into public types, no unused vars, handle \`noUncheckedIndexedAccess\`.
- Never invent token names. If you need a value with no token, prefer the closest token; only use a raw value for things tokens don't cover (e.g. 1px borders, 100%).
- Verify your TSX is syntactically valid and imports resolve against the Base UI d.ts you read.

When done, return the structured result: the component name, category, the exact named exports you created in index.ts, the Base UI dir(s) used (or "none"), a status, and brief notes on anything unusual (e.g. a provider that must be mounted, or a part you couldn't fully style).`;
}

const SCHEMA = {
  type: 'object',
  required: ['name', 'category', 'namedExports', 'status'],
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    category: { type: 'string' },
    namedExports: { type: 'array', items: { type: 'string' } },
    baseUi: { type: 'string' },
    status: { type: 'string', enum: ['ok', 'partial', 'failed'] },
    notes: { type: 'string' },
  },
};

phase('Build');
log(`Building ${COMPONENTS.length} components in parallel against the locked pattern.`);

const results = await parallel(
  COMPONENTS.map((c) => () =>
    agent(prompt(c), {
      label: `build:${c.name}`,
      phase: 'Build',
      model: 'sonnet',
      schema: SCHEMA,
    }),
  ),
);

const ok = results.filter(Boolean);
return {
  total: COMPONENTS.length,
  built: ok.length,
  components: ok,
};
