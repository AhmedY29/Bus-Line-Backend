import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../utils/generateToken";
import { editUserService, getDriverSignUpService, getSignInService, getSignOutService, getSignUpService } from "../services/auth.service";



export const signUp = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body
    try {
        if(!name){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Name Felid!'
                }
            })
            return;
        }
        if(!email ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Email Felid!'
                }
            })
            return;
        }
        if(!password){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Password Felid!'
                }
            })
            return;
        }

            // const header = new Headers({Authorization: `Bearer ${token}`})
            // res.setHeaders(header)

            const signUpService = await getSignUpService(name, role, email, password)

        res.status(201) //CREATED
        .json(signUpService)
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign Up: ${error.message}`
            }
        })
    }

}

export const driverSignUp = async (req: Request, res: Response) => {
    const { name, email, password,phoneNumber, licenseImage, bankName, accountNumber, accountName, vehicleName, vehicleColor, vehicleModel, vehicleCapacity, vehiclePlateNumber, vehicleYearlyCheck, vehicleImage } = req.body
    try {
        if(!name){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Name Felid!'
                }
            })
            return;
        }
        if(!email ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Email Felid!'
                }
            })
            return;
        }
        if(!password){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Password Felid!'
                }
            })
            return;
        }
        if(!phoneNumber){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Phone Number Felid!'
                }
            })
            return;
        }
        if(!licenseImage ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill license Image Felid!'
                }
            })
            return;
        }
        if(!bankName){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Bank Name Felid!'
                }
            })
            return;
        }
        if(!accountNumber){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Account Number Felid!'
                }
            })
            return;
        }
        if(!accountName ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Account Name Felid!'
                }
            })
            return;
        }
        if(!vehicleName){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Name Felid!'
                }
            })
            return;
        }
        if(!vehicleColor){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Color Felid!'
                }
            })
            return;
        }
        if(!vehicleModel){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Model Felid!'
                }
            })
            return;
        }
        if(!vehicleCapacity){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Capacity Felid!'
                }
            })
            return;
        }
        if(!vehiclePlateNumber ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle PlateNumber Felid!'
                }
            })
            return;
        }
        if(!vehicleImage ){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Image Felid!'
                }
            })
            return;
        }
        if(!vehicleYearlyCheck){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill vehicle Yearly Check Felid!'
                }
            })
            return;
        }

        const busData = {
            vehicleName,
            vehicleColor,
            vehicleModel,
            vehicleCapacity,
            vehiclePlateNumber,
            vehicleImage,
            vehicleYearlyCheck,
        }

            // const header = new Headers({Authorization: `Bearer ${token}`})
            // res.setHeaders(header)

            const signUpService = await getDriverSignUpService(name, email, password ,licenseImage, bankName, accountNumber, accountName, phoneNumber , busData)

        res.status(201) //CREATED
        .json(signUpService)
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Driver Sign Up: ${error.message}`
            }
        })
    }

}

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if(!email){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Email Felid!'
                }
            })
            return;
        }

        if(!password){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Password Felid!'
                }
            })
            return;
        }

        // const header = new Headers({Authorization: `Bearer ${token}`})
        // res.setHeaders(header)
        const signInService = await getSignInService(email, password)
    res.status(200) // OK
    .json(signInService)

    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign In: ${error.message}`
            }
        })
    }

}

export const editUserData = async (req: Request, res: Response) => {
    const tokenHeader = req.headers.authorization;
        console.log(tokenHeader)
        if (!tokenHeader) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
        }
        const token = tokenHeader.split(" ")[1]
        const verify = verifyToken(token)

        console.log(verify)

        if(!verify){
            res.status(401) // UNAUTHORIZED
            .json({
                success: false,
                error:{
                    message: 'Token Invalid'
                }
            })
        }
    try {
        

        // const header = new Headers({Authorization: `Bearer ${token}`})
        // res.setHeaders(header)
        const signInService = await editUserService(verify.userId, req.body)
    res.status(200) // OK
    .json(signInService)

    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Edit User: ${error.message}`
            }
        })
    }

}

export const signOut = async (req: Request, res: Response) => {
    try {
        const tokenHeader = req.headers.authorization;
        console.log(tokenHeader)
        if (!tokenHeader) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
        }
        const token = tokenHeader.split(" ")[1]
        const verify = verifyToken(token)

        console.log(verify)

        if(!verify){
            res.status(401) // UNAUTHORIZED
            .json({
                success: false,
                error:{
                    message: 'Token Invalid'
                }
            })
        }

        const signOutService = await getSignOutService()

        res.status(200) // OK
        .json(signOutService)

    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign Out: ${error.message}`
            }
        })
    }

}