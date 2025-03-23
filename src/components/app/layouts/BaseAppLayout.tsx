import { type PageProps } from "@/lib";
import { Theme as RadixTheme } from "@radix-ui/themes";
import type { ReactNode } from "react";

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
      {children}
    </RadixTheme>
  );
}
