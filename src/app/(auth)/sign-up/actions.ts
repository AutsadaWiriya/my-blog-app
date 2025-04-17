"use server";

export async function signUp(formData: FormData) {
  try {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const formDataObj = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to sign up" };
    }

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}