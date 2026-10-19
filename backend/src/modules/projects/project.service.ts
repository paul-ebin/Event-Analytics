
import {
  createProject as createProjectRepository,
  findProjectsByOwnerId,
} from "./project.repository.js";

export async function createProject(
  ownerId: string,
  name: string
) {
  const project = await createProjectRepository(
    ownerId,
    name
  );

  return project;
}

export async function getUserProjects(ownerId: string) {
  return findProjectsByOwnerId(ownerId);
}
