import * as usersRepository from "./users.repository";

export const ensureUserExists = async (user: {
    id: string;
    email?: string;
    name?: string;
    imageUrl?: string;
}) => {
    const existingUser = await usersRepository.findById(user.id);
    
    if (existingUser) return existingUser;
    
    await usersRepository.create({
        id: user.id,
        email: user.email || "",
        name: user.name,
        imageUrl: user.imageUrl,
    });

    return await usersRepository.findById(user.id);
};