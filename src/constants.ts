import { Species } from "./types";
import { speciesModelConfigs } from "./config/speciesModels";

export const speciesOptions: Species[] = speciesModelConfigs.map((item) => item.name);

export const MAX_SEQ_COUNT = 50;
export const MAX_FILE_SIZE = 1 * 1024 * 1024;

