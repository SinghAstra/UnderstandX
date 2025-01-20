import { ProcessingUpdate } from "@/interfaces/processing";
import pusherServer from "@/lib/pusher/server";

export const sendProcessingUpdate = async (
  repositoryId: string,
  update: ProcessingUpdate
) => {
  const channel = `repository-${repositoryId}`;
  await pusherServer.trigger(channel, "processing-update", update);
};
