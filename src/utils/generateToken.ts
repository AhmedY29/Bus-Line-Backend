import JWT, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export const generateToken = (userId: any, role:string) => {
    const token = JWT.sign({userId, role}, process.env.JWT_SECRET as string)

    return token
}

export const verifyToken = (token: string) =>{
    const verify= JWT.verify(token, process.env.JWT_SECRET as string)
    return verify as JwtPayload
}
