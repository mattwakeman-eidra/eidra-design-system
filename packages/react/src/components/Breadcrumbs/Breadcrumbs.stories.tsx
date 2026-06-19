import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, ChevronRight, House } from '@eidra/icons';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs.js';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Projects', href: '#' },
      { label: 'Acme Corp', href: '#' },
      { label: 'Website Redesign' },
    ],
  },
  argTypes: {
    // Array of objects (some items carry a `render` fn) — not editable as a control.
    items: { control: false },
    separator: { control: false },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Module-scoped spy for the CustomLinkElement story. `onNavigate` isn't a
// Breadcrumbs prop (the host wires it inside the item's `render`), so it can't
// live in `args` without breaking the typed meta — a module spy keeps the play
// assertable while staying type-correct.
const onNavigate = fn();

/** Default breadcrumb trail. `items` is fixture-driven (not a panel control). */
export const Playground: Story = {};

/** The last crumb is the current page (`aria-current="page"`); earlier crumbs link. */
export const Basic: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Sold & Forecast', href: '#' },
      { label: 'Acme Corp' },
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('the nav exposes an accessible Breadcrumb landmark', async () => {
      await expect(canvas.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    });

    await step('earlier crumbs render as links with their href', async () => {
      const home = canvas.getByRole('link', { name: /home/i });
      await expect(home).toHaveAttribute('href', '#');
      await expect(canvas.getByRole('link', { name: /sold & forecast/i })).toBeInTheDocument();
    });

    await step('the last crumb is the current page and is not a link', async () => {
      const current = canvas.getByText('Acme Corp');
      await expect(current).toHaveAttribute('aria-current', 'page');
      await expect(canvas.queryByRole('link', { name: /acme corp/i })).toBeNull();
    });

    await step('Tab moves focus across the crumb links in order', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: /home/i })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole('link', { name: /sold & forecast/i })).toHaveFocus();
    });
  },
};

/** A custom separator (here a chevron icon) instead of the default `/`. */
export const CustomSeparator: Story = {
  args: {
    separator: <Icon icon={ChevronRight} size="sm" />,
    items: [
      { label: 'Clients', href: '#' },
      { label: 'Globex', href: '#' },
      { label: 'Q2 Invoices' },
    ],
  },
};

/** Labels accept nodes, so crumbs can carry icons. */
export const WithIcons: Story = {
  args: {
    items: [
      {
        label: (
          <>
            <Icon icon={House} size="sm" /> Home
          </>
        ),
        href: '#',
      },
      { label: 'Reports', href: '#' },
      { label: 'Revenue' },
    ],
  },
};

/**
 * Injecting a custom link element via `render` — this is how a consumer wires a
 * router `Link` (e.g. React Router / Next.js) without the design system taking a
 * router dependency. Here it's a plain `<a>` with an `onClick` to illustrate.
 *
 * The `play` proves the host's `onClick` fires on both pointer click and keyboard
 * activation, which is how a router push would be triggered in real use.
 */
export const CustomLinkElement: Story = {
  // The `items` array embeds a JSX-returning `render` fn; an explicit source.code
  // keeps Storybook's dynamic serializer from choking on the rendered tree.
  parameters: {
    docs: {
      source: {
        code: "<Breadcrumbs items={[{ label: 'Dashboard', render: ({ className, children }) => <a className={className} href=\"#dashboard\" onClick={onNavigate}>{children}</a> }, { label: 'Settings', href: '#' }, { label: 'Billing' }]} />",
      },
    },
  },
  render: () => (
    <Breadcrumbs
      items={[
        {
          label: 'Dashboard',
          render: ({ className, children }) => (
            <a
              className={className}
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                onNavigate();
                // router.push('/dashboard')
              }}
            >
              {children}
            </a>
          ),
        },
        { label: 'Settings', href: '#' },
        { label: 'Billing' },
      ]}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onNavigate.mockClear();
    const dashboard = canvas.getByRole('link', { name: /dashboard/i });

    await step('clicking the custom-rendered link fires the host onClick', async () => {
      await userEvent.click(dashboard);
      await expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    await step('Enter activates the focused link, firing onClick again', async () => {
      dashboard.focus();
      await expect(dashboard).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(onNavigate).toHaveBeenCalledTimes(2);
    });
  },
};
