import { useEffect } from 'react';
export function useInfiniteScroll(ref, onLoadMore, hasMore) {
    useEffect(() => {
        if (!ref.current || !hasMore) return;
        const el = ref.current;
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) onLoadMore();
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, onLoadMore, hasMore]);
}