import { speciesModelConfigs } from "./config/speciesModels";

export const speciesOptions: string[] = speciesModelConfigs.map((item) => item.name);

export const MAX_SEQ_COUNT = 5000;
export const MAX_FILE_SIZE = 1 * 1024 * 1024;
export const MAX_SEQ_LENGTH = 200;



