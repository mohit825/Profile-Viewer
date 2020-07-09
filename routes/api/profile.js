const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const { body, validationResult } = require('express-validator');

// GET /api/profile
// All profiles

router.get('/' , async (req,res)=>{
    try {
        let profiles = await Profile.find().populate('user' , ['avatar' , 'name']);
        if(profiles){
            res.status(200).json({profiles})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
});


// GET logged in user
router.get('/me' , auth, async (req,res)=>{
    try {
        console.log(req.user , 'iddd');
        
        const profile = await Profile.findOne({user: req.user}).populate('user' , ['name' , 'avatar']);
        if(!profile){
            return res.status(400).json({msg: 'No Profile Found'})
        }
        res.json(profile )
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})

//Create and update post

router.post('/' , [auth,
    body('status' , 'Status is required').not().isEmpty(),
    body('skills' , 'Skills are required').not().isEmpty()    
    ], async (req,res)=>{

    const ValidationErrors = validationResult(req);

    if (!ValidationErrors.isEmpty()) {
        res.status(400).json({
            Errors: ValidationErrors.array()
        })
    }
    const {company , website, location,
        status, skills , bio , githubusername,youtube,facebook,
        twitter, instagram,linkedin
    } = req.body;
    
    //Building profile obj
    const profileArr = {};
    profileArr.user = req.user;
    if(company) profileArr.company = company;
    if(website) profileArr.website = website;
    if(location) profileArr.location = location;
    if(status) profileArr.status = status;
    if(bio) profileArr.bio = bio;
    if(githubusername) profileArr.githubusername = githubusername;
    if(skills){
        profileArr.skills = skills.split(',').map((skill)=>{
            return skill.trim();
        });
    }

    //building social object.
    profileArr.social = {};
        if(youtube) profileArr.social.youtube = youtube;
        if(twitter) profileArr.social.twitter = twitter;
        if(linkedin) profileArr.social.linkedin = linkedin;
        if(instagram) profileArr.social.instagram = instagram;
        if(facebook) profileArr.social.facebook = facebook;
        
    // console.log(req.body,'req')
    try {
        let fetchedProfile = await Profile.findOne({user: req.user});
        // console.log(fetchedProfile,'aaa');
        if(fetchedProfile){
            //updating
            fetchedProfile = await Profile.findOneAndUpdate(
                {user: req.user},
                {$set: profileArr},
                {new: true}
            );
            return res.json(fetchedProfile);
        }
        
        //create profile
            profile = new Profile(profileArr);
            await profile.save();
            return res.json(profile)
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})



module.exports= router;