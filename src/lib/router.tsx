"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface RouteState {
  path: string;
  query: Record<string, string>;
  hash: string;
}

interface RouterContextValue extends RouteState {
  /** alias of path */
  pathname: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(raw: string): RouteState {
  let h = raw.replace(/^#/, "");
  if (!h.startsWith("/")) h = "/" + h;
  const [pathAndQuery, fragment = ""] = h.split("#");
  const [path, queryString = ""] = pathAndQuery.split("?");
  const query: Record<string, string> = {};
  if (queryString) {
    for (const pair of queryString.split("&")) {
      const [k, v = ""] = pair.split("=");
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  }
  const cleanPath = path.replace(/\/+$/, "") || "/";
  return { path: cleanPath, query, hash: fragment };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RouteState>(() =>
    typeof window !== "undefined" ? parseHash(window.location.hash) : { path: "/", query: {}, hash: "" }
  );
  const firstRender = React.useRef(true);

  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash);
      setState((prev) => {
        if (prev.path !== next.path || JSON.stringify(prev.query) !== JSON.stringify(next.query)) {
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
        return next;
      });
    };
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = "#" + (to.startsWith("/") ? to : "/" + to);
    if (window.location.hash === target) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    if (opts?.replace) {
      window.history.replaceState(null, "", target);
      setState(parseHash(target));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } else {
      window.location.hash = target;
    }
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const value = useMemo(
    () => ({ ...state, pathname: state.path, navigate, back }),
    [state, navigate, back]
  );

  // mark first render done (kept for potential future use)
  React.useEffect(() => {
    firstRender.current = false;
  }, []);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={"#" + (to.startsWith("/") ? to : "/" + to)}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navigate(to, { replace });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
