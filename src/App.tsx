import React from "react";
import ArtTable from "./components/ArtTable";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "1rem" }}>Art Institute Gallery</h1>
      <ArtTable />
    </div>
  );
};

export default App;