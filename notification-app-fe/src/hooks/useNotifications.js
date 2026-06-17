import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications();

      const sorted = [...(data.notifications || [])].sort((a, b) => {
        const priorityDiff =
          priorityMap[b.Type] - priorityMap[a.Type];

        if (priorityDiff !== 0) return priorityDiff;

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      });

      setNotifications(sorted.slice(0, 10));
    };

    load();
  }, []);

  return {
    notifications,
    totalPages: 1,
    loading: false,
    error: null,
  };
}