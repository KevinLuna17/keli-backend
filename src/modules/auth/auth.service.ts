import * as usersService from "../users/users.service";

export const syncUser = async (userId: string, data: any) => {
  return usersService.ensureUserExists({
    id: userId,
    email: data.email,
    name: data.name,
    imageUrl: data.imageUrl,
  });
};