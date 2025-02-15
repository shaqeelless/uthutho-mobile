export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    dark: string;
    background: string;
    text: string;
    border: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: "#fd602d",
    secondary: "#482ecc",
    accent: "#ed67b1",
    danger: "#f9281f",
    dark: "#03020c",
    background: "#ffffff",
    text: "#03020c",
    border: "rgba(3, 2, 12, 0.1)", // dark with opacity
  },
};

export default theme; 