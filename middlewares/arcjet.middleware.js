import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    
    // Get Arcjet Decision
    const decision = await aj.protect(req, { requested : 1 });

    // Arcject Allowed
    if (decision.isAllowed())  {
      next();
      return;
    }
    
    // Arcjet Denied
    if (decision.reason.isRateLimit()) return res.status(429).json({ error : "Rate Limit Exceeded "});
    if (decision.reason.isBot()) return res.status(429).json({ error : "Bot Access Detected"});

    // Other reasons
    return res.status(403).json({ error : "Access Denied" });

  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
  }
}

export default arcjetMiddleware;