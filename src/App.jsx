import { useState } from "react";

import HomeScreen from "./components/HomeScreen";
import LessonView from "./components/LessonView";
import { generateStoryModule } from "./services/storyService";

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const handleGenerate = async (prompt) => {
    setGenerationError("");
    setIsGenerating(true);

    const module = await generateStoryModule(prompt);

    setIsGenerating(false);

    if (module) {
      setActiveModule(module);
      return;
    }

    setGenerationError(
      "Unable to generate a story right now. Check your API key and try again."
    );
  };

  if (!activeModule) {
    return (
      <HomeScreen
        onSelect={setActiveModule}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        generationError={generationError}
      />
    );
  }

  return (
    <LessonView
      module={activeModule}
      onBack={() => setActiveModule(null)}
    />
  );
}
