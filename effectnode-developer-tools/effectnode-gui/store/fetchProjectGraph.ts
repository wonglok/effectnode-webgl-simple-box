"use server";
import { readFile } from "fs/promises";
import { join } from "path";

export const fetchProjectGraph = async ({ title = "" }: { title: string }) => {
  let filepath = join(
    process.cwd(),
    "./src/effectnode/projects",
    `${title}`,
    "graph.json"
  );

  let text = await readFile(filepath, "utf-8");

  return JSON.parse(text);
};
