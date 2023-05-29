import jsontoken from "jsonwebtoken";

//Create a vfunction to verify token
export const verifyTokenForUsers = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Validate the token
    if(!token == null) return res.sendStatus(401);
    jsontoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    });
}
