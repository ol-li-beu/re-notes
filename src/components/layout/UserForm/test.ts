"use server";

export async function testAction(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  console.log("TEST ACTION CALLED");

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return {success : true}
  return {error : "error test"}
}