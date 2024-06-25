import React from "react";
import type { NextPage } from "next";
import YamlEditor from "./components/YamlEditor";

const Home: NextPage = () => {
  return (
    <div>
      <YamlEditor />
    </div>
  );
};

export default Home;
