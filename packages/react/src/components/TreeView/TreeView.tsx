import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import styles from './TreeView.module.css';

/** A single node in the tree. Branches carry `children`; leaves omit it. */
export interface TreeNode {
  /** Stable, unique id across the whole tree. Used for expansion/selection state. */
  id: string;
  /** Visible label for the row. */
  label: ReactNode;
  /** Optional leading content (e.g. an `<Icon>`). Rendered before the label. */
  icon?: ReactNode;
  /** Child nodes. Presence (even if empty) marks the node as an expandable parent. */
  children?: TreeNode[];
  /** When true the row is non-interactive: not selectable, not focusable, skipped by keyboard nav. */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** The tree to render, in display order. */
  items: TreeNode[];
  /** Controlled set of expanded node ids. Pair with `onExpandedChange`. */
  expandedIds?: string[];
  /** Initial expanded ids for the uncontrolled case. Ignored when `expandedIds` is set. */
  defaultExpandedIds?: string[];
  /** Called with the next expanded-id list whenever expansion changes. */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Controlled selected node id (single-select). Pair with `onSelectedChange`. */
  selectedId?: string | null;
  /** Initial selected id for the uncontrolled case. Ignored when `selectedId` is set. */
  defaultSelectedId?: string | null;
  /** Called with the newly selected node id. */
  onSelectedChange?: (selectedId: string) => void;
  /** Accessible name for the tree. Provide this or `aria-labelledby`. */
  'aria-label'?: string;
  /** Id of an element labelling the tree. Provide this or `aria-label`. */
  'aria-labelledby'?: string;
  className?: string;
}

/** A flattened, currently-visible row — what keyboard navigation operates over. */
interface FlatRow {
  node: TreeNode;
  level: number;
  /** 1-based position among its siblings. */
  posInSet: number;
  /** Count of siblings (including self). */
  setSize: number;
  /** Parent node id, or null for top-level rows. */
  parentId: string | null;
  hasChildren: boolean;
}

function isBranch(node: TreeNode): boolean {
  return Array.isArray(node.children);
}

/**
 * Walk the tree depth-first, emitting a row for every node whose ancestors are
 * all expanded. This is the set of rows the user can see and navigate.
 */
function flattenVisible(items: TreeNode[], expanded: Set<string>): FlatRow[] {
  const rows: FlatRow[] = [];
  const walk = (nodes: TreeNode[], level: number, parentId: string | null) => {
    nodes.forEach((node, index) => {
      const hasChildren = isBranch(node);
      rows.push({
        node,
        level,
        posInSet: index + 1,
        setSize: nodes.length,
        parentId,
        hasChildren,
      });
      if (hasChildren && expanded.has(node.id) && node.children!.length > 0) {
        walk(node.children!, level + 1, node.id);
      }
    });
  };
  walk(items, 1, null);
  return rows;
}

/**
 * A hierarchical list following the WAI-ARIA `tree` pattern: a single-select,
 * keyboard-navigable view of nested data. Drive it with the `items` prop; manage
 * expansion and selection either as controlled props or via the `default*` seeds.
 *
 * @example
 * ```tsx
 * <TreeView
 *   aria-label="Files"
 *   defaultExpandedIds={['src']}
 *   items={[
 *     { id: 'src', label: 'src', children: [{ id: 'app', label: 'app.tsx' }] },
 *     { id: 'readme', label: 'README.md' },
 *   ]}
 * />
 * ```
 */
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {
    items,
    expandedIds,
    defaultExpandedIds,
    onExpandedChange,
    selectedId,
    defaultSelectedId,
    onSelectedChange,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  },
  ref,
) {
  // ─── Expansion state (controlled or uncontrolled) ───────────────────────────
  const isExpandedControlled = expandedIds !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? []),
  );
  const expandedSet = useMemo(
    () => (isExpandedControlled ? new Set(expandedIds) : uncontrolledExpanded),
    [isExpandedControlled, expandedIds, uncontrolledExpanded],
  );

  const commitExpanded = useCallback(
    (next: Set<string>) => {
      if (!isExpandedControlled) setUncontrolledExpanded(next);
      onExpandedChange?.([...next]);
    },
    [isExpandedControlled, onExpandedChange],
  );

  const setExpanded = useCallback(
    (id: string, open: boolean) => {
      const next = new Set(expandedSet);
      if (open) next.add(id);
      else next.delete(id);
      commitExpanded(next);
    },
    [expandedSet, commitExpanded],
  );

  const toggleExpanded = useCallback(
    (id: string) => setExpanded(id, !expandedSet.has(id)),
    [expandedSet, setExpanded],
  );

  // ─── Selection state (controlled or uncontrolled) ───────────────────────────
  const isSelectedControlled = selectedId !== undefined;
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(
    () => defaultSelectedId ?? null,
  );
  const selected = isSelectedControlled ? selectedId : uncontrolledSelected;

  const selectNode = useCallback(
    (id: string) => {
      if (!isSelectedControlled) setUncontrolledSelected(id);
      onSelectedChange?.(id);
    },
    [isSelectedControlled, onSelectedChange],
  );

  // ─── Visible rows + roving tabindex anchor ──────────────────────────────────
  const rows = useMemo(() => flattenVisible(items, expandedSet), [items, expandedSet]);
  const enabledRows = useMemo(() => rows.filter((r) => !r.node.disabled), [rows]);

  // The id of the treeitem that owns tabIndex=0. Prefer the selected node when it
  // is visible+enabled; otherwise the first enabled visible row.
  const tabbableId = useMemo(() => {
    if (selected != null && enabledRows.some((r) => r.node.id === selected)) return selected;
    return enabledRows[0]?.node.id ?? null;
  }, [selected, enabledRows]);

  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  const focusRow = useCallback((id: string | undefined) => {
    if (id == null) return;
    itemRefs.current.get(id)?.focus();
  }, []);

  const onItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>, row: FlatRow) => {
      // Only act on keys hitting this row directly (treeitems are leaf focus targets here).
      const index = enabledRows.findIndex((r) => r.node.id === row.node.id);
      if (index === -1) return;
      const open = expandedSet.has(row.node.id);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          focusRow(enabledRows[index + 1]?.node.id);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          focusRow(enabledRows[index - 1]?.node.id);
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          if (row.hasChildren && !open) {
            setExpanded(row.node.id, true);
          } else if (row.hasChildren && open) {
            // Move to the first visible child (next row, which is deeper).
            const next = enabledRows[index + 1];
            if (next && next.level > row.level) focusRow(next.node.id);
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          if (row.hasChildren && open) {
            setExpanded(row.node.id, false);
          } else if (row.parentId != null) {
            focusRow(row.parentId);
          }
          break;
        }
        case 'Home': {
          event.preventDefault();
          focusRow(enabledRows[0]?.node.id);
          break;
        }
        case 'End': {
          event.preventDefault();
          focusRow(enabledRows[enabledRows.length - 1]?.node.id);
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          selectNode(row.node.id);
          if (row.hasChildren) toggleExpanded(row.node.id);
          break;
        }
        default:
          break;
      }
    },
    [enabledRows, expandedSet, focusRow, setExpanded, selectNode, toggleExpanded],
  );

  const onItemClick = useCallback(
    (row: FlatRow) => {
      if (row.node.disabled) return;
      selectNode(row.node.id);
      if (row.hasChildren) toggleExpanded(row.node.id);
    },
    [selectNode, toggleExpanded],
  );

  return (
    <ul
      ref={ref}
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cn(styles.root, className)}
    >
      {rows.map((row) => {
        const open = row.hasChildren && expandedSet.has(row.node.id);
        const isSelected = selected === row.node.id;
        return (
          <li
            key={row.node.id}
            ref={(el) => {
              if (el) itemRefs.current.set(row.node.id, el);
              else itemRefs.current.delete(row.node.id);
            }}
            role="treeitem"
            aria-level={row.level}
            aria-setsize={row.setSize}
            aria-posinset={row.posInSet}
            aria-selected={row.node.disabled ? undefined : isSelected}
            aria-expanded={row.hasChildren ? open : undefined}
            aria-disabled={row.node.disabled || undefined}
            tabIndex={!row.node.disabled && row.node.id === tabbableId ? 0 : -1}
            data-selected={isSelected || undefined}
            data-disabled={row.node.disabled || undefined}
            data-branch={row.hasChildren || undefined}
            className={styles.item}
            onClick={(event) => {
              event.stopPropagation();
              onItemClick(row);
            }}
            onKeyDown={(event) => onItemKeyDown(event, row)}
          >
            <span
              className={styles.row}
              style={{ paddingInlineStart: `calc(${row.level - 1} * var(--_indent))` }}
            >
              <span className={styles.chevron} aria-hidden="true" data-open={open || undefined}>
                {row.hasChildren ? <ChevronIcon /> : null}
              </span>
              {row.node.icon != null && <span className={styles.icon}>{row.node.icon}</span>}
              <span className={styles.label}>{row.node.label}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
});

/** Default disclosure chevron; rotates via the `[data-open]` parent in CSS. */
function ChevronIcon() {
  return (
    <svg
      className={styles.chevronSvg}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
