type ConditionalProviderProps<Provider> = {
  Element: React.ComponentType<Provider>;
  children: React.ReactNode;
  enabled?: boolean;
  props?: Provider;
};
export function ConditionaProvider<T>({
  Element,
  children,
  enabled = false,
  props = {} as T,
}: ConditionalProviderProps<T>) {
  return enabled ? <Element {...props}>{children}</Element> : <>{children}</>;
}
