import { type PageProps } from "@/lib";
import { Theme as RadixTheme } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function BaseAppLayout({
  props,
  children,
}: {
  props: PageProps;
  children?: ReactNode;
}) {
  return (
    <RadixTheme
      accentColor={props.appInfo.accentColor}
      grayColor={props.appInfo.grayColor}
      radius="large"
      appearance={props.appInfo.appearanceColor}
    >
      <Toaster theme="dark" richColors expand visibleToasts={16} />
      {children}
    </RadixTheme>
  );
}
