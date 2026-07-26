import * as runtime from "react/jsx-runtime";
import React from "react";
import { Callout } from "@/components/ui/Callout";

const scope = { Fragment: runtime.Fragment, jsx: runtime.jsx, jsxs: runtime.jsxs };

const cache = new Map<string, React.ComponentType<any>>();

function getMDXComponent(code: string): React.ComponentType<any> {
  let Component = cache.get(code);
  if (!Component) {
    const mod = new Function(code)(scope) as { default: React.ComponentType<any> };
    Component = mod.default;
    cache.set(code, Component);
  }
  return Component;
}

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = getMDXComponent(code);
  return (
    <div className="prose max-w-none prose-p:my-5 prose-p:leading-relaxed prose-p:text-text">
      <Component components={{ Callout }} />
    </div>
  );
}
