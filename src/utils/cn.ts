/**
 * Utility to merge class names conditionally.
 */
export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}
