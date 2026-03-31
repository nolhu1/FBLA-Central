import { DEMO_MODE } from "@/constants/config";

import { DemoRepository } from "./demoRepository";
import { FirebaseRepository } from "./firebaseRepository";

let repository = DEMO_MODE ? new DemoRepository() : new FirebaseRepository();

export const getRepository = () => repository;

export const setRepositoryForTesting = (value: typeof repository) => {
  repository = value;
};
