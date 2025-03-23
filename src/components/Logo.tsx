import React from "react";
import Icon from "./Icon"; // Assuming CMSIcon component is in the same directory

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Icon width={120} height={120} />

      <h1>
        <span>Demo CMS</span>
      </h1>
    </div>
  );
}
