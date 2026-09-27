/**
 * Keeps the existing page markup API while rendering content immediately.
 * Hiding elements until a scroll animation initializes caused a visible
 * flash on page entry (especially in React StrictMode); static content is
 * more reliable across reloads and devices.
 */
export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  return <Tag className={className}>{children}</Tag>
}
