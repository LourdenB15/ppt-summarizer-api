import { UserRepository } from "@/repositories/user.repository";
import { verifyPassword, hashPassword } from "@/utils/password";

export async function ChangePasswordService(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user || !user.password) {
      return { code: 404, status: "error", message: "User not found" };
    }

    if (!verifyPassword(currentPassword, user.password)) {
      return { code: 400, status: "error", message: "Current password is incorrect" };
    }

    if (currentPassword === newPassword) {
      return { code: 400, status: "error", message: "New password must be different from current password" };
    }

    await userRepository.updatePassword(userId, hashPassword(newPassword));

    return { code: 200, status: "success", message: "Password changed successfully" };
  } catch (error) {
    console.error("ChangePasswordService Error", error);
    return { code: 500, status: "error", message: "Failed to change password" };
  }
}
