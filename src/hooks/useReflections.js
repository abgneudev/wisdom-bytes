import { useState, useEffect } from "react";
import { generateReflections } from "../services/reflectionService";

/**
 * Handles the lifecycle of AI reflection generation.
 * Fires automatically when the learner reaches the reflection card.
 *
 * @param {boolean} isReflectionCard — true when the current card is "reflection"
 * @param {Record<string, string>} responses — collected inflection answers
 * @param {Record<string, { label: string, storyContext: string }>} inflectionContext — from the active module
 * @param {{ title: string, subtitle: string }} moduleMeta — title + subtitle of the active module
 */
export function useReflections(isReflectionCard, responses, inflectionContext, moduleMeta) {
  const [reflections, setReflections] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchReflections = () => {
    setIsLoading(true);
    setHasError(false);
    generateReflections(responses, inflectionContext, moduleMeta).then((result) => {
      setIsLoading(false);
      if (result) {
        setReflections(result);
      } else {
        setHasError(true);
      }
    });
  };

  useEffect(() => {
    if (isReflectionCard && !reflections && !isLoading) {
      fetchReflections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReflectionCard]);

  const retry = () => fetchReflections();

  return { reflections, isLoading, hasError, retry };
}
