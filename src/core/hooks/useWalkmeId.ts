import { useLocation } from "react-router-dom";

export function useWalkmeId() {
  const location = useLocation();
  const company = "LOGILE";

  // Derive module name from pathname
  const pathWithoutParams = location.pathname.split(/[?#]/)[0];
  const pathParts = pathWithoutParams.split("/");
  pathParts.shift();
  const moduleName = (pathParts.join("-") || "root").toUpperCase();

  // Return a generator function
  const generateId = (paths = []) => {
    if (paths.length === 0 || !Array.isArray(paths)) return undefined;

    const formatPaths = paths.map((part) => part.replace(/[\s-]+/g, "_"));
    const suffix = formatPaths.join("-").toUpperCase();
    return `${company}-${moduleName}-${suffix}`;
  };

  return { generateId };
}
