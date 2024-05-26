import React, { useEffect, useState } from "react";

const CheckSession = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5000/check-session");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("Error fetching session ", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  });

  return <div>CheckSession</div>;
};

export default CheckSession;
