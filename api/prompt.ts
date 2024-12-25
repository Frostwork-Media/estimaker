import { VercelApiHandler } from "@vercel/node";
import { userFromSession } from "./_auth";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const handler: VercelApiHandler = async (req, res) => {
  const [user, email] = await userFromSession(req);
  if (!user || !email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!req.body.prompt) {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  try {
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `Create a graph structure for: ${req.body.prompt}. 
                 Return only valid JSON with nodes of type "estimate" or "derivative".
                 Each estimate node should have a name and variableName.
                 Each derivative node should have a name, variableName, and value (which is a squiggle expression).
                 Position nodes with x and y coordinates between 0 and 500.`
      }]
    });

    // For now just return the raw response
    res.status(200).json({ 
      success: true,
      response: completion.content
    });
  } catch (error) {
    console.error('Error processing prompt:', error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
};

export default handler;
