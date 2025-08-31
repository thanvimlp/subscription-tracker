import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    //it says protect the req and tell me your decision
    const decision = await aj.protect(req, { requested: 1 });
    //the second parameter defines , it take away one token from the bucket

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ error: "Rate limit exceeded" });
      if (decision.reason.isBot())
        return res.status(403).json({ error: "Bot detected" });

      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.log(`Arcjet error: ${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
