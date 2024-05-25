const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async (req, res) => {
  try {

    const {mail, password} = req.body;
    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
      const token = jwt.sign(
        {
          id: user._id,
          mail: user.mail,
        }, 
        process.env.TOKEN_KEY,
        {
          expiresIn: '24h'
        }
      );

      return res.status(200).json({
        userDetails: {
          id: user._id,
          username: user.username,
          mail: user.mail,
          token: token
        }
      })
    }

    return res.status(400).send('Invalid credentials. Please try again.');

  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again")
  }
}

module.exports = postLogin