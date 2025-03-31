import { type PageProps } from "@/lib";
import { Theme as RadixTheme } from "@radix-ui/themes";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function BaseAppLayout({
  props,
  children,
}: {
  props: PageProps;
  children?: ReactNode;
}) {
  const [appearance, setAppearance] = useState<"dark" | "light">();

  useEffect(() => {
    if (props.appInfo.appearanceColor === "system") {
      toggleAppearance();
    } else {
      setAppearance(props.appInfo.appearanceColor);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        toggleAppearance();
      });
  }, []);

  function toggleAppearance() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setAppearance("dark");
    } else {
      setAppearance("light");
    }
  }

  return (
    <RadixTheme
      accentColor={props.appInfo.accentColor}
      grayColor={props.appInfo.grayColor}
      radius="large"
      appearance={appearance}
    >
      <Toaster theme="dark" richColors expand visibleToasts={16} />
      {children}
    </RadixTheme>
  );
}
