"use client";

import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const RepositoryDetailsPage = () => {
  const [repository, setRepository] = useState();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [message, setMessage] = useState<string | null>();

  useEffect(() => {
    const fetchRepository = async () => {
      const response = await fetch(`/api/repository/${id}`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to fetch repository details.");
        return;
      }
      setRepository(data.repository);
    };
    fetchRepository();
  }, [id]);

  console.log("repository", repository);

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [message, toast]);
  return <div>RepositoryDetailsPage</div>;
};

export default RepositoryDetailsPage;
