import { Request, Response } from "express";
import { verifyToken } from "../utils/generateToken";
import { User } from "../models/user.model";
import { Driver } from "../models/driver.model";
import { Vehicle } from "../models/vehicle.model";
import { deleteDriver, deleteUser, deleteVehicle, getAllDrivers, getAllUsers, getAllVehicles, getDriverById, getUserById, getVehicleById, updateDriver, updateDriverStatus, updateUser, updateVehicle } from "../services/admin.service";



export const getUsers = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    const user = await User.findById(verify.userId)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(user?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const users = await getAllUsers()
    res.status(200)
    .json({
        success: true,
        users
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Users: ${error.message}`
        })
    }
}

export const getOneUser = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const {userId} = req.params;

    if(!userId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const user = await getUserById(userId)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        user
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Users: ${error.message}`
        })
    }
}

export const editOneUser = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { userId } = req.params;

    if(!userId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const user = await updateUser(userId, req.body);
        if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'User Updated Successfully',
        user
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Update User: ${error.message}`
        })
    }
}

export const deleteOneUser = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { userId } = req.params;

    if(!userId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const user = await deleteUser(userId)
        if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'User Deleted Successfully',
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Delete User: ${error.message}`
        })
    }
}


export const getDrivers = async (req:Request, res: Response) =>{
   const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const user = await User.findById(verify.userId)
    console.log(user)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(user?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await getAllDrivers()
    res.status(200)
    .json({
        success: true,
        driver
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Drivers: ${error.message}`
        })
    }
}

export const getOneDriver = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { driverId } = req.params;

    if(!driverId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await getDriverById(driverId)
    if(!driver){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Driver Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        driver
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Users: ${error.message}`
        })
    }
}

export const editOneDriver = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { driverId } = req.params;

    if(!driverId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await updateDriver(driverId, req.body)
        if(!driver){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Driver Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'Driver Updated Successfully',
        driver
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Users: ${error.message}`
        })
    }
}

export const deleteOneDriver = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { driverId } = req.params;

    if(!driverId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add User ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await deleteDriver(driverId)
        if(!driver){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Driver Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'Driver Deleted Successfully',
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Delete Driver: ${error.message}`
        })
    }
}




export const approveDriver = async (req:Request, res: Response) =>{
   const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { driverId } = req.params
        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const user = await User.findById(verify.userId)
    console.log(user)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(user?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await Driver.findOne({_id:driverId}).select('-password')

    if(!driver) {
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Driver Not Found '
        })
        return
    }

    const approveDriver = await updateDriverStatus(driverId, 'approved')
    res.status(200)
    .json({
        success: true,
        message: 'Driver Approved Successfully'
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Update Driver Status: ${error.message}`
        })
    }
}

export const rejectedDriver = async (req:Request, res: Response) =>{
   const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { driverId } = req.params
        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const user = await User.findById(verify.userId)
    console.log(user)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(user?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const driver = await Driver.findOne({_id:driverId}).select('-password')

    if(!driver) {
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Driver Not Found '
        })
        return
    }

    const rejectDriver = await updateDriverStatus(driverId, 'rejected')

    res.status(200)
    .json({
        success: true,
        message: 'Driver Rejected Successfully'
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Update Driver Status: ${error.message}`
        })
    }
}



// Vehicles


export const getVehicles = async (req:Request, res: Response) =>{
   const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const user = await User.findById(verify.userId)
    console.log(user)
    if(!user){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(user?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const vehicles = await getAllVehicles()
    res.status(200)
    .json({
        success: true,
        vehicles
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Vehicles: ${error.message}`
        })
    }
}

export const getOneVehicle = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { vehicleId } = req.params;

    if(!vehicleId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add Vehicle Id at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const vehicle = await getVehicleById(vehicleId)
    if(!vehicle){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'vehicle Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        vehicle
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get vehicle: ${error.message}`
        })
    }
}

export const editOneVehicle = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { vehicleId } = req.params;

    if(!vehicleId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add Vehicle ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }
    const vehicle = await updateVehicle(vehicleId, req.body)
        if(!vehicle){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'vehicle Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'Driver Updated Successfully',
        vehicle
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Get Users: ${error.message}`
        })
    }
}

export const deleteOneVehicles = async (req:Request, res: Response) =>{
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    const { vehicleId } = req.params;

    if(!vehicleId){
        res.status(400) //BAD_REQUEST
        .json({
            success: false,
            error: 'Please Add vehicle ID at Params'
        })
        return;
    }

        if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }

    try {
    console.log(verify.userId)
    const admin = await User.findById(verify.userId)
    console.log(admin)
    if(!admin){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'User Not Found '
        })
        return
    }
        if(admin?.role != 'admin'){
        res.status(403) //UNAUTHORIZE
        .json({
            success:false,
            error:'UNAUTHORIZE'
        })
        return
    }

    const vehicle = await deleteVehicle(vehicleId)
        if(!vehicle){
        res.status(404) //NOT_FOUND
        .json({
            success:false,
            error:'Vehicle Not Found '
        })
        return
    }
    res.status(200) //OK
    .json({
        success: true,
        message: 'vehicle Deleted Successfully',
    })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:`Error in Delete vehicle: ${error.message}`
        })
    }
}

