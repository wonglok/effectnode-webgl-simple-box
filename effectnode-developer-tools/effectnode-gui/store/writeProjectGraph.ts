"use server";
import { writeFile } from "fs/promises";
import { join } from "path";

export const writeProjectGraph = async ({
  title = "",
  data,
}: {
  title: string;
  data: string;
}) => {
  let filepath = join(
    process.cwd(),
    "./src/effectnode/projects",
    `${title}`,
    "graph.json"
  );

  await writeFile(filepath, data, "utf-8");
};
