const express = require('express');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        console.log(res.userObj)
        res.send(res.userObj);
    } catch (err) {
        console.log(err);
        res.status(401).send(err.message);;
    }
})


module.exports= profileRouter;