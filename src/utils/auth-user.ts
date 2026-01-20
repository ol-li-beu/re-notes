import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from "jose";
// falta importar cliente de base de datos instancia prisma?



// helper function to instanciate a token (JWT secure string)
export async function createToken(userId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ userId }) 
    .setProtectedHeader({ alg: "HS256" })     
    .setIssuedAt() // now                           
    .setExpirationTime("7d")                 
    .sign(secret);                            

  return token;
}



// function to get the user data after instanciating the JWT token 
export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    /* DE-COMMENT NEEDED
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, projects: true } 
    }); return userData;
    */

   return {id: 1, name: "Carlos, Castaña"} // mock

  } catch (error) {
    return null;
  }
}

