import { User } from './../models/user.model.js';

export const authCallback = async (req, res, next) => {
    try{
        const { id, firstName, LastName, imageUrl } = req.body;

        const user = await User.findOne({
            clerkId: id
        })

        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${LastName}`,
                imageUrl: imageUrl
            });
        }

        res.status(200).json({ success: true });
    }catch(err){
       console.error("Error creating song:", error);
        next(error);
    }
    
}