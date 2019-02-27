const bcrypt = require('bcryptjs')

module.exports = {
    signup: async (req, res) => {
        try {
            //user inputs their info: name, email, password
           //check to see if email already in db
           //create a salt
           //create a hash from password and salt
           //create record for user in db
           //add user to the session
            
            const db = req.app.get('db')
            let { name, email, password } = req.body
    
            let userResponse = await db.findUserByEmail(email)
            let user = userResponse[0]
    
            if (user) {

                return res.status(409).send('email already used')
            }
    
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
    
            let createdUser = await db.createUser({name, email, hash})
            req.session.user = createdUser[0]
            res.send(req.session.user)
        } catch(error) {
            console.log('error occurred', error)
            res.status(500).send(error)
        }

    },

    login: async (req, res) => {
        try {
            //user inputs info: email, password
            //get user from db
            //if no user, send 404 satus
            //if there's a user, compare password and the hash using bcrypt
            //if they don't match send 401
            //if they match save user on session

            let db = req.app.get('db')
            let { email, password } = req.body

            let userResponse = await db.findUserByEmail(email)
            let user = userResponse[0]

            if(!user) {
                return res.status(409).send('email not found')
            }

            const isAuthenticated = bcrypt.compareSync(password, user.password)

            if(!isAuthenticated) {
                return res.status(401).send('incorrect password')
            }

            delete user.password

            req.session.user = user
            res.send(user)
        }catch (error) {
            console.log('error logging in user')
            res.status(500).send(error)
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200).send('successfully logged out')
    },

    current: (req, res) => {
        res.send(req.session.user)
    }
}