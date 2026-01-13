interface LoaderProps {
  text?: string;
}

export const mockLoaderDefaultProps: LoaderProps = {
  text: "Loading...",
};

export const mockLoaderCustomProps: LoaderProps = {
  text: "Please wait...",
};

export const mockLoaderEmptyText: LoaderProps = {
  text: "",
};

export const mockLoaderLongText: LoaderProps = {
  text: "Loading data from the server, this might take a while...",
};
