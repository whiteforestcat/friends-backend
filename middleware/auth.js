import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // console.log(token) will give Bearer xxxxxx
    if (!token) {
      return res.status(403).send("Accesss Denied");
    }
    if (token.startsWith("Bearer ")) {
      // to remove the phrase "Bearer " in token
      token = token.slice(7, token.length).trimLeft();
      // 7 because "Bearer " has 7 char
      // trimLeft removes all whitespaces before, in between and after in a string
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // adding new key-value pair to req ie {user: verified}
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
