import React from "react";
import { GeminiChatbot } from "./ui/gemini-chatbot";

const AstroAgentApp: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950">
      <GeminiChatbot isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default AstroAgentApp;
