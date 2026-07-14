import { useEffect, useState } from "react";
import { quoteService } from "@/features/quotes/services/quoteService";

export function useQuoteOfTheDay() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quoteService.getToday();
        if (!active) return;
        if (data?.text) {
          setQuote({
            text: data.text,
            authorName: data.author_name ?? "",
            sourceWork: data.source_work ?? "",
          });
        } else {
          setQuote(null);
        }
      } catch (err) {
        if (!active) return;
        setError(err);
        setQuote(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadQuote();
    return () => {
      active = false;
    };
  }, []);

  return { quote, loading, error };
}
