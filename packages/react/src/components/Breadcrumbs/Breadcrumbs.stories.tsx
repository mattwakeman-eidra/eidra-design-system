import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, ChevronRight, House } from '@eidra/icons';
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
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — edit `items` in the controls panel. */
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
 */
export const CustomLinkElement: Story = {
  args: {
    items: [
      {
        label: 'Dashboard',
        render: ({ className, children }) => (
          <a
            className={className}
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              // router.push('/dashboard')
            }}
          >
            {children}
          </a>
        ),
      },
      { label: 'Settings', href: '#' },
      { label: 'Billing' },
    ],
  },
};
