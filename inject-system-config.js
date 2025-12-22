// Fetch the JSON file and inject CSS variables into the DOM
fetch("./public/system-config.json")
  .then((response) => response.json())
  .then((config) => {
    const theme = config.theme;
    const root = document.documentElement;

    // Iterate over the theme object and set CSS variables
    Object.keys(theme).forEach((key) => {
      root.style.setProperty(key, theme[key]);
    });
  })
  .catch((error) => {
    console.error("Error loading theme:", error);
  });

// Template library configuration can be handled here as needed
fetch("./public/system-config.json")
  .then((response) => response.json())
  .then((config) => {
    const templateLibrary = config.templateLibrary;
    const root = document.documentElement;
    const prefix = "template-library";

    // Iterate over the template library object and set CSS variables
    Object.keys(templateLibrary).forEach((key) => {
      switch (key) {
        case "directoryTreePosition":
          root.style.setProperty(
            `--${prefix}-${key}`,
            templateLibrary[key] === "left" ? "row" : "row-reverse"
          );

          document.documentElement.setAttribute(
            `data-${prefix}-${key}`,
            templateLibrary[key]
          );
          break;
      }
    });
  })
  .catch((error) => {
    console.error("Error loading theme:", error);
  });
