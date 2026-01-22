"use server";

export async function testAction(formData: FormData): Promise<void> {
  console.log("TEST ACTION CALLED");

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
}