import { Global, css } from "@emotion/react";

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}
    />
  );
}
