import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";
import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../utils/generateToken";
import bcrypt from "bcrypt"
import { AppError } from "../utils/error";
import { ObjectId } from "mongoose";


export const getSignUpService = async (name:string, role:string ,email: string, password:string, ) => {
    const userExist = await User.findOne({ email });
    const driverExist = await Driver.findOne({ email });

    
            if(userExist || driverExist){
                throw new AppError('Email Already Exist',400)
            }
    
            const HashPass: string = await bcrypt.hash(password, 10) ;
    
            const newUser = new User({
                name,
                email,
                password: HashPass,
                role,
            })
            await newUser.save();
    
            const token = generateToken(newUser._id, newUser.role)
    
            return{
                success:true,
                message:'Created User Successfully',
                user:{...newUser._doc, password:undefined},
                token
            }
}

export const getDriverSignUpService = async (name:string, email: string, password:string, licenseImage:string, bankName:string , accountNumber:string ,accountName:string ,phoneNumber:string , busData:any  ) => {
    const userExist = await User.findOne({ email });
    const driverExist = await Driver.findOne({ email });
    const driverAccount = await Driver.findOne({ "bankAccount.accountNumber": accountNumber })
    
            if(userExist || driverExist){
                throw new AppError('Email Already Exist',400)

            }
            if(driverAccount){
                throw new AppError('Bank Account Already Exist',400)

            }
    
            const HashPass: string = await bcrypt.hash(password, 10) ;

            const bankAccount={
                bankName,
                accountNumber,
                accountName
            }
    

            

            const newVehicle = new Vehicle({
                name:busData.vehicleName,
                color:busData.vehicleColor,
                model:busData.vehicleModel,
                capacity:busData.vehicleCapacity,
                plateNumber:busData.vehiclePlateNumber,
                yearlyCheck:busData.vehicleYearlyCheck,
            })

            const newDriver = new Driver({
                name,
                email,
                licenseImage,
                phoneNumber,
                vehicleId: newVehicle._id,
                password: HashPass,
                bankAccount
            });
            
            const token = generateToken(newDriver._id, newDriver.role)
            await newDriver.save();


            await newVehicle.save()
            await Vehicle.findByIdAndUpdate(
                    newVehicle._id,
                    { $set: { driverId: newDriver._id } },
                    { new: true }
);
            return{
                success:true,
                message:'Created Driver and Vehicle Successfully',
                newDriver,
                token
            }
}

export const getSignInService = async (email: string, password:string, ) => {
            const user = await User.findOne({ email });
            const driver = await Driver.findOne({ email });

            if(user){
                const passCorrect = await bcrypt.compare(password, user.password)
                if(!passCorrect){
                    throw new AppError('Email or Password Invalid',400)

                }
    
                const token = generateToken(user._id, user.role)
                return{
                    success: true, message:'Logged in successfully',
                    user: user,
                    token
                }
            }

            if(driver){
                const passCorrect = await bcrypt.compare(password, driver.password)
                if(!passCorrect){
                    throw new AppError('Email or Password Invalid',400)

                }
    
                const token = generateToken(driver._id, driver.role)
                return{
                    success: true, message:'Logged in successfully',
                    user: driver,
                    token
                }
            }

                    throw new AppError('Email or Password Invalid',400)

            
}



export const getSignOutService = async () =>{

        return{
            success:true,
            message: 'Logged out Successfully'
        }
}