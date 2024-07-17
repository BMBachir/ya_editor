import React from "react";
import type { NextPage } from "next";
import YamlEditor from "./components/YamlEditor";
import { NextUIProvider } from "@nextui-org/system";
import { YamlProvider } from "./components/context/YamlContext";
const Home: NextPage = () => {
  return (
    <YamlProvider>
      <NextUIProvider>
        <YamlEditor />
      </NextUIProvider>
    </YamlProvider>
  );
};

export default Home;
