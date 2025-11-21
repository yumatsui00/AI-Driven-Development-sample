type VariantsConfig = Record<string, Record<string, string>>;

type CvaOptions = {
  variants: VariantsConfig;
  defaultVariants?: Record<string, string>;
};

type VariantsProps<T extends VariantsConfig> = {
  [K in keyof T]?: keyof T[K];
};

/**
 * Minimal cva-like helper to compose class names with variants.
 * This avoids external dependencies while keeping shadcn-style ergonomics.
 */
export function cva(base: string, options: CvaOptions) {
  return (props?: VariantsProps<typeof options.variants> & { className?: string }) => {
    const merged = { ...(options.defaultVariants ?? {}), ...(props ?? {}) };
    const withVariants = Object.entries(options.variants).flatMap(([key, mapping]) => {
      const variantKey = merged[key];
      return variantKey && mapping[variantKey as string] ? mapping[variantKey as string] : [];
    });

    return [base, ...withVariants, props?.className].filter(Boolean).join(" ");
  };
}

export type VariantProps<T> = T extends (props: infer P) => any ? NonNullable<P> : never;
