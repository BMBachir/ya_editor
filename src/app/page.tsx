import React from "react";
import type { NextPage } from "next";
import YamlEditor from "./components/YamlEditor";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="heading flex items-center justify-center mt-24">
        YAML Code Editor
      </h1>
      <YamlEditor />
    </div>
  );
};

export default Home;
