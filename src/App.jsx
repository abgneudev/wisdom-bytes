import { useState } from "react";

import HomeScreen from "./components/HomeScreen";
import LessonView from "./components/LessonView";

export default function App() {
  const [activeModule, setActiveModule] = useState(null);

  if (!activeModule) {
    return <HomeScreen onSelect={setActiveModule} />;
  }

  return (
    <LessonView
      module={activeModule}
      onBack={() => setActiveModule(null)}
    />
  );
}
