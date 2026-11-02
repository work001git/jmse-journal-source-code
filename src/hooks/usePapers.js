import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePapers = (userId = null) => {
  const [allPapers, setAllPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      let query = supabase
        .from('manuscripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        // User's own submissions (show everything)
        query = query.eq('user_id', userId);
      } else {
        // Public pages (show only Accepted or Published)
        query = query.in('status', ['Accepted', 'Published']);
      }

      const { data, error } = await query;

      if (!error) {
        setAllPapers(data);
      }
      setLoading(false);
    };

    fetchPapers();
  }, [userId]);

  return { allPapers, loading };
};
