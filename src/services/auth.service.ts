import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";
import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../utils/generateToken";
import bcrypt from "bcrypt"


export const getSignUpService = async (name:string, role:string ,email: string, password:string, ) => {
    const userExist = await User.findOne({ email });
    
            if(userExist){
                return {
                    success:false,
                    error:{
                        message:"Email Already Exist"
                    }
                }
            }
    
            const HashPass: string = await bcrypt.hash(password, 10) ;
    
            const newUser = new User({
                name,
                email,
                password: HashPass,
                role,
            })
            await newUser.save();
    
            const token = generateToken(newUser._id)
    
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
                return {
                    success:false,
                    error:{
                        message:"Email Already Exist"
                    }
                }
            }
            if(driverAccount){
                return {
                    success:false,
                    error:{
                        message:"Bank Account Already Exist"
                    }
                }
            }
    
            const HashPass: string = await bcrypt.hash(password, 10) ;

            const bankAccount={
                bankName,
                accountNumber,
                accountName
            }
    
            const newDriver = new Driver({
                name,
                email,
                licenseImage,
                phoneNumber,
                password: HashPass,
                bankAccount
            })
            await newDriver.save();
    
            const token = generateToken(newDriver._id)

            const newVehicle = new Vehicle({
                name:busData.vehicleName,
                color:busData.vehicleColor,
                model:busData.vehicleModel,
                driverId:newDriver._id,
                capacity:busData.vehicleCapacity,
                plateNumber:busData.vehiclePlateNumber,
                yearlyCheck:busData.vehicleYearlyCheck,
            })

            await newVehicle.save()
    
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
                    return{
                        success:false,
                        error:{
                            message:"Email or Password Invalid"
                        }
                    }
                }
    
                const token = generateToken(user._id)
                return{
                    success: true, message:'Logged in successfully',
                    user: user,
                    token
                }
            }

            if(driver){
                const passCorrect = await bcrypt.compare(password, driver.password)
                if(!passCorrect){
                    return{
                        success:false,
                        error:{
                            message:"Email or Password Invalid"
                        }
                    }
                }
    
                const token = generateToken(driver._id)
                return{
                    success: true, message:'Logged in successfully',
                    user: driver,
                    token
                }
            }

                return{
                    success:false,
                    error:{
                        message:"Email or Password Invalid"
                    }
                }
            
}



export const getSignOutService = async () =>{

        return{
            success:true,
            message: 'Logged out Successfully'
        }
}