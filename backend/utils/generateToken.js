import jwt from 'jsonwebtoken';

const generateToken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return token;
  } catch (error) {
    console.error("Token generation failed:", error);
  }
};

export default generateToken;
